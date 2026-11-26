"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState, useLayoutEffect } from "react";
import { login } from "@/app/actions/auth";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { loginSchema } from "@/lib/schemas";

export function LoginForm() {
  const [state, submit, isPending] = useActionState(login, {});
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    // Check a field when the user leaves it, then as they type after a submit.
    validationLogic: revalidateLogic({ mode: "blur" }),
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  // Next keeps visited pages mounted but hidden, so clear typed credentials on leaving.
  useLayoutEffect(() => () => form.reset(), [form]);

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField
          name="email"
          validators={{ onDynamic: loginSchema.shape.email }}
        >
          {(field) => (
            <field.TextField label="Email" type="email" autoComplete="username" />
          )}
        </form.AppField>
        <form.AppField
          name="password"
          validators={{ onDynamic: loginSchema.shape.password }}
        >
          {(field) => (
            <field.TextField
              label="Password"
              type="password"
              autoComplete="current-password"
            />
          )}
        </form.AppField>
        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          size="lg"
          className="mt-1 w-full"
          pending={isPending}
          pendingLabel="Signing in…"
        >
          Sign in
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
