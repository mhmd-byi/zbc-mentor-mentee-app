// Changes to meetings. Callers must check who is asking before using these.
import "server-only";
import type { Filter, ObjectId } from "mongodb";
import {
  ensureMeetingIndexes,
  getMeetings,
  getPairings,
  type MeetingDocument,
} from "./db";

// The pairing, only if it is active and the person is one of the two in it.
function findActivePairing(pairingId: ObjectId, userId: ObjectId) {
  return getPairings().findOne({
    _id: pairingId,
    status: "active",
    $or: [{ mentorId: userId }, { menteeId: userId }],
  });
}

// Returns the new meeting, or null if the pairing isn't theirs or has ended.
export async function createMeeting(
  pairingId: ObjectId,
  proposedBy: ObjectId,
  details: Pick<MeetingDocument, "startsAt" | "location" | "note">,
) {
  const pairing = await findActivePairing(pairingId, proposedBy);
  if (!pairing) return null;

  const meeting: MeetingDocument = {
    ...details,
    pairingId,
    mentorId: pairing.mentorId,
    menteeId: pairing.menteeId,
    status: "proposed",
    proposedBy,
    proposedAt: new Date(),
  };
  await ensureMeetingIndexes();
  await getMeetings().insertOne(meeting);
  return meeting;
}

// Changes one of the person's meetings, if it is still in the expected state.
// Returns the changed meeting, or null.
async function changeMeeting(
  meetingId: ObjectId,
  userId: ObjectId,
  expected: Filter<MeetingDocument>,
  change: Pick<MeetingDocument, "status" | "reason">,
) {
  const meetings = getMeetings();
  const meeting = await meetings.findOne(
    { _id: meetingId },
    { projection: { pairingId: 1 } },
  );
  if (!meeting || !(await findActivePairing(meeting.pairingId, userId))) {
    return null;
  }

  const now = new Date();
  return meetings.findOneAndUpdate(
    // A meeting can't be changed once its start time has passed.
    { ...expected, _id: meetingId, startsAt: { $gt: now } },
    { $set: { ...change, updatedBy: userId, updatedAt: now } },
    { returnDocument: "after" },
  );
}

// Only the person who didn't propose a meeting can answer it.
export function answerMeeting(
  meetingId: ObjectId,
  userId: ObjectId,
  answer: { status: "confirmed" } | { status: "declined"; reason: string },
) {
  return changeMeeting(
    meetingId,
    userId,
    { status: "proposed", proposedBy: { $ne: userId } },
    answer,
  );
}

// A proposal is withdrawn by whoever made it; a confirmed meeting by either person.
export function cancelOpenMeeting(
  meetingId: ObjectId,
  userId: ObjectId,
  reason: string,
) {
  return changeMeeting(
    meetingId,
    userId,
    {
      $or: [
        { status: "confirmed" },
        { status: "proposed", proposedBy: userId },
      ],
    },
    { status: "cancelled", reason },
  );
}
