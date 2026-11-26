"use server";

import { ObjectId, type Filter, type UpdateFilter } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import {
  duplicateKeyMessage,
  ensureUserIndexes,
  getPairings,
  getUsers,
  inTransaction,
  type UserDocument,
} from "@/lib/db";
import {
  maxMenteesSchema,
  mentorApplicationSchema,
  mentorDetailsSchema,
  rejectionReasonSchema,
  type MentorFormValues,
} from "@/lib/mentor-schema";
import { hashPassword } from "@/lib/password";
import { DASHBOARD_PATHS } from "@/lib/roles";
import type { FormState } from "@/lib/schemas";
import { createSession } from "@/lib/session";

const OUT_OF_DATE =
  "This application has changed since you opened it. Reload the page.";

// Open to anyone, so it can only ever create a mentor with a pending application.
export async function applyAsMentor(
  _state: FormState,
  values: MentorFormValues,
): Promise<FormState> {
  const signedIn = await getCurrentUser();
  if (signedIn) redirect(DASHBOARD_PATHS[signedIn.role]);

  const parsed = mentorApplicationSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { email, password } = parsed.data;
  // This schema keeps only the person's details and answers.
  const { name, phone, itsId, city, mohalla, ...answers } =
    mentorDetailsSchema.parse(values);

  const _id = new ObjectId();
  try {
    await ensureUserIndexes();
    await getUsers().insertOne({
      _id,
      name,
      email,
      phone,
      itsId,
      city,
      mohalla,
      passwordHash: await hashPassword(password),
      role: "mentor",
      status: "active",
      createdAt: new Date(),
      mentor: {
        ...answers,
        applicationStatus: "pending",
        submittedAt: new Date(),
      },
    });
  } catch (error) {
    return { error: duplicateKeyMessage(error) };
  }

  await createSession(_id.toString());
  redirect("/mentor");
}

export async function resubmitApplication(
  _state: FormState,
  values: MentorFormValues,
): Promise<FormState> {
  const user = await requireRole("mentor");
  const parsed = mentorDetailsSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, phone, itsId, city, mohalla, ...answers } = parsed.data;

  try {
    await ensureUserIndexes();
    // Only a rejected application can be sent again.
    const result = await getUsers().updateOne(
      { _id: new ObjectId(user.id), "mentor.applicationStatus": "rejected" },
      {
        $set: {
          name,
          phone,
          itsId,
          city,
          mohalla,
          mentor: {
            ...answers,
            applicationStatus: "pending",
            submittedAt: new Date(),
          },
        },
      },
    );
    if (!result.matchedCount) return { error: OUT_OF_DATE };
  } catch (error) {
    return { error: duplicateKeyMessage(error) };
  }

  revalidatePath("/mentor");
  return {};
}

// Applies a change only if the mentor is still in the expected state.
async function updateMentor(
  id: string,
  expected: Filter<UserDocument>,
  change: UpdateFilter<UserDocument>,
) {
  if (!ObjectId.isValid(id)) return false;
  const result = await getUsers().updateOne(
    { ...expected, _id: new ObjectId(id), role: "mentor" },
    change,
  );
  if (!result.matchedCount) return false;
  revalidatePath("/counselor", "layout");
  return true;
}

export async function approveMentor(
  mentorId: string,
  _state: FormState,
  values: { maxMentees: string },
): Promise<FormState> {
  const reviewer = await requireRole("counselor", "admin");
  const parsed = maxMenteesSchema.safeParse(values.maxMentees);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const approved = await updateMentor(
    mentorId,
    { "mentor.applicationStatus": { $in: ["pending", "rejected"] } },
    {
      $set: {
        "mentor.applicationStatus": "approved",
        "mentor.maxMentees": parsed.data,
        "mentor.reviewedAt": new Date(),
        "mentor.reviewedBy": reviewer.id,
      },
      $unset: { "mentor.rejectionReason": "" },
    },
  );
  return approved ? { success: "Mentor approved." } : { error: OUT_OF_DATE };
}

export async function rejectMentor(
  mentorId: string,
  _state: FormState,
  values: { reason: string },
): Promise<FormState> {
  const reviewer = await requireRole("counselor", "admin");
  const parsed = rejectionReasonSchema.safeParse(values.reason);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const rejected = await updateMentor(
    mentorId,
    { "mentor.applicationStatus": "pending" },
    {
      $set: {
        "mentor.applicationStatus": "rejected",
        "mentor.rejectionReason": parsed.data,
        "mentor.reviewedAt": new Date(),
        "mentor.reviewedBy": reviewer.id,
      },
    },
  );
  return rejected
    ? { success: "Application rejected." }
    : { error: OUT_OF_DATE };
}

export async function setMaxMentees(
  mentorId: string,
  _state: FormState,
  values: { maxMentees: string },
): Promise<FormState> {
  await requireRole("counselor", "admin");
  const parsed = maxMenteesSchema.safeParse(values.maxMentees);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (!ObjectId.isValid(mentorId)) return { error: OUT_OF_DATE };
  const _id = new ObjectId(mentorId);

  // In a transaction, so a pairing made at the same moment can't slip past.
  const result = await inTransaction<FormState>(async (session) => {
    const active = await getPairings().countDocuments(
      { mentorId: _id, status: "active" },
      { session },
    );
    if (parsed.data < active) {
      return {
        error: `They have ${active} mentees. End a pairing before lowering the limit below that.`,
      };
    }
    const update = await getUsers().updateOne(
      {
        _id,
        role: "mentor",
        // Approved mentors, including those an admin created.
        "mentor.applicationStatus": { $nin: ["pending", "rejected"] },
      },
      { $set: { "mentor.maxMentees": parsed.data } },
      { session },
    );
    return update.matchedCount
      ? { success: "Mentee limit saved." }
      : { error: OUT_OF_DATE };
  });

  revalidatePath("/counselor", "layout");
  return result;
}
