import "server-only";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getUsers } from "./db";
import { DASHBOARD_PATHS, type Role } from "./roles";
import { readSession } from "./session";

export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session || !ObjectId.isValid(session.userId)) return null;

  // Checked in the database on every request, so deactivation takes effect at once.
  const user = await getUsers().findOne(
    { _id: new ObjectId(session.userId), status: "active" },
    {
      projection: {
        name: 1,
        role: 1,
        mustChangePassword: 1,
        passwordChangedAt: 1,
      },
    },
  );
  if (!user) return null;

  // A password change signs out every session issued before it.
  const changedAt = user.passwordChangedAt?.getTime() ?? 0;
  if (session.issuedAt < Math.floor(changedAt / 1000)) return null;

  return {
    id: session.userId,
    name: user.name,
    role: user.role,
    mustChangePassword: user.mustChangePassword ?? false,
  };
});

// For pages open to any signed-in user, including one still on a temporary password.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Call this in every page and server action that needs a particular role.
export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (user.mustChangePassword) redirect("/change-password");
  if (!roles.includes(user.role)) redirect(DASHBOARD_PATHS[user.role]);
  return user;
}
