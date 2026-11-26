// Changes to pairings. Callers must check who is asking before using these.
import "server-only";
import { MongoServerError, type ClientSession, type ObjectId } from "mongodb";
import {
  ensurePairingIndexes,
  getPairings,
  getUsers,
  inTransaction,
} from "./db";
import type { PairingOutcome } from "./pairing-schema";

export type PairingIds = { mentorId: ObjectId; menteeId: ObjectId };

type CreateResult = { error: string } | { pairing: PairingIds };

export async function createPairing(
  { mentorId, menteeId }: PairingIds,
  startedBy: string,
): Promise<CreateResult> {
  await ensurePairingIndexes();
  try {
    return await inTransaction<CreateResult>(async (session) => {
      const users = getUsers();
      const now = new Date();
      // Writing to both accounts makes a simultaneous change to either one retry.
      const touch = { $set: { pairingCheckedAt: now } };

      const mentor = await users.findOneAndUpdate(
        {
          _id: mentorId,
          role: "mentor",
          status: "active",
          "mentor.applicationStatus": { $nin: ["pending", "rejected"] },
        },
        touch,
        { session, projection: { "mentor.maxMentees": 1 } },
      );
      if (!mentor) return { error: "That mentor can't take mentees any more." };

      const mentee = await users.findOneAndUpdate(
        {
          _id: menteeId,
          role: "mentee",
          status: "active",
          emailVerified: { $ne: false },
        },
        touch,
        { session, projection: { _id: 1 } },
      );
      if (!mentee) {
        return { error: "This mentee is no longer waiting for a mentor." };
      }

      const pairings = getPairings();
      const active = await pairings.countDocuments(
        { mentorId, status: "active" },
        { session },
      );
      if (active >= (mentor.mentor?.maxMentees ?? 0)) {
        return { error: "That mentor has no free places." };
      }

      await pairings.insertOne(
        { mentorId, menteeId, status: "active", startedAt: now, startedBy },
        { session },
      );
      return { pairing: { mentorId, menteeId } };
    });
  } catch (error) {
    // 11000 is a duplicate key: the mentee already has an active pairing.
    if (error instanceof MongoServerError && error.code === 11000) {
      return { error: "This mentee already has a mentor." };
    }
    throw error;
  }
}

// Returns the pairing that was ended, or null if it was no longer active.
export function endPairing(
  pairingId: ObjectId,
  outcome: PairingOutcome,
  note: string,
  endedBy: string,
) {
  return getPairings().findOneAndUpdate(
    { _id: pairingId, status: "active" },
    {
      $set: {
        status: "ended",
        endedAt: new Date(),
        endedBy,
        outcome,
        note,
      },
    },
  );
}

// For the transaction that deactivates someone or changes their role.
export async function endActivePairings(
  userId: ObjectId,
  note: string,
  endedBy: string,
  session: ClientSession,
): Promise<PairingIds[]> {
  const pairings = getPairings();
  const active = await pairings
    .find(
      { status: "active", $or: [{ mentorId: userId }, { menteeId: userId }] },
      { session },
    )
    .toArray();

  if (active.length > 0) {
    await pairings.updateMany(
      { _id: { $in: active.map((pairing) => pairing._id) } },
      {
        $set: {
          status: "ended",
          endedAt: new Date(),
          endedBy,
          outcome: "ended_early",
          note,
        },
      },
      { session },
    );
  }
  return active.map(({ mentorId, menteeId }) => ({ mentorId, menteeId }));
}
