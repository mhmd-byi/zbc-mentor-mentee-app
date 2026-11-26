import Link from "next/link";
import { DASHBOARD_PATHS, ROLE_LABELS, type Role } from "@/lib/roles";

// The dashboards an admin can switch between.
const ADMIN_AREAS: Role[] = ["admin", "counselor"];

export function DashboardNav({ current }: { current: Role }) {
  return (
    <nav
      aria-label="Dashboards"
      className="flex gap-1 self-start rounded-2xl bg-secondary p-1"
    >
      {ADMIN_AREAS.map((area) => (
        <Link
          key={area}
          href={DASHBOARD_PATHS[area]}
          aria-current={area === current ? "page" : undefined}
          className="flex h-9 items-center rounded-xl px-4 font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:bg-selected aria-[current=page]:shadow-sm"
        >
          {ROLE_LABELS[area]}
        </Link>
      ))}
    </nav>
  );
}
