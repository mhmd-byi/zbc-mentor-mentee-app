import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { todayInIndia } from "@/lib/format";
import { listMyMeetings } from "@/lib/meetings";
import type { Partner } from "@/lib/pairings";
import { MeetingHistory } from "./meeting-history";
import { ProposeMeeting } from "./propose-meeting";
import { UpcomingMeetings } from "./upcoming-meetings";

// A mentor's or mentee's meetings, and where they propose new ones.
export async function MyMeetings({ partners }: { partners: Partner[] }) {
  const meetings = await listMyMeetings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Meetings</CardTitle>
        <CardDescription>All times are India time (IST).</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <UpcomingMeetings
          meetings={meetings.filter((meeting) => meeting.upcoming)}
        />
        <ProposeMeeting
          partners={partners.map(({ pairingId, name }) => ({
            pairingId,
            name,
          }))}
          today={todayInIndia()}
        />
        <MeetingHistory
          meetings={meetings.filter((meeting) => !meeting.upcoming)}
        />
      </CardContent>
    </Card>
  );
}
