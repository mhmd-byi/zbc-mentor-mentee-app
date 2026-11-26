"use client";

import { useState, useTransition } from "react";
import {
  cancelMeeting,
  confirmMeeting,
  declineMeeting,
} from "@/app/actions/meetings";
import { Button } from "@/components/ui/button";
import { PendingButton } from "@/components/ui/pending-button";
import { cancelSchema, declineSchema } from "@/lib/meeting-schema";
import type { Meeting } from "@/lib/meetings";
import type { FormState } from "@/lib/schemas";
import { ReasonForm } from "./reason-form";

type MeetingActionsProps = {
  meeting: Meeting;
  onDone: (result: FormState) => void;
};

// What the viewer can do about an upcoming meeting.
export function MeetingActions({ meeting, onDone }: MeetingActionsProps) {
  const [askingWhy, setAskingWhy] = useState(false);
  const [isPending, startAction] = useTransition();
  const proposed = meeting.state === "proposed";
  const needsAnswer = proposed && !meeting.proposedByViewer;
  const verb = needsAnswer ? "Decline" : proposed ? "Withdraw" : "Cancel";

  if (askingWhy) {
    const action = needsAnswer ? declineMeeting : cancelMeeting;
    return (
      <ReasonForm
        schema={needsAnswer ? declineSchema : cancelSchema}
        label={needsAnswer ? "Reason (optional)" : "Reason"}
        submitLabel={`${verb} and email them`}
        backLabel={needsAnswer ? "Back" : "Keep it"}
        action={action.bind(null, meeting.id)}
        onDone={onDone}
        onBack={() => setAskingWhy(false)}
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {needsAnswer && (
        <PendingButton
          pending={isPending}
          pendingLabel="Confirming…"
          onClick={() => {
            onDone({});
            startAction(async () => onDone(await confirmMeeting(meeting.id)));
          }}
        >
          Confirm
        </PendingButton>
      )}
      <Button
        variant={needsAnswer ? "secondary" : "destructive"}
        disabled={isPending}
        onClick={() => {
          onDone({});
          setAskingWhy(true);
        }}
      >
        {verb === "Cancel" ? "Cancel meeting" : verb}
      </Button>
    </div>
  );
}
