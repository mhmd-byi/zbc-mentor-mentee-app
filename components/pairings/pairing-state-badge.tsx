import { Badge } from "@/components/ui/badge";
import type { PairingRecord } from "@/lib/pairings";

const BADGES = {
  active: { label: "Active", variant: "outline" },
  completed: { label: "Completed", variant: "secondary" },
  ended_early: { label: "Ended early", variant: "destructive" },
} as const;

export function PairingStateBadge({ state }: { state: PairingRecord["state"] }) {
  const { label, variant } = BADGES[state];
  return <Badge variant={variant}>{label}</Badge>;
}
