"use client";

import { useState } from "react";
import { FormMessage } from "@/components/ui/form-message";
import type { Meeting } from "@/lib/meetings";
import type { FormState } from "@/lib/schemas";
import { MeetingActions } from "./meeting-actions";
import { MeetingSummary } from "./meeting-summary";

// The outcome is kept here, because a declined or cancelled meeting leaves the list.
export function UpcomingMeetings({ meetings }: { meetings: Meeting[] }) {
  const [result, setResult] = useState<FormState>({});

  return (
    <div className="flex flex-col gap-4">
      <FormMessage {...result} />
      {meetings.length === 0 ? (
        <p className="text-muted-foreground">Nothing coming up.</p>
      ) : (
        <ul className="divide-y">
          {meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0"
            >
              <MeetingSummary meeting={meeting} />
              <MeetingActions meeting={meeting} onDone={setResult} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
