"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useState, useTransition } from "react";
import { useAppForm } from "@/components/form/use-app-form";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import {
  sessionNoteSchema,
  type SessionNoteValues,
} from "@/lib/session-note-schema";
import type { FormState } from "@/lib/schemas";

type SessionNoteFormProps = {
  defaultValues: SessionNoteValues;
  // The latest date that can be picked.
  today: string;
  submitLabel: string;
  save: (values: SessionNoteValues) => Promise<FormState>;
  onSaved: (result: FormState) => void;
  onCancel: () => void;
};

// Used both to add a note and to correct one.
export function SessionNoteForm({
  defaultValues,
  today,
  submitLabel,
  save,
  onSaved,
  onCancel,
}: SessionNoteFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startAction] = useTransition();
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: sessionNoteSchema },
    onSubmit: ({ value }) =>
      startAction(async () => {
        const result = await save(value);
        if (result.error) setError(result.error);
        else onSaved(result);
      }),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="date">
          {(field) => <field.DateField label="Session date" max={today} />}
        </form.AppField>
        <form.AppField name="summary">
          {(field) => (
            <field.TextareaField
              label="What you covered"
              description="Your mentee and counselors can read this note."
              maxLength={2000}
            />
          )}
        </form.AppField>
        <form.AppField name="nextSteps">
          {(field) => (
            <field.TextareaField
              label="Next steps (optional)"
              maxLength={1000}
            />
          )}
        </form.AppField>
        {!isPending && <FormMessage error={error} />}
        <div className="flex flex-wrap gap-2">
          <PendingButton
            type="submit"
            pending={isPending}
            pendingLabel="Saving…"
          >
            {submitLabel}
          </PendingButton>
          <Button variant="ghost" disabled={isPending} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form.Form>
    </form.AppForm>
  );
}
