import type { Meeting } from "@/lib/meetings";
import { MeetingSummary } from "./meeting-summary";

type MeetingHistoryProps = {
  meetings: Meeting[];
  forCounselor?: boolean;
};

// Folded away, so that what's coming up stays in view.
export function MeetingHistory({ meetings, forCounselor }: MeetingHistoryProps) {
  if (meetings.length === 0) return null;

  return (
    <details className="not-first:border-t not-first:pt-4">
      <summary className="cursor-pointer touch-manipulation font-semibold text-primary">
        Past and cancelled ({meetings.length})
      </summary>
      <ul className="divide-y pt-3">
        {meetings.map((meeting) => (
          <li key={meeting.id} className="py-3 first:pt-0 last:pb-0">
            <MeetingSummary meeting={meeting} forCounselor={forCounselor} />
          </li>
        ))}
      </ul>
    </details>
  );
}
