import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { requireRole } from "./auth";
import { getPairings, getUsers, type UserDocument, type UserStatus } from "./db";
import { formatDate } from "./format";

// A mentee as counselors and admins see them.
export type MenteeRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  itsId: string;
  city: string;
  mohalla: string;
  accountStatus: UserStatus;
  emailVerified: boolean;
  dateOfBirth: string;
  education: string;
  occupation: string;
  interests: string[];
  otherInterests: string;
  goals: string;
  availability: string[];
  joinedOn: string;
};

const HIDDEN_FIELDS = { passwordHash: 0, emailVerification: 0 } as const;

function toRecord(user: WithId<UserDocument>): MenteeRecord {
  const mentee = user.mentee;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    itsId: user.itsId ?? "",
    city: user.city ?? "",
    mohalla: user.mohalla ?? "",
    accountStatus: user.status,
    emailVerified: user.emailVerified !== false,
    dateOfBirth: mentee ? formatDate(new Date(mentee.dateOfBirth)) : "",
    education: mentee?.education ?? "",
    occupation: mentee?.occupation ?? "",
    interests: mentee?.interests ?? [],
    otherInterests: mentee?.otherInterests ?? "",
    goals: mentee?.goals ?? "",
    availability: mentee?.availability ?? [],
    joinedOn: formatDate(user.createdAt),
  };
}

// Verified, active mentees with no mentor, the longest waiting first.
export async function listWaitingMentees() {
  await requireRole("counselor", "admin");
  const paired = await getPairings().distinct("menteeId", { status: "active" });
  const users = await getUsers()
    .find(
      {
        role: "mentee",
        status: "active",
        emailVerified: { $ne: false },
        _id: { $nin: paired },
      },
      { projection: HIDDEN_FIELDS },
    )
    .sort({ createdAt: 1 })
    .toArray();
  return users.map(toRecord);
}

export async function getMentee(id: string) {
  await requireRole("counselor", "admin");
  if (!ObjectId.isValid(id)) return null;
  const user = await getUsers().findOne(
    { _id: new ObjectId(id), role: "mentee" },
    { projection: HIDDEN_FIELDS },
  );
  return user && toRecord(user);
}

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
