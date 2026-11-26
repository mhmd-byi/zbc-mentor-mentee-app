"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import type { FormState } from "@/lib/schemas";
import {
  ProposeMeetingForm,
  type ProposeMeetingFormProps,
} from "./propose-meeting-form";

type ProposeMeetingProps = Pick<ProposeMeetingFormProps, "partners" | "today">;

// A button that opens the form, then says what happened.
export function ProposeMeeting(props: ProposeMeetingProps) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<FormState>({});

  if (open) {
    return (
      <ProposeMeetingForm
        {...props}
        onSent={(sent) => {
          setResult(sent);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <FormMessage {...result} />
      <Button
        className="self-start"
        onClick={() => {
          setResult({});
          setOpen(true);
        }}
      >
        Propose a meeting
      </Button>
    </div>
  );
}
