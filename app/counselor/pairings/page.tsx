import type { Metadata } from "next";
import { CounselorDashboard } from "@/components/counselor/counselor-dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PairingsTable } from "@/components/pairings/pairings-table";
import { listPairings } from "@/lib/pairings";

export const metadata: Metadata = { title: "Pairings" };

export default function PairingsPage() {
  return (
    <CounselorDashboard current="/counselor/pairings">
      <Pairings />
    </CounselorDashboard>
  );
}

async function Pairings() {
  const pairings = await listPairings();

  if (pairings.length === 0) {
    return (
      <EmptyState
        title="No pairings yet"
        description="Assign a mentor to a waiting mentee to start one."
      />
    );
  }
  return <PairingsTable pairings={pairings} />;
}
