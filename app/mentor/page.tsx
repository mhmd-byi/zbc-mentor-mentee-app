import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = { title: "Mentor" };

export default function MentorPage() {
  return (
    <Dashboard
      area="mentor"
      allowedRoles={["mentor"]}
      description="The people you're guiding."
      emptyTitle="No mentees yet"
      emptyMessage="Your mentees will appear here once a counselor assigns them."
    />
  );
}
