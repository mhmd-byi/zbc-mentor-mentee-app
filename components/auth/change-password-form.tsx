"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState, useLayoutEffect } from "react";
import { changePassword } from "@/app/actions/auth";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { newPasswordSchema } from "@/lib/schemas";

export function ChangePasswordForm() {
  const [state, submit, isPending] = useActionState(changePassword, {});
  const form = useAppForm({
    defaultValues: { password: "", confirmation: "" },
    // Checked on submit first, so the mismatch message doesn't appear too early.
    validationLogic: revalidateLogic(),
    validators: { onDynamic: newPasswordSchema },
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  // Next keeps visited pages mounted but hidden, so clear typed passwords on leaving.
  useLayoutEffect(() => () => form.reset(), [form]);

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="New password"
              description="At least 8 characters."
              type="password"
              autoComplete="new-password"
            />
          )}
        </form.AppField>
        <form.AppField name="confirmation">
          {(field) => (
            <field.TextField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
            />
          )}
        </form.AppField>
        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          size="lg"
          className="mt-1 w-full"
          pending={isPending}
          pendingLabel="Saving…"
        >
          Save password
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
