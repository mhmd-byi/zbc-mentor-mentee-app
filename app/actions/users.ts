"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import {
  duplicateKeyMessage,
  ensureUserIndexes,
  getUsers,
  inTransaction,
  type UserDocument,
} from "@/lib/db";
import { notifyPairings } from "@/lib/pairing-emails";
import { endActivePairings, type PairingIds } from "@/lib/pairing-service";
import { hashPassword } from "@/lib/password";
import { passwordSchema, type FormState } from "@/lib/schemas";
import {
  newUserSchema,
  userSchema,
  type UserFormValues,
} from "@/lib/user-schema";

const NOT_FOUND = "That account no longer exists.";

async function updateById(id: string, changes: Partial<UserDocument>) {
  if (!ObjectId.isValid(id)) return false;
  const result = await getUsers().updateOne(
    { _id: new ObjectId(id) },
    { $set: changes },
  );
  return result.matchedCount === 1;
}

// Emails the people whose pairings a change ended, and words it for the admin.
async function announceEnded(ended: PairingIds[]) {
  if (ended.length === 0) return "";
  const emailed = await notifyPairings("ended", ended);
  const count =
    ended.length === 1 ? "1 pairing was" : `${ended.length} pairings were`;
  const warning = emailed
    ? ""
    : " An email couldn't be sent, so please tell them yourself.";
  return ` ${count} ended.${warning}`;
}

export async function createUser(
  _state: FormState,
  values: UserFormValues,
): Promise<FormState> {
  await requireRole("admin");
  const parsed = newUserSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { password, ...details } = parsed.data;

  try {
    await ensureUserIndexes();
    await getUsers().insertOne({
      ...details,
      passwordHash: await hashPassword(password),
      status: "active",
      mustChangePassword: true,
      createdAt: new Date(),
    });
  } catch (error) {
    return { error: duplicateKeyMessage(error) };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin?created");
}

export async function updateUser(
  userId: string,
  _state: FormState,
  values: UserFormValues,
): Promise<FormState> {
  const admin = await requireRole("admin");
  const parsed = userSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  // Together with the status rule below, this keeps at least one active admin.
  if (userId === admin.id && parsed.data.role !== "admin") {
    return { error: "You can't change your own role." };
  }

  if (!ObjectId.isValid(userId)) return { error: NOT_FOUND };
  const _id = new ObjectId(userId);

  let ended: PairingIds[] | null;
  try {
    await ensureUserIndexes();
    ended = await inTransaction(async (session) => {
      const before = await getUsers().findOneAndUpdate(
        { _id },
        { $set: parsed.data },
        { session, projection: { role: 1 } },
      );
      if (!before) return null;
      // A pairing doesn't survive its mentor or mentee changing role.
      if (before.role === parsed.data.role) return [];
      return endActivePairings(
        _id,
        "An admin changed their role.",
        admin.id,
        session,
      );
    });
  } catch (error) {
    return { error: duplicateKeyMessage(error) };
  }
  if (!ended) return { error: NOT_FOUND };

  const announcement = await announceEnded(ended);
  revalidatePath("/admin", "layout");
  return { success: `Changes saved.${announcement}` };
}

export async function setTemporaryPassword(
  userId: string,
  _state: FormState,
  values: { password: string },
): Promise<FormState> {
  const admin = await requireRole("admin");
  if (userId === admin.id) {
    return { error: "You can't reset your own password here." };
  }
  const parsed = passwordSchema.safeParse(values.password);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const updated = await updateById(userId, {
    passwordHash: await hashPassword(parsed.data),
    mustChangePassword: true,
    passwordChangedAt: new Date(),
  });
  if (!updated) return { error: NOT_FOUND };

  return {
    success:
      "Temporary password set. They've been signed out and must change it at their next sign-in.",
  };
}

export async function setUserStatus(
  userId: string,
  _state: FormState,
  status: string,
): Promise<FormState> {
  const admin = await requireRole("admin");
  if (userId === admin.id) {
    return { error: "You can't deactivate your own account." };
  }
  if (status !== "active" && status !== "deactivated") {
    return { error: "Unknown account status." };
  }
  if (!ObjectId.isValid(userId)) return { error: NOT_FOUND };
  const _id = new ObjectId(userId);

  const ended = await inTransaction(async (session) => {
    const result = await getUsers().updateOne(
      { _id },
      { $set: { status } },
      { session },
    );
    if (!result.matchedCount) return null;
    if (status === "active") return [];
    return endActivePairings(
      _id,
      "An admin deactivated their account.",
      admin.id,
      session,
    );
  });
  if (!ended) return { error: NOT_FOUND };

  const announcement = await announceEnded(ended);
  revalidatePath("/admin", "layout");
  return announcement ? { success: announcement.trim() } : {};
}
