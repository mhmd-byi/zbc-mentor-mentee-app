import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Meeting } from "@/lib/meetings";
import { MeetingHistory } from "./meeting-history";
import { MeetingSummary } from "./meeting-summary";

// A mentee's meetings as counselors and admins see them, read-only.
export function MeetingRecords({ meetings }: { meetings: Meeting[] }) {
  const upcoming = meetings.filter((meeting) => meeting.upcoming);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meetings</CardTitle>
        <CardDescription>
          {upcoming.length > 0
            ? "Arranged by the mentor and mentee."
            : "Nothing coming up."}
        </CardDescription>
      </CardHeader>
      {meetings.length > 0 && (
        <CardContent className="flex flex-col gap-4">
          {upcoming.length > 0 && (
            <ul className="divide-y">
              {upcoming.map((meeting) => (
                <li key={meeting.id} className="py-3 first:pt-0 last:pb-0">
                  <MeetingSummary meeting={meeting} forCounselor />
                </li>
              ))}
            </ul>
          )}
          <MeetingHistory
            meetings={meetings.filter((meeting) => !meeting.upcoming)}
            forCounselor
          />
        </CardContent>
      )}
    </Card>
  );
}
