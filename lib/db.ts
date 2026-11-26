import "server-only";
import {
  MongoClient,
  MongoServerError,
  type ClientSession,
  type ObjectId,
} from "mongodb";
import type { PairingOutcome } from "./pairing-schema";
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
  // Touched when pairing, so simultaneous changes to the account collide.
  pairingCheckedAt?: Date;
};

// A mentor and mentee working together. Ended ones are kept as history.
export type PairingDocument = {
  mentorId: ObjectId;
  menteeId: ObjectId;
  status: "active" | "ended";
  startedAt: Date;
  startedBy: string;
  endedAt?: Date;
  endedBy?: string;
  outcome?: PairingOutcome;
  note?: string;
};

// Reused across requests (and dev reloads) so each one doesn't open a new connection.
const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  globalForMongo.mongoClient ??= new MongoClient(uri);
  return globalForMongo.mongoClient;
}

export function getUsers() {
  return getClient().db().collection<UserDocument>("users");
}

export function getPairings() {
  return getClient().db().collection<PairingDocument>("pairings");
}

// Runs the work atomically, retrying if another change collides with it.
// Needs a replica set, which MongoDB Atlas provides.
export function inTransaction<T>(work: (session: ClientSession) => Promise<T>) {
  return getClient().withSession((session) =>
    session.withTransaction(() => work(session)),
  );
}

export function ensurePairingIndexes() {
  return getPairings().createIndexes([
    // The database itself allows only one active pairing per mentee.
    {
      key: { menteeId: 1 },
      unique: true,
      partialFilterExpression: { status: "active" },
    },
    { key: { mentorId: 1, status: 1 } },
  ]);
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
