"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState } from "react";
import { closePairing } from "@/app/actions/pairings";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { endPairingSchema, PAIRING_OUTCOMES } from "@/lib/pairing-schema";

export function EndPairingForm({ pairingId }: { pairingId: string }) {
  const [state, submit, isPending] = useActionState(
    closePairing.bind(null, pairingId),
    {},
  );
  const form = useAppForm({
    defaultValues: { outcome: "", note: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: endPairingSchema },
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="outcome">
          {(field) => (
            <field.SelectField
              label="How did it end?"
              placeholder="Choose one"
              options={[...PAIRING_OUTCOMES]}
            />
          )}
        </form.AppField>
        <form.AppField name="note">
          {(field) => (
            <field.TextareaField
              label="Note (optional)"
              description="Only counselors and admins see this."
              maxLength={500}
            />
          )}
        </form.AppField>
        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          variant="destructive"
          className="self-start"
          pending={isPending}
          pendingLabel="Ending…"
        >
          End pairing and email both
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
