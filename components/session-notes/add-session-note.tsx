"use client";

import { useLayoutEffect, useState } from "react";
import { addSessionNote } from "@/app/actions/session-notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import type { FormState } from "@/lib/schemas";
import { SessionNoteForm } from "./session-note-form";

type AddSessionNoteProps = { pairingId: string; today: string };

// A button that opens a blank note, then says it was saved.
export function AddSessionNote({ pairingId, today }: AddSessionNoteProps) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<FormState>({});

  // Next keeps visited pages mounted but hidden, so drop the old message.
  useLayoutEffect(() => () => setResult({}), []);

  if (open) {
    return (
      <Card>
        <CardContent>
          <SessionNoteForm
            defaultValues={{ date: today, summary: "", nextSteps: "" }}
            today={today}
            submitLabel="Save note"
            save={addSessionNote.bind(null, pairingId)}
            onSaved={(saved) => {
              setResult(saved);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <FormMessage {...result} />
      <Button
        className="self-start"
        onClick={() => {
          setResult({});
          setOpen(true);
        }}
      >
        Add a session note
      </Button>
    </div>
  );
}
