import { Badge } from "@/components/ui/badge";
import type { UserStatus } from "@/lib/db";

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return status === "active" ? (
    <Badge variant="outline">Active</Badge>
  ) : (
    <Badge variant="destructive">Deactivated</Badge>
  );
}
