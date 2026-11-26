import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/layout/back-link";
import { Loading } from "@/components/layout/loading";
import { PageHeader } from "@/components/layout/page-header";
import { ApplicationStatusBadge } from "@/components/mentors/application-status-badge";
import { MaxMenteesForm } from "@/components/mentors/max-mentees-form";
import { MentorDetails } from "@/components/mentors/mentor-details";
import { RejectMentorForm } from "@/components/mentors/reject-mentor-form";
import { PairingHistory } from "@/components/pairings/pairing-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { requireRole } from "@/lib/auth";
import { getMentor } from "@/lib/mentors";
import { listPairings, type PairingRecord } from "@/lib/pairings";

export const metadata: Metadata = { title: "Mentor application" };

export default function MentorReviewPage({
  params,
}: PageProps<"/counselor/mentors/[id]">) {
  return (
    <AppShell allowedRoles={["counselor", "admin"]}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <BackLink href="/counselor">All mentors</BackLink>
        <Suspense fallback={<Loading />}>
          <MentorReview params={params} />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function MentorReview({
  params,
}: Pick<PageProps<"/counselor/mentors/[id]">, "params">) {
  await requireRole("counselor", "admin");
  const { id } = await params;
  const mentor = await getMentor(id);
  if (!mentor) notFound();
  const pairings = await listPairings({ mentorId: id });
  const status = mentor.applicationStatus;

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <PageHeader
          title={mentor.name}
          description={
            mentor.submittedOn
              ? `Applied on ${mentor.submittedOn}`
              : "Added by an admin"
          }
        />
        <div className="flex gap-2">
          <ApplicationStatusBadge status={status} />
          {mentor.accountStatus === "deactivated" && (
            <UserStatusBadge status="deactivated" />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application</CardTitle>
        </CardHeader>
        <CardContent>
          <MentorDetails mentor={mentor} />
        </CardContent>
      </Card>

      {status === "rejected" && (
        <Card>
          <CardHeader>
            <CardTitle>Reason for rejection</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-line">
            {mentor.rejectionReason}
          </CardContent>
        </Card>
      )}

      {status === "approved" && <CurrentMentees pairings={pairings} />}

      {status === "approved" ? (
        <Card key="limit">
          <CardHeader>
            <CardTitle>Mentee limit</CardTitle>
            <CardDescription>
              {mentor.activeMentees} of {mentor.maxMentees ?? "not set"} places
              filled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MaxMenteesForm
              key={`limit-${mentor.id}`}
              mentorId={mentor.id}
              current={mentor.maxMentees}
            />
          </CardContent>
        </Card>
      ) : (
        <Card key="approve">
          <CardHeader>
            <CardTitle>Approve</CardTitle>
            <CardDescription>
              Confirm how many mentees they can take. It starts at the number
              they asked for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MaxMenteesForm
              key={`approve-${mentor.id}`}
              mentorId={mentor.id}
              current={mentor.maxMentees}
              approve
            />
          </CardContent>
        </Card>
      )}

      {status === "pending" && (
        <Card key="reject">
          <CardHeader>
            <CardTitle>Reject</CardTitle>
            <CardDescription>
              They can correct their application and send it again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RejectMentorForm key={mentor.id} mentorId={mentor.id} />
          </CardContent>
        </Card>
      )}
      <PairingHistory pairings={pairings} partner="mentee" />
    </>
  );
}

// Each pairing is ended from the mentee's page.
function CurrentMentees({ pairings }: { pairings: PairingRecord[] }) {
  const active = pairings.filter((pairing) => pairing.state === "active");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current mentees</CardTitle>
        <CardDescription>
          {active.length > 0
            ? "Open a mentee to end their pairing."
            : "No mentees assigned. Assign one from the waiting list."}
        </CardDescription>
      </CardHeader>
      {active.length > 0 && (
        <CardContent>
          <ul className="divide-y">
            {active.map((pairing) => (
              <li key={pairing.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/counselor/mentees/${pairing.menteeId}`}
                  className="font-semibold text-primary"
                >
                  {pairing.menteeName}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Since {pairing.startedOn}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
