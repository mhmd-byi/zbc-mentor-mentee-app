"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { duplicateKeyMessage, ensureUserIndexes, getUsers } from "@/lib/db";
import { confirmEmail, sendVerificationEmail } from "@/lib/email-verification";
import {
  menteeProfileSchema,
  menteeSignupSchema,
  type MenteeFormValues,
} from "@/lib/mentee-schema";
import { hashPassword } from "@/lib/password";
import { DASHBOARD_PATHS } from "@/lib/roles";
import type { FormState } from "@/lib/schemas";
import { createSession } from "@/lib/session";

const RESEND_WAIT_MS = 60 * 1000;

// Open to anyone, so it can only ever create an unverified mentee.
export async function joinAsMentee(
  _state: FormState,
  values: MenteeFormValues,
): Promise<FormState> {
  const signedIn = await getCurrentUser();
  if (signedIn) redirect(DASHBOARD_PATHS[signedIn.role]);

  const parsed = menteeSignupSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, phone, itsId, city, mohalla, password } = parsed.data;

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
      role: "mentee",
      status: "active",
      createdAt: new Date(),
      // This schema keeps only the profile answers.
      mentee: menteeProfileSchema.parse(values),
      emailVerified: false,
    });
  } catch (error) {
    return { error: duplicateKeyMessage(error) };
  }

  // If this fails, their dashboard offers to send it again.
  await sendVerificationEmail(_id, email);
  await createSession(_id.toString());
  redirect("/mentee");
}

export async function resendVerification(): Promise<FormState> {
  const { id } = await requireRole("mentee");
  const _id = new ObjectId(id);
  const user = await getUsers().findOne(
    { _id },
    { projection: { email: 1, emailVerified: 1, emailVerification: 1 } },
  );
  if (!user || user.emailVerified !== false) {
    return { success: "Your email is already verified." };
  }
  const sentAt = user.emailVerification?.sentAt.getTime() ?? 0;
  if (Date.now() - sentAt < RESEND_WAIT_MS) {
    return { error: "Wait a minute before asking for another email." };
  }

  const sent = await sendVerificationEmail(_id, user.email);
  revalidatePath("/mentee");
  return sent
    ? { success: "Email sent. Use the link in the newest one." }
    : { error: "We couldn't send the email. Try again shortly." };
}

// Open to anyone holding the link, which may be opened on another device.
export async function verifyEmail(token: string): Promise<FormState> {
  if (typeof token !== "string" || !(await confirmEmail(token))) {
    return {
      error: "This link is invalid or has expired. Sign in to get a new one.",
    };
  }
  revalidatePath("/mentee");
  return { success: "Your email is verified. You're on the waiting list." };
}
