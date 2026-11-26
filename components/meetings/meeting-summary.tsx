import type { Meeting } from "@/lib/meetings";
import { MeetingStateBadge } from "./meeting-state-badge";

// Only web addresses become links, so nothing else typed there can run.
const WEB_ADDRESS = /^https?:\/\/\S+$/i;

type MeetingSummaryProps = {
  meeting: Meeting;
  forCounselor?: boolean;
};

export function MeetingSummary({ meeting, forCounselor }: MeetingSummaryProps) {
  const closing =
    meeting.closedBy &&
    `${meeting.state === "declined" ? "Declined" : "Cancelled"} by ${meeting.closedBy}`;
  const outcome = [closing, meeting.reason].filter(Boolean).join(": ");

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="font-semibold">{meeting.when}</p>
        <MeetingStateBadge meeting={meeting} forCounselor={forCounselor} />
      </div>
      <p className="text-sm text-muted-foreground">
        With {meeting.withName}, proposed by {meeting.proposedBy}
      </p>
      <p className="break-words">
        {WEB_ADDRESS.test(meeting.location) ? (
          <a
            href={meeting.location}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium break-all text-primary underline-offset-4 hover:underline"
          >
            {meeting.location}
          </a>
        ) : (
          meeting.location
        )}
      </p>
      {meeting.note && (
        <p className="text-sm break-words whitespace-pre-line">
          {meeting.note}
        </p>
      )}
      {outcome && (
        <p className="text-sm break-words whitespace-pre-line text-muted-foreground">
          {outcome}
        </p>
      )}
    </div>
  );
}
