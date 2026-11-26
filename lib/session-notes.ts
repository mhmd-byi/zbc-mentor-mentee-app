import "server-only";
import { ObjectId, type Filter } from "mongodb";
import { requireRole } from "./auth";
import {
  getPairings,
  getSessionNotes,
  getUsers,
  type SessionNoteDocument,
} from "./db";
import { formatDate } from "./format";

export type SessionNote = {
  id: string;
  // YYYY-MM-DD for the edit form, and the same day as shown.
  date: string;
  dateLabel: string;
  summary: string;
  nextSteps: string;
  editedOn: string;
  mentorName: string;
};

// Newest session first.
async function loadNotes(
  filter: Filter<SessionNoteDocument>,
): Promise<SessionNote[]> {
  const notes = await getSessionNotes()
    .find(filter)
    .sort({ date: -1, createdAt: -1 })
    .toArray();
  const mentors = await getUsers()
    .find(
      { _id: { $in: notes.map((note) => note.mentorId) } },
      { projection: { name: 1 } },
    )
    .toArray();

  return notes.map((note) => ({
    id: note._id.toString(),
    date: note.date,
    dateLabel: formatDate(new Date(note.date)),
    summary: note.summary,
    nextSteps: note.nextSteps,
    editedOn: formatDate(note.updatedAt),
    mentorName:
      mentors.find(({ _id }) => _id.equals(note.mentorId))?.name ?? "Unknown",
  }));
}

// One of the mentor's current mentees with their notes, or null.
export async function getMyMenteeNotes(pairingId: string) {
  const { id } = await requireRole("mentor");
  if (!ObjectId.isValid(pairingId)) return null;

  const pairing = await getPairings().findOne({
    _id: new ObjectId(pairingId),
    mentorId: new ObjectId(id),
    status: "active",
  });
  if (!pairing) return null;
  const mentee = await getUsers().findOne(
    { _id: pairing.menteeId },
    { projection: { name: 1 } },
  );
  if (!mentee) return null;

  return {
    menteeName: mentee.name,
    notes: await loadNotes({ pairingId: pairing._id }),
  };
}

// A mentee's notes from the mentor they're paired with now.
export async function listMyNotes() {
  const { id } = await requireRole("mentee");
  const pairing = await getPairings().findOne(
    { menteeId: new ObjectId(id), status: "active" },
    { projection: { _id: 1 } },
  );
  return pairing ? loadNotes({ pairingId: pairing._id }) : [];
}

// All of a mentee's notes, including those from ended pairings.
export async function listMenteeNotes(menteeId: string) {
  await requireRole("counselor", "admin");
  return loadNotes({ menteeId: new ObjectId(menteeId) });
}
