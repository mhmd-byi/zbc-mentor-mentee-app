"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState } from "react";
import { rejectMentor } from "@/app/actions/mentors";
import { useAppForm } from "@/components/form/use-app-form";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { rejectionReasonSchema } from "@/lib/mentor-schema";

// No confirmation step: an application can still be approved or sent again.
export function RejectMentorForm({ mentorId }: { mentorId: string }) {
  const [state, submit, isPending] = useActionState(
    rejectMentor.bind(null, mentorId),
    {},
  );
  const form = useAppForm({
    defaultValues: { reason: "" },
    validationLogic: revalidateLogic(),
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField
          name="reason"
          validators={{ onDynamic: rejectionReasonSchema }}
        >
          {(field) => (
            <field.TextareaField
              label="Reason"
              description="The applicant will see this."
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
          pendingLabel="Saving…"
        >
          Reject application
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
