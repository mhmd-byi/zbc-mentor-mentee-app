import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { requireRole } from "./auth";
import {
  getUsers,
  type ApplicationStatus,
  type UserDocument,
  type UserStatus,
} from "./db";

export type MentorRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  itsId: string;
  city: string;
  mohalla: string;
  accountStatus: UserStatus;
  applicationStatus: ApplicationStatus;
  occupation: string;
  company: string;
  yearsExperience: number | null;
  expertise: string[];
  otherExpertise: string;
  availability: string[];
  bio: string;
  maxMentees: number | null;
  rejectionReason: string;
  submittedOn: string;
};

// Formatted on the server, so server and browser can't disagree about the date.
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

function toRecord(user: WithId<UserDocument>): MentorRecord {
  const mentor = user.mentor ?? {};
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    itsId: user.itsId ?? "",
    city: user.city ?? "",
    mohalla: user.mohalla ?? "",
    accountStatus: user.status,
    applicationStatus: mentor.applicationStatus ?? "approved",
    occupation: mentor.occupation ?? "",
    company: mentor.company ?? "",
    yearsExperience: mentor.yearsExperience ?? null,
    expertise: mentor.expertise ?? [],
    otherExpertise: mentor.otherExpertise ?? "",
    availability: mentor.availability ?? [],
    bio: mentor.bio ?? "",
    maxMentees: mentor.maxMentees ?? null,
    rejectionReason: mentor.rejectionReason ?? "",
    submittedOn: mentor.submittedAt
      ? DATE_FORMAT.format(mentor.submittedAt)
      : "",
  };
}

export async function listMentors() {
  await requireRole("counselor", "admin");
  const users = await getUsers()
    .find({ role: "mentor" }, { projection: { passwordHash: 0 } })
    .sort({ "mentor.submittedAt": -1 })
    .toArray();
  // Applications waiting for review come first.
  return users
    .map(toRecord)
    .sort(
      (a, b) =>
        Number(b.applicationStatus === "pending") -
        Number(a.applicationStatus === "pending"),
    );
}

export async function getMentor(id: string) {
  await requireRole("counselor", "admin");
  if (!ObjectId.isValid(id)) return null;
  const user = await getUsers().findOne(
    { _id: new ObjectId(id), role: "mentor" },
    { projection: { passwordHash: 0 } },
  );
  return user && toRecord(user);
}

// The signed-in mentor's own application.
export async function getOwnMentor() {
  const { id } = await requireRole("mentor");
  const user = await getUsers().findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0 } },
  );
  return user && toRecord(user);
}
