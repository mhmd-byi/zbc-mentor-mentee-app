"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useTransition } from "react";
import type { ZodType } from "zod";
import { useAppForm } from "@/components/form/use-app-form";
import { Button } from "@/components/ui/button";
import { PendingButton } from "@/components/ui/pending-button";
import type { ReasonValues } from "@/lib/meeting-schema";
import type { FormState } from "@/lib/schemas";

type ReasonFormProps = {
  schema: ZodType<unknown, ReasonValues>;
  label: string;
  submitLabel: string;
  backLabel: string;
  action: (values: ReasonValues) => Promise<FormState>;
  onDone: (result: FormState) => void;
  onBack: () => void;
};

// Asks why, before a meeting is declined or cancelled.
export function ReasonForm({
  schema,
  label,
  submitLabel,
  backLabel,
  action,
  onDone,
  onBack,
}: ReasonFormProps) {
  const [isPending, startAction] = useTransition();
  const form = useAppForm({
    defaultValues: { reason: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: schema },
    onSubmit: ({ value }) =>
      startAction(async () => onDone(await action(value))),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="reason">
          {(field) => (
            <field.TextareaField
              label={label}
              description="They and counselors can read this."
              maxLength={500}
            />
          )}
        </form.AppField>
        <div className="flex flex-wrap gap-2">
          <PendingButton
            type="submit"
            variant="destructive"
            pending={isPending}
            pendingLabel="Saving…"
          >
            {submitLabel}
          </PendingButton>
          <Button variant="ghost" disabled={isPending} onClick={onBack}>
            {backLabel}
          </Button>
        </div>
      </form.Form>
    </form.AppForm>
  );
}
