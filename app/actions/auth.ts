"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getUsers } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { DASHBOARD_PATHS } from "@/lib/roles";
import {
  loginSchema,
  newPasswordSchema,
  type FormState,
  type LoginValues,
  type NewPasswordValues,
} from "@/lib/schemas";
import { createSession, deleteSession } from "@/lib/session";

export async function login(
  _state: FormState,
  values: LoginValues,
): Promise<FormState> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { error: "Enter your email and password." };

  const user = await getUsers().findOne({
    email: parsed.data.email.toLowerCase(),
  });
  const passwordMatches = await verifyPassword(
    parsed.data.password,
    user?.passwordHash,
  );
  if (!user || !passwordMatches) {
    return { error: "The email or password is incorrect." };
  }
  if (user.status !== "active") {
    return { error: "This account is deactivated. Contact an administrator." };
  }

  await createSession(user._id.toString());
  redirect(
    user.mustChangePassword ? "/change-password" : DASHBOARD_PATHS[user.role],
  );
}

export async function changePassword(
  _state: FormState,
  values: NewPasswordValues,
): Promise<FormState> {
  const user = await requireUser();
  // Only for replacing a temporary password, since it doesn't ask for the old one.
  if (!user.mustChangePassword) redirect(DASHBOARD_PATHS[user.role]);

  const parsed = newPasswordSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const _id = new ObjectId(user.id);
  const current = await getUsers().findOne(
    { _id },
    { projection: { passwordHash: 1 } },
  );
  if (await verifyPassword(parsed.data.password, current?.passwordHash)) {
    return { error: "Choose a password that differs from the temporary one." };
  }

  await getUsers().updateOne(
    { _id },
    {
      $set: {
        passwordHash: await hashPassword(parsed.data.password),
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    },
  );
  await createSession(user.id);
  redirect(DASHBOARD_PATHS[user.role]);
}

export async function logout() {
  await deleteSession();
}
