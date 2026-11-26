"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import {
  sessionNoteSchema,
  type SessionNoteValues,
} from "@/lib/session-note-schema";
import {
  createSessionNote,
  updateSessionNote,
} from "@/lib/session-note-service";
import type { FormState } from "@/lib/schemas";

// Checks that a mentor is asking and the answers are valid, then saves.
// The id is the pairing's for a new note, and the note's for a change.
async function saveNote(
  save: typeof createSessionNote,
  id: string,
  values: SessionNoteValues,
  unavailable: string,
): Promise<FormState> {
  const mentor = await requireRole("mentor");
  const parsed = sessionNoteSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const saved =
    ObjectId.isValid(id) &&
    (await save(new ObjectId(id), new ObjectId(mentor.id), parsed.data));
  if (!saved) return { error: unavailable };

  revalidatePath("/mentor", "layout");
  return { success: "Note saved." };
}

export async function addSessionNote(
  pairingId: string,
  values: SessionNoteValues,
) {
  return saveNote(
    createSessionNote,
    pairingId,
    values,
    "You're no longer paired with them. Reload the page.",
  );
}

export async function editSessionNote(
  noteId: string,
  values: SessionNoteValues,
) {
  return saveNote(
    updateSessionNote,
    noteId,
    values,
    "This note can't be changed any more. Reload the page.",
  );
}
