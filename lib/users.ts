import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { requireRole } from "./auth";
import { getUsers, type UserDocument, type UserStatus } from "./db";
import type { Role } from "./roles";

// What the admin screens may see. Never includes the password hash.
export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone: string;
  itsId: string;
  city: string;
  mohalla: string;
};

function toRecord(user: WithId<UserDocument>): UserRecord {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    phone: user.phone ?? "",
    itsId: user.itsId ?? "",
    city: user.city ?? "",
    mohalla: user.mohalla ?? "",
  };
}

export async function listUsers() {
  await requireRole("admin");
  const users = await getUsers()
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
  return users.map(toRecord);
}

export async function getUser(id: string) {
  await requireRole("admin");
  if (!ObjectId.isValid(id)) return null;
  const user = await getUsers().findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0 } },
  );
  return user && toRecord(user);
}
