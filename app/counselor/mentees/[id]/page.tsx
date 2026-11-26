import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/layout/back-link";
import { Loading } from "@/components/layout/loading";
import { PageHeader } from "@/components/layout/page-header";
import { MeetingRecords } from "@/components/meetings/meeting-records";
import { MenteeDetails } from "@/components/mentees/mentee-details";
import { AssignMentorList } from "@/components/pairings/assign-mentor-list";
import { EndPairingForm } from "@/components/pairings/end-pairing-form";
import { PairingHistory } from "@/components/pairings/pairing-history";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { requireRole } from "@/lib/auth";
import { listMenteeMeetings } from "@/lib/meetings";
import { getMentee, type MenteeRecord } from "@/lib/mentees";
import { listMentorMatches } from "@/lib/mentors";
import { listPairings } from "@/lib/pairings";
import type { FormState } from "@/lib/schemas";

export const metadata: Metadata = { title: "Mentee" };

// Shown after assigning or ending a pairing.
const NOTICES: Record<string, FormState> = {
  paired: { success: "Paired. Both people have been emailed." },
  "paired-no-email": {
    error: "Paired, but an email couldn't be sent. Please tell them yourself.",
  },
  ended: { success: "Pairing ended. Both people have been emailed." },
  "ended-no-email": {
    error:
      "Pairing ended, but an email couldn't be sent. Please tell them yourself.",
  },
};

type Props = PageProps<"/counselor/mentees/[id]">;

export default function MenteePage({ params, searchParams }: Props) {
  return (
    <AppShell allowedRoles={["counselor", "admin"]}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <BackLink href="/counselor/waiting">Waiting mentees</BackLink>
        <Suspense fallback={<Loading />}>
          <Mentee params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function Mentee({ params, searchParams }: Props) {
  await requireRole("counselor", "admin");
  const [{ id }, { notice }] = await Promise.all([params, searchParams]);
  const mentee = await getMentee(id);
  if (!mentee) notFound();

  const [pairings, meetings] = await Promise.all([
    listPairings({ menteeId: id }),
    listMenteeMeetings(id),
  ]);
  const current = pairings.find((pairing) => pairing.state === "active");
  const canBePaired =
    mentee.accountStatus === "active" && mentee.emailVerified;
  const status = current
    ? "Paired"
    : mentee.accountStatus === "deactivated"
      ? "Deactivated"
      : mentee.emailVerified
        ? "Waiting for a mentor"
        : "Email not verified";

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <PageHeader
          title={mentee.name}
          description={`Joined on ${mentee.joinedOn}`}
        />
        <Badge variant="secondary">{status}</Badge>
      </div>
      {typeof notice === "string" && <FormMessage {...NOTICES[notice]} />}

      {current && (
        <Card>
          <CardHeader>
            <CardTitle>Current mentor</CardTitle>
            <CardDescription>
              <Link
                href={`/counselor/mentors/${current.mentorId}`}
                className="font-semibold text-primary"
              >
                {current.mentorName}
              </Link>
              , since {current.startedOn}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EndPairingForm key={current.id} pairingId={current.id} />
          </CardContent>
        </Card>
      )}
      {!current && canBePaired && <AssignMentor mentee={mentee} />}
      {(current || meetings.length > 0) && (
        <MeetingRecords meetings={meetings} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MenteeDetails mentee={mentee} />
        </CardContent>
      </Card>
      <PairingHistory pairings={pairings} partner="mentor" />
    </>
  );
}

async function AssignMentor({ mentee }: { mentee: MenteeRecord }) {
  const { matches, withoutLimit } = await listMentorMatches(mentee);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign a mentor</CardTitle>
        <CardDescription>
          {matches.length > 0
            ? "Approved mentors with a free place, those with the most in common first."
            : "No approved mentor has a free place."}
          {withoutLimit > 0 &&
            ` Not listed: ${withoutLimit} approved without a mentee limit. Set it on their page.`}
        </CardDescription>
      </CardHeader>
      {matches.length > 0 && (
        <CardContent>
          <AssignMentorList
            key={mentee.id}
            menteeId={mentee.id}
            matches={matches}
          />
        </CardContent>
      )}
    </Card>
  );
}
