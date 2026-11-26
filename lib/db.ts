import "server-only";
import { MongoClient } from "mongodb";
import type { Role } from "./roles";

export type UserStatus = "active" | "deactivated";

export type UserDocument = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  // The rest are missing on accounts made by scripts/create-admin.mjs.
  phone?: string;
  itsId?: string;
  city?: string;
  mohalla?: string;
  mustChangePassword?: boolean;
  passwordChangedAt?: Date;
};

// Reused across requests (and dev reloads) so each one doesn't open a new connection.
const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export function getUsers() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  globalForMongo.mongoClient ??= new MongoClient(uri);
  return globalForMongo.mongoClient.db().collection<UserDocument>("users");
}

// Safe to call repeatedly: MongoDB skips indexes that already exist.
export function ensureUserIndexes() {
  return getUsers().createIndexes([
    { key: { email: 1 }, unique: true },
    // Sparse, so accounts without an ITS ID don't count as duplicates.
    { key: { itsId: 1 }, unique: true, sparse: true },
  ]);
}
