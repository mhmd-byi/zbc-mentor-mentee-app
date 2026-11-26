import type { Metadata } from "next";
import { CounselorDashboard } from "@/components/counselor/counselor-dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { WaitingMenteesTable } from "@/components/mentees/waiting-mentees-table";
import { listWaitingMentees } from "@/lib/mentees";

export const metadata: Metadata = { title: "Waiting mentees" };

export default function WaitingMenteesPage() {
  return (
    <CounselorDashboard current="/counselor/waiting">
      <WaitingMentees />
    </CounselorDashboard>
  );
}

async function WaitingMentees() {
  const mentees = await listWaitingMentees();

  if (mentees.length === 0) {
    return (
      <EmptyState
        title="No one is waiting"
        description="Mentees appear here once they've verified their email and need a mentor."
      />
    );
  }
  return <WaitingMenteesTable mentees={mentees} />;
}
