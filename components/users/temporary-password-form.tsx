"use client";

import { revalidateLogic } from "@tanstack/react-form";
import {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
} from "react";
import { setTemporaryPassword } from "@/app/actions/users";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { passwordSchema } from "@/lib/schemas";

export function TemporaryPasswordForm({ userId }: { userId: string }) {
  const [state, submit, isPending] = useActionState(
    setTemporaryPassword.bind(null, userId),
    {},
  );
  const form = useAppForm({
    defaultValues: { password: "" },
    validationLogic: revalidateLogic({ mode: "blur" }),
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  // Clear the field once saved, and when leaving the page.
  useEffect(() => {
    if (state.success) form.reset();
  }, [state, form]);
  useLayoutEffect(() => () => form.reset(), [form]);

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField
          name="password"
          validators={{ onDynamic: passwordSchema }}
        >
          {(field) => (
            <field.TextField
              label="New temporary password"
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </form.AppField>
        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          variant="secondary"
          className="self-start"
          pending={isPending}
          pendingLabel="Saving…"
        >
          Set password
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
