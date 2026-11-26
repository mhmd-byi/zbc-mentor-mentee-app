import { SegmentedNav } from "@/components/ui/segmented-nav";
import { DASHBOARD_PATHS, ROLE_LABELS, type Role } from "@/lib/roles";

// The dashboards an admin can switch between.
const ADMIN_AREAS: Role[] = ["admin", "counselor"];

export function DashboardNav({ current }: { current: Role }) {
  return (
    <SegmentedNav
      label="Dashboards"
      current={DASHBOARD_PATHS[current]}
      items={ADMIN_AREAS.map((area) => ({
        href: DASHBOARD_PATHS[area],
        label: ROLE_LABELS[area],
      }))}
    />
  );
}
