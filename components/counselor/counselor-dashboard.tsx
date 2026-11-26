import type { ReactNode } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { SegmentedNav } from "@/components/ui/segmented-nav";

const SECTIONS = [
  { href: "/counselor", label: "Mentors" },
  { href: "/counselor/waiting", label: "Waiting" },
  { href: "/counselor/pairings", label: "Pairings" },
];

type CounselorDashboardProps = {
  current: string;
  children: ReactNode;
};

// The counselor's lists, one per section.
export function CounselorDashboard({
  current,
  children,
}: CounselorDashboardProps) {
  return (
    <Dashboard
      area="counselor"
      allowedRoles={["counselor", "admin"]}
      description="Review mentors and pair them with mentees."
    >
      <SegmentedNav
        label="Counselor sections"
        items={SECTIONS}
        current={current}
      />
      {children}
    </Dashboard>
  );
}
