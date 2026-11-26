"use client";

import { useState } from "react";
import { editSessionNote } from "@/app/actions/session-notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SessionNote } from "@/lib/session-notes";
import { SessionNoteForm } from "./session-note-form";
import { SessionNoteSummary } from "./session-note-summary";

type EditableSessionNoteProps = { note: SessionNote; today: string };

// A note as its mentor sees it, which can be corrected in place.
export function EditableSessionNote({ note, today }: EditableSessionNoteProps) {
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <CardContent>
        {editing ? (
          <SessionNoteForm
            defaultValues={{
              date: note.date,
              summary: note.summary,
              nextSteps: note.nextSteps,
            }}
            today={today}
            submitLabel="Save changes"
            save={editSessionNote.bind(null, note.id)}
            onSaved={() => setEditing(false)}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <SessionNoteSummary note={note} />
            <Button
              variant="secondary"
              className="self-start"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
