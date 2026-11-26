import "server-only";
import type { ObjectId } from "mongodb";
import { getUsers, type MeetingDocument } from "./db";
import { sendNotice } from "./email";
import { formatDateTime } from "./format";

const MESSAGES = {
  proposed: {
    subject: "New meeting proposal",
    opening: (name: string) =>
      `${name} proposed a meeting. Sign in to confirm or decline it.`,
  },
  confirmed: {
    subject: "Meeting confirmed",
    opening: (name: string) => `${name} confirmed the meeting you proposed.`,
  },
  declined: {
    subject: "Meeting declined",
    opening: (name: string) => `${name} declined the meeting you proposed.`,
  },
  cancelled: {
    subject: "Meeting cancelled",
    opening: (name: string) => `${name} cancelled a meeting.`,
  },
};

// Tells the other person what changed. Returns false if the email couldn't be sent.
export async function notifyMeeting(
  meeting: MeetingDocument,
  actorId: ObjectId,
) {
  const otherId = meeting.mentorId.equals(actorId)
    ? meeting.menteeId
    : meeting.mentorId;
  const people = await getUsers()
    .find(
      { _id: { $in: [actorId, otherId] } },
      { projection: { name: 1, email: 1 } },
    )
    .toArray();
  const actor = people.find(({ _id }) => _id.equals(actorId));
  const other = people.find(({ _id }) => _id.equals(otherId));
  if (!actor || !other) return false;

  // The meeting's status after a change says what happened to it.
  const { subject, opening } = MESSAGES[meeting.status];
  const lines = [
    opening(actor.name),
    `When: ${formatDateTime(meeting.startsAt)}`,
    `Where: ${meeting.location}`,
  ];
  if (meeting.status === "proposed" && meeting.note) {
    lines.push(`Note: ${meeting.note}`);
  }
  if (meeting.reason) lines.push(`Reason: ${meeting.reason}`);

  return sendNotice(other.email, subject, lines);
}
