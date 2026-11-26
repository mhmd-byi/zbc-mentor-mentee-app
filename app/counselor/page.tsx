import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = { title: "Counselor" };

export default function CounselorPage() {
  return (
    <Dashboard
      area="counselor"
      allowedRoles={["counselor", "admin"]}
      description="Approve mentors and pair them with mentees."
      emptyTitle="Nothing to review"
      emptyMessage="Mentor applications and pairings will appear here."
    />
  );
}
