import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata: Metadata = { title: "Mentor" };

export default function MentorPage() {
  return (
    <Dashboard
      area="mentor"
      allowedRoles={["mentor"]}
      description="The people you're guiding."
    >
      <EmptyState
        title="No mentees yet"
        description="Your mentees will appear here once a counselor assigns them."
      />
    </Dashboard>
  );
}
