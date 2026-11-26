import "server-only";
import { MongoClient } from "mongodb";
import type { Role } from "./roles";

export type UserDocument = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: "active" | "deactivated";
  createdAt: Date;
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
