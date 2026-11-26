import { Suspense } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppHeader } from "@/components/layout/app-header";
import { PageHeader } from "@/components/layout/page-header";
import { UserBadge } from "@/components/layout/user-badge";
import { requireRole } from "@/lib/auth";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { DashboardNav } from "./dashboard-nav";
import { EmptyState } from "./empty-state";

type DashboardProps = {
  area: Role;
  allowedRoles: Role[];
  description: string;
  emptyTitle: string;
  emptyMessage: string;
};

export function Dashboard(props: DashboardProps) {
  return (
    <>
      <AppHeader>
        <Suspense fallback={null}>
          <CurrentUser allowedRoles={props.allowedRoles} />
        </Suspense>
        <SignOutButton />
      </AppHeader>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
        <PageHeader
          title={`${ROLE_LABELS[props.area]} dashboard`}
          description={props.description}
        />
        <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
          <DashboardBody {...props} />
        </Suspense>
      </main>
    </>
  );
}

async function CurrentUser({ allowedRoles }: { allowedRoles: Role[] }) {
  const user = await requireRole(...allowedRoles);
  return <UserBadge name={user.name} />;
}

async function DashboardBody({
  area,
  allowedRoles,
  emptyTitle,
  emptyMessage,
}: DashboardProps) {
  const user = await requireRole(...allowedRoles);

  return (
    <>
      {user.role === "admin" && <DashboardNav current={area} />}
      <EmptyState title={emptyTitle} description={emptyMessage} />
    </>
  );
}
