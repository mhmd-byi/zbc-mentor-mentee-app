import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { requireRole } from "./auth";
import {
  getPairings,
  getUsers,
  type ApplicationStatus,
  type UserDocument,
  type UserStatus,
} from "./db";
import { formatDate } from "./format";
import { areasText, availabilityLabels } from "./mentor-options";
import type { MenteeRecord } from "./mentees";

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
  activeMentees: number;
  rejectionReason: string;
  submittedOn: string;
};

// A mentor who could take a particular mentee.
export type MentorMatch = {
  id: string;
  name: string;
  occupation: string;
  expertise: string;
  activeMentees: number;
  maxMentees: number;
  // Areas and times they have in common with the mentee.
  shared: string[];
};

function toRecord(
  user: WithId<UserDocument>,
  activeMentees: number,
): MentorRecord {
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
    activeMentees,
    rejectionReason: mentor.rejectionReason ?? "",
    submittedOn: formatDate(mentor.submittedAt),
  };
}

function countActiveMentees(mentorId: ObjectId) {
  return getPairings().countDocuments({ mentorId, status: "active" });
}

export async function listMentors() {
  await requireRole("counselor", "admin");
  const users = await getUsers()
    .find({ role: "mentor" }, { projection: { passwordHash: 0 } })
    .sort({ "mentor.submittedAt": -1 })
    .toArray();
  const counts = await getPairings()
    .aggregate<{ _id: ObjectId; count: number }>([
      { $match: { status: "active" } },
      { $group: { _id: "$mentorId", count: { $sum: 1 } } },
    ])
    .toArray();
  const activeByMentor = new Map(
    counts.map(({ _id, count }) => [_id.toString(), count]),
  );

  // Applications waiting for review come first.
  return users
    .map((user) =>
      toRecord(user, activeByMentor.get(user._id.toString()) ?? 0),
    )
    .sort(
      (a, b) =>
        Number(b.applicationStatus === "pending") -
        Number(a.applicationStatus === "pending"),
    );
}

// Approved mentors with a free place, the closest matches first.
export async function listMentorMatches(mentee: MenteeRecord) {
  const approved = (await listMentors()).filter(
    (mentor) =>
      mentor.applicationStatus === "approved" &&
      mentor.accountStatus === "active",
  );
  const matches: MentorMatch[] = approved.flatMap((mentor) => {
    const { maxMentees, activeMentees } = mentor;
    if (maxMentees === null || activeMentees >= maxMentees) return [];
    return [
      {
        id: mentor.id,
        name: mentor.name,
        occupation: mentor.occupation,
        expertise: areasText(mentor.expertise, mentor.otherExpertise),
        activeMentees,
        maxMentees,
        shared: [
          ...mentor.expertise.filter((area) => mentee.interests.includes(area)),
          ...availabilityLabels(
            mentor.availability.filter((time) =>
              mentee.availability.includes(time),
            ),
          ),
        ],
      },
    ];
  });
  matches.sort(
    (a, b) =>
      b.shared.length - a.shared.length ||
      a.activeMentees - b.activeMentees ||
      a.name.localeCompare(b.name),
  );

  return {
    matches,
    // Left out above until a counselor sets their limit.
    withoutLimit: approved.filter((mentor) => mentor.maxMentees === null)
      .length,
  };
}

export async function getMentor(id: string) {
  await requireRole("counselor", "admin");
  if (!ObjectId.isValid(id)) return null;
  const _id = new ObjectId(id);
  const user = await getUsers().findOne(
    { _id, role: "mentor" },
    { projection: { passwordHash: 0 } },
  );
  return user && toRecord(user, await countActiveMentees(_id));
}

// The signed-in mentor's own application.
export async function getOwnMentor() {
  const { id } = await requireRole("mentor");
  const _id = new ObjectId(id);
  const user = await getUsers().findOne(
    { _id },
    { projection: { passwordHash: 0 } },
  );
  return user && toRecord(user, await countActiveMentees(_id));
}
