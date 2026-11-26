"use client";

import { startTransition, useActionState } from "react";
import { verifyEmail } from "@/app/actions/mentees";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";

// Verifying takes a press, because mail scanners open links on their own.
export function VerifyEmailButton({ token }: { token: string }) {
  const [state, submit, isPending] = useActionState(
    verifyEmail.bind(null, token),
    {},
  );

  return (
    <div className="flex flex-col gap-4">
      {!isPending && <FormMessage {...state} />}
      {!state.success && (
        <PendingButton
          size="lg"
          pending={isPending}
          pendingLabel="Verifying…"
          onClick={() => startTransition(submit)}
        >
          Verify my email
        </PendingButton>
      )}
    </div>
  );
}
