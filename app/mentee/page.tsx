import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata: Metadata = { title: "Mentee" };

export default function MenteePage() {
  return (
    <Dashboard
      area="mentee"
      allowedRoles={["mentee"]}
      description="The person guiding you."
    >
      <EmptyState
        title="No mentor yet"
        description="Your mentor will appear here once a counselor assigns one."
      />
    </Dashboard>
  );
}
