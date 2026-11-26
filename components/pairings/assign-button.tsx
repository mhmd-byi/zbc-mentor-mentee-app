"use client";

import {
  startTransition,
  useActionState,
  useLayoutEffect,
  useState,
} from "react";
import { assignMentor } from "@/app/actions/pairings";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";

type AssignButtonProps = { menteeId: string; mentorId: string };

// Takes a second press, because assigning emails both people straight away.
export function AssignButton({ menteeId, mentorId }: AssignButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [state, submit, isPending] = useActionState(
    assignMentor.bind(null, menteeId, mentorId),
    {},
  );

  // Next keeps visited pages mounted but hidden, so don't stay half-confirmed.
  useLayoutEffect(() => () => setConfirming(false), []);

  if (!confirming) {
    return (
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => setConfirming(true)}
      >
        Assign
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        <PendingButton
          pending={isPending}
          pendingLabel="Assigning…"
          onClick={() => startTransition(submit)}
        >
          Confirm and email both
        </PendingButton>
        <Button
          variant="ghost"
          disabled={isPending}
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
      {!isPending && <FormMessage {...state} />}
    </div>
  );
}
