"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState } from "react";
import { approveMentor, setMaxMentees } from "@/app/actions/mentors";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { MENTEE_LIMIT_OPTIONS } from "@/lib/mentor-options";
import { maxMenteesSchema } from "@/lib/mentor-schema";

const LIMIT_OPTIONS = MENTEE_LIMIT_OPTIONS.map((value) => ({
  value,
  label: value,
}));

type MaxMenteesFormProps = {
  mentorId: string;
  current: number | null;
  // Approving an application also sets the limit.
  approve?: boolean;
};

export function MaxMenteesForm({
  mentorId,
  current,
  approve,
}: MaxMenteesFormProps) {
  const action = approve ? approveMentor : setMaxMentees;
  const [state, submit, isPending] = useActionState(
    action.bind(null, mentorId),
    {},
  );
  const form = useAppForm({
    defaultValues: { maxMentees: current?.toString() ?? "" },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField
          name="maxMentees"
          validators={{ onDynamic: maxMenteesSchema }}
        >
          {(field) => (
            <field.SelectField
              label="Maximum mentees"
              placeholder="Choose a number"
              options={LIMIT_OPTIONS}
            />
          )}
        </form.AppField>
        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          className="self-start"
          pending={isPending}
          pendingLabel="Saving…"
        >
          {approve ? "Approve mentor" : "Save limit"}
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
