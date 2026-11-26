import { Suspense, type ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Loading } from "@/components/layout/loading";
import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { DashboardNav } from "./dashboard-nav";

type DashboardProps = {
  area: Role;
  allowedRoles: Role[];
  description: string;
  children: ReactNode;
};

export function Dashboard({ description, ...body }: DashboardProps) {
  return (
    <AppShell allowedRoles={body.allowedRoles}>
      <PageHeader
        title={`${ROLE_LABELS[body.area]} dashboard`}
        description={description}
      />
      <Suspense fallback={<Loading />}>
        <DashboardBody {...body} />
      </Suspense>
    </AppShell>
  );
}

async function DashboardBody({
  area,
  allowedRoles,
  children,
}: Omit<DashboardProps, "description">) {
  const user = await requireRole(...allowedRoles);

  return (
    <>
      {user.role === "admin" && <DashboardNav current={area} />}
      {children}
    </>
  );
}
