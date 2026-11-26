"use client";

import { startTransition, useActionState } from "react";
import { resendVerification } from "@/app/actions/mentees";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";

export function ResendVerificationButton() {
  const [state, submit, isPending] = useActionState(resendVerification, {});

  return (
    <div className="flex flex-col items-start gap-3">
      {!isPending && <FormMessage {...state} />}
      <PendingButton
        pending={isPending}
        pendingLabel="Sending…"
        onClick={() => startTransition(submit)}
      >
        Send again
      </PendingButton>
    </div>
  );
}
