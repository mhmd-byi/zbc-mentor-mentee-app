import "server-only";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getUsers } from "./db";
import { DASHBOARD_PATHS, type Role } from "./roles";
import { readSessionUserId } from "./session";

export const getCurrentUser = cache(async () => {
  const userId = await readSessionUserId();
  if (!userId || !ObjectId.isValid(userId)) return null;

  // Checked in the database on every request, so deactivation takes effect at once.
  const user = await getUsers().findOne(
    { _id: new ObjectId(userId), status: "active" },
    { projection: { name: 1, role: 1 } },
  );
  return user && { name: user.name, role: user.role };
});

// Call this in every page and server action that needs a signed-in user.
export async function requireRole(...roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(DASHBOARD_PATHS[user.role]);
  return user;
}
