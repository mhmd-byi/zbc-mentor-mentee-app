// Changes to session notes. Callers must check who is asking before using these.
// Notes are never deleted.
import "server-only";
import type { ObjectId } from "mongodb";
import {
  ensureSessionNoteIndexes,
  getPairings,
  getSessionNotes,
  type SessionNoteDocument,
} from "./db";

type Details = Pick<SessionNoteDocument, "date" | "summary" | "nextSteps">;

// The pairing, only while it is active and this person is its mentor.
function findActivePairing(pairingId: ObjectId, mentorId: ObjectId) {
  return getPairings().findOne({ _id: pairingId, mentorId, status: "active" });
}

// Returns false if the pairing isn't this mentor's or has ended.
export async function createSessionNote(
  pairingId: ObjectId,
  mentorId: ObjectId,
  details: Details,
) {
  const pairing = await findActivePairing(pairingId, mentorId);
  if (!pairing) return false;

  await ensureSessionNoteIndexes();
  await getSessionNotes().insertOne({
    ...details,
    pairingId,
    mentorId,
    menteeId: pairing.menteeId,
    createdAt: new Date(),
  });
  return true;
}

// Returns false if the note isn't this mentor's or its pairing has ended.
export async function updateSessionNote(
  noteId: ObjectId,
  mentorId: ObjectId,
  details: Details,
) {
  const notes = getSessionNotes();
  const note = await notes.findOne({ _id: noteId, mentorId });
  if (!note || !(await findActivePairing(note.pairingId, mentorId))) {
    return false;
  }

  // Saving without changing anything shouldn't mark the note as edited.
  const changed =
    note.date !== details.date ||
    note.summary !== details.summary ||
    note.nextSteps !== details.nextSteps;
  if (changed) {
    await notes.updateOne(
      { _id: noteId },
      { $set: { ...details, updatedAt: new Date() } },
    );
  }
  return true;
}
