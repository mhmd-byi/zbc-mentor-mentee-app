import "server-only";
import { ObjectId } from "mongodb";
import { requireRole } from "./auth";
import { getUsers } from "./db";

// Where the signed-in mentee stands with verifying their email.
export async function getOwnEmailStatus() {
  const { id } = await requireRole("mentee");
  const user = await getUsers().findOne(
    { _id: new ObjectId(id) },
    { projection: { email: 1, emailVerified: 1, emailVerification: 1 } },
  );
  return (
    user && {
      email: user.email,
      verified: user.emailVerified !== false,
      linkSent: Boolean(user.emailVerification),
    }
  );
}
