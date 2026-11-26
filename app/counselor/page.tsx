import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MentorsTable } from "@/components/mentors/mentors-table";
import { listMentors } from "@/lib/mentors";

export const metadata: Metadata = { title: "Counselor" };

export default function CounselorPage() {
  return (
    <Dashboard
      area="counselor"
      allowedRoles={["counselor", "admin"]}
      description="Review mentor applications and manage mentors."
    >
      <Mentors />
    </Dashboard>
  );
}

async function Mentors() {
  const mentors = await listMentors();

  if (mentors.length === 0) {
    return (
      <EmptyState
        title="No mentors yet"
        description="Mentor applications will appear here."
      />
    );
  }
  return <MentorsTable mentors={mentors} />;
}
