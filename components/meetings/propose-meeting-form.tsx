"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useState, useTransition } from "react";
import { proposeMeeting } from "@/app/actions/meetings";
import { useAppForm } from "@/components/form/use-app-form";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { meetingSchema } from "@/lib/meeting-schema";
import type { FormState } from "@/lib/schemas";

export type ProposeMeetingFormProps = {
  // The people the viewer is paired with.
  partners: { pairingId: string; name: string }[];
  // The earliest date that can be picked.
  today: string;
  onSent: (result: FormState) => void;
  onCancel: () => void;
};

export function ProposeMeetingForm({
  partners,
  today,
  onSent,
  onCancel,
}: ProposeMeetingFormProps) {
  const [error, setError] = useState<string>();
  const [isPending, startAction] = useTransition();
  const onlyPartner = partners.length === 1 ? partners[0] : null;
  const form = useAppForm({
    defaultValues: {
      pairingId: onlyPartner?.pairingId ?? "",
      date: "",
      time: "",
      location: "",
      note: "",
    },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: meetingSchema },
    onSubmit: ({ value }) =>
      startAction(async () => {
        const result = await proposeMeeting(value);
        if (result.error) setError(result.error);
        else onSent(result);
      }),
  });

  return (
    <form.AppForm>
      <form.Form>
        {onlyPartner ? (
          <p>
            New meeting with{" "}
            <span className="font-semibold">{onlyPartner.name}</span>
          </p>
        ) : (
          <form.AppField name="pairingId">
            {(field) => (
              <field.SelectField
                label="Mentee"
                placeholder="Choose a mentee"
                options={partners.map(({ pairingId, name }) => ({
                  value: pairingId,
                  label: name,
                }))}
              />
            )}
          </form.AppField>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="date">
            {(field) => <field.DateField label="Date" min={today} />}
          </form.AppField>
          <form.AppField name="time">
            {(field) => <field.TimeField label="Time (IST)" />}
          </form.AppField>
        </div>
        <form.AppField name="location">
          {(field) => (
            <field.TextField
              label="Place or link"
              placeholder="Address or video call link"
              maxLength={300}
            />
          )}
        </form.AppField>
        <form.AppField name="note">
          {(field) => (
            <field.TextareaField
              label="Note (optional)"
              description="They and counselors can read this."
              maxLength={500}
            />
          )}
        </form.AppField>
        {!isPending && <FormMessage error={error} />}
        <div className="flex flex-wrap gap-2">
          <PendingButton
            type="submit"
            pending={isPending}
            pendingLabel="Sending…"
          >
            Send proposal
          </PendingButton>
          <Button variant="ghost" disabled={isPending} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form.Form>
    </form.AppForm>
  );
}
