"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState } from "react";
import { sendTestEmail } from "@/app/actions/email-test";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { userSchema } from "@/lib/user-schema";

export function TestEmailForm({ defaultTo }: { defaultTo: string }) {
  const [state, submit, isPending] = useActionState(sendTestEmail, {});
  const form = useAppForm({
    defaultValues: { to: defaultTo },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField
          name="to"
          validators={{ onDynamic: userSchema.shape.email }}
        >
          {(field) => (
            <field.TextField label="Send to" type="email" autoComplete="email" />
          )}
        </form.AppField>
        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          className="self-start"
          pending={isPending}
          pendingLabel="Sending…"
        >
          Send test email
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
