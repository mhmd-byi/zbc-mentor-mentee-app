import { Badge } from "@/components/ui/badge";
import type { Meeting } from "@/lib/meetings";

const BADGES = {
  proposed: { label: "Proposed", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "outline" },
  declined: { label: "Declined", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  unanswered: { label: "Not answered", variant: "secondary" },
} as const;

type MeetingStateBadgeProps = {
  meeting: Meeting;
  forCounselor?: boolean;
};

export function MeetingStateBadge({
  meeting,
  forCounselor,
}: MeetingStateBadgeProps) {
  // Mentors and mentees see whose turn it is.
  if (meeting.state === "proposed" && !forCounselor) {
    return meeting.proposedByViewer ? (
      <Badge variant="secondary">Awaiting reply</Badge>
    ) : (
      <Badge>Needs your answer</Badge>
    );
  }
  const { label, variant } = BADGES[meeting.state];
  return <Badge variant={variant}>{label}</Badge>;
}
