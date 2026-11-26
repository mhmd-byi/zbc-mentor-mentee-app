import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/lib/db";

const BADGES = {
  pending: { label: "Pending review", variant: "secondary" },
  approved: { label: "Approved", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
} as const;

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const { label, variant } = BADGES[status];
  return <Badge variant={variant}>{label}</Badge>;
}
