"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState, useLayoutEffect } from "react";
import { createUser, updateUser } from "@/app/actions/users";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { MOHALLAS } from "@/lib/mohallas";
import { ROLE_LABELS, ROLES } from "@/lib/roles";
import { newUserSchema, type UserFormValues } from "@/lib/user-schema";
import type { UserRecord } from "@/lib/users";

const ROLE_OPTIONS = ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

const MOHALLA_OPTIONS = MOHALLAS.map((name) => ({ value: name, label: name }));

type UserFormProps = {
  // Leave out to create a new account.
  user?: UserRecord;
  lockRole?: boolean;
};

export function UserForm({ user, lockRole }: UserFormProps) {
  const [state, submit, isPending] = useActionState(
    user ? updateUser.bind(null, user.id) : createUser,
    {},
  );
  const defaultValues: UserFormValues = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
    phone: user?.phone ?? "",
    itsId: user?.itsId ?? "",
    city: user?.city ?? "",
    mohalla: user?.mohalla ?? "",
    password: "",
  };
  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic({ mode: "blur" }),
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  // Next keeps visited pages mounted but hidden, so clear unsaved input on leaving.
  useLayoutEffect(() => () => form.reset(), [form]);

  const { shape } = newUserSchema;

  return (
    <form.AppForm>
      <form.Form>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="name" validators={{ onDynamic: shape.name }}>
            {(field) => (
              <field.TextField label="Full name" autoComplete="off" />
            )}
          </form.AppField>
          <form.AppField name="email" validators={{ onDynamic: shape.email }}>
            {(field) => (
              <field.TextField label="Email" type="email" autoComplete="off" />
            )}
          </form.AppField>
          <form.AppField name="phone" validators={{ onDynamic: shape.phone }}>
            {(field) => (
              <field.TextField label="Phone" type="tel" autoComplete="off" />
            )}
          </form.AppField>
          <form.AppField name="itsId" validators={{ onDynamic: shape.itsId }}>
            {(field) => (
              <field.TextField
                label="ITS ID"
                inputMode="numeric"
                maxLength={8}
                autoComplete="off"
              />
            )}
          </form.AppField>
          <form.AppField name="city" validators={{ onDynamic: shape.city }}>
            {(field) => (
              <field.TextField
                label="City or area (optional)"
                autoComplete="off"
              />
            )}
          </form.AppField>
          <form.AppField
            name="mohalla"
            validators={{ onDynamic: shape.mohalla }}
          >
            {(field) => (
              <field.SelectField
                label="Mohalla (optional)"
                placeholder={
                  MOHALLA_OPTIONS.length ? "Choose a mohalla" : "No options yet"
                }
                options={MOHALLA_OPTIONS}
                disabled={MOHALLA_OPTIONS.length === 0}
              />
            )}
          </form.AppField>
          <form.AppField name="role" validators={{ onDynamic: shape.role }}>
            {(field) => (
              <field.SelectField
                label="Role"
                placeholder="Choose a role"
                options={ROLE_OPTIONS}
                disabled={lockRole}
              />
            )}
          </form.AppField>
          {!user && (
            <form.AppField
              name="password"
              validators={{ onDynamic: shape.password }}
            >
              {(field) => (
                // Shown as text so the admin can check it and pass it on.
                <field.TextField
                  label="Temporary password"
                  description="They must change it the first time they sign in."
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
            </form.AppField>
          )}
        </div>
        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          size="lg"
          className="self-start"
          pending={isPending}
          pendingLabel="Saving…"
        >
          {user ? "Save changes" : "Create account"}
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
