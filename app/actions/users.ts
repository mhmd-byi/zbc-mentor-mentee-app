"use server";

import { MongoServerError, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { ensureUserIndexes, getUsers, type UserDocument } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { passwordSchema, type FormState } from "@/lib/schemas";
import {
  newUserSchema,
  userSchema,
  type UserFormValues,
} from "@/lib/user-schema";

const NOT_FOUND = "That account no longer exists.";

function duplicateKeyMessage(error: unknown) {
  // 11000 is MongoDB's duplicate key error. Anything else is unexpected.
  if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
  return error.keyPattern?.itsId
    ? "That ITS ID belongs to another account."
    : "An account with that email already exists.";
}

async function updateById(id: string, changes: Partial<UserDocument>) {
  if (!ObjectId.isValid(id)) return false;
  const result = await getUsers().updateOne(
    { _id: new ObjectId(id) },
    { $set: changes },
  );
  return result.matchedCount === 1;
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

  try {
    await ensureUserIndexes();
    if (!(await updateById(userId, parsed.data))) return { error: NOT_FOUND };
  } catch (error) {
    return { error: duplicateKeyMessage(error) };
  }

  revalidatePath("/admin", "layout");
  return { success: "Changes saved." };
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
  if (!(await updateById(userId, { status }))) return { error: NOT_FOUND };

  revalidatePath("/admin", "layout");
  return {};
}
