import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PairingRecord } from "@/lib/pairings";
import { PairingStateBadge } from "./pairing-state-badge";

type PairingHistoryProps = {
  // Only ended pairings are shown, so pass all of someone's.
  pairings: PairingRecord[];
  // Which side of each pairing to name.
  partner: "mentor" | "mentee";
};

export function PairingHistory({ pairings, partner }: PairingHistoryProps) {
  const ended = pairings.filter((pairing) => pairing.state !== "active");
  if (ended.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past pairings</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {ended.map((pairing) => (
            <li
              key={pairing.id}
              className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={
                    partner === "mentor"
                      ? `/counselor/mentors/${pairing.mentorId}`
                      : `/counselor/mentees/${pairing.menteeId}`
                  }
                  className="font-semibold text-primary"
                >
                  {partner === "mentor"
                    ? pairing.mentorName
                    : pairing.menteeName}
                </Link>
                <PairingStateBadge state={pairing.state} />
              </div>
              <p className="text-sm text-muted-foreground">
                {pairing.startedOn} to {pairing.endedOn}
              </p>
              {pairing.note && (
                <p className="text-sm whitespace-pre-line">{pairing.note}</p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
