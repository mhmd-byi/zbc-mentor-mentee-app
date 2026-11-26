import "server-only";
import { MongoClient, MongoServerError } from "mongodb";
import type { Role } from "./roles";

export type UserStatus = "active" | "deactivated";

export type ApplicationStatus = "pending" | "approved" | "rejected";

// A mentor created by an admin has no application, and counts as approved.
export type MentorProfile = {
  applicationStatus?: ApplicationStatus;
  occupation?: string;
  company?: string;
  yearsExperience?: number;
  expertise?: string[];
  otherExpertise?: string;
  availability?: string[];
  bio?: string;
  maxMentees?: number;
  submittedAt?: Date;
  rejectionReason?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
};

// A mentee created by an admin has none of this.
export type MenteeProfile = {
  dateOfBirth: string; // YYYY-MM-DD
  education: string;
  occupation: string;
  interests: string[];
  otherInterests: string;
  goals: string;
  availability: string[];
};

export type EmailVerification = {
  tokenHash: string;
  // Where the link went, so it can't verify an address changed afterwards.
  email: string;
  sentAt: Date;
  expiresAt: Date;
};

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
  mentor?: MentorProfile;
  mentee?: MenteeProfile;
  // false only while a self-registered mentee hasn't confirmed their address.
  emailVerified?: boolean;
  emailVerification?: EmailVerification;
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

// Turns a clash on a unique field into a message. Anything else is rethrown.
export function duplicateKeyMessage(error: unknown) {
  // 11000 is MongoDB's duplicate key error.
  if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
  return error.keyPattern?.itsId
    ? "That ITS ID belongs to another account."
    : "An account with that email already exists.";
}
