"use server";

import { redirect } from "next/navigation";
import { getUsers } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { DASHBOARD_PATHS } from "@/lib/roles";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = { error?: string };

export async function login(
  _state: LoginState,
  values: LoginValues,
): Promise<LoginState> {
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
  redirect(DASHBOARD_PATHS[user.role]);
}

export async function logout() {
  await deleteSession();
}
