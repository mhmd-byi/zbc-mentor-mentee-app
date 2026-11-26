import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata: Metadata = { title: "Counselor" };

export default function CounselorPage() {
  return (
    <Dashboard
      area="counselor"
      allowedRoles={["counselor", "admin"]}
      description="Approve mentors and pair them with mentees."
    >
      <EmptyState
        title="Nothing to review"
        description="Mentor applications and pairings will appear here."
      />
    </Dashboard>
  );
}
