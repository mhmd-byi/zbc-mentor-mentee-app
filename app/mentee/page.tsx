import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";
import { Dashboard } from "@/components/dashboard/dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MyMeetings } from "@/components/meetings/my-meetings";
import { ContactCard } from "@/components/pairings/contact-card";
import { SessionNotesCard } from "@/components/session-notes/session-notes-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOwnEmailStatus } from "@/lib/mentees";
import { getMyMentor } from "@/lib/pairings";
import { listMyNotes } from "@/lib/session-notes";

export const metadata: Metadata = { title: "Mentee" };

export default function MenteePage() {
  return (
    <Dashboard
      area="mentee"
      allowedRoles={["mentee"]}
      description="Your mentoring, in one place."
    >
      <MenteeHome />
    </Dashboard>
  );
}

// A mentee joins the waiting list once their email is verified.
async function MenteeHome() {
  const status = await getOwnEmailStatus();
  if (!status) notFound();

  if (!status.verified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            {status.linkSent
              ? `We sent a link to ${status.email}. It works for 24 hours, so check your spam folder if you can't see it.`
              : `We couldn't send a link to ${status.email}. Try sending it again.`}{" "}
            Wrong address? Contact an administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResendVerificationButton />
        </CardContent>
      </Card>
    );
  }

  const mentor = await getMyMentor();
  if (mentor) {
    const notes = await listMyNotes();
    return (
      <>
        <MyMeetings partners={[mentor]} />
        <h2 className="text-lg font-semibold tracking-[-0.01em]">
          Your mentor
        </h2>
        <ContactCard partner={mentor} />
        <SessionNotesCard notes={notes} />
      </>
    );
  }

  return (
    <EmptyState
      title="You're on the waiting list"
      description="Your mentor will appear here once a counselor assigns one."
    />
  );
}
