import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MentorApplicationForm } from "@/components/mentors/mentor-application-form";
import { MentorDetails } from "@/components/mentors/mentor-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOwnMentor } from "@/lib/mentors";

export const metadata: Metadata = { title: "Mentor" };

export default function MentorPage() {
  return (
    <Dashboard
      area="mentor"
      allowedRoles={["mentor"]}
      description="Your mentoring, in one place."
    >
      <MentorHome />
    </Dashboard>
  );
}

// What a mentor sees depends on where their application stands.
async function MentorHome() {
  const mentor = await getOwnMentor();
  if (!mentor) notFound();

  if (mentor.applicationStatus === "pending") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your application is under review</CardTitle>
          <CardDescription>
            Sent on {mentor.submittedOn}. Sign in again later to see the
            decision.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MentorDetails mentor={mentor} />
        </CardContent>
      </Card>
    );
  }

  if (mentor.applicationStatus === "rejected") {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Your application wasn&apos;t approved</CardTitle>
            <CardDescription>
              Correct it below and send it again.
            </CardDescription>
          </CardHeader>
          <CardContent className="whitespace-pre-line">
            Reason: {mentor.rejectionReason}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MentorApplicationForm mentor={mentor} />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <EmptyState
      title="No mentees yet"
      description="Your mentees will appear here once a counselor assigns them."
    />
  );
}
