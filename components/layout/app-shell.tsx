import { Suspense, type ReactNode } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireRole } from "@/lib/auth";
import type { Role } from "@/lib/roles";
import { AppHeader } from "./app-header";
import { UserBadge } from "./user-badge";

type AppShellProps = {
  allowedRoles: Role[];
  children: ReactNode;
};

// The frame around every signed-in page.
export function AppShell({ allowedRoles, children }: AppShellProps) {
  return (
    <>
      <AppHeader>
        <Suspense fallback={null}>
          <CurrentUser allowedRoles={allowedRoles} />
        </Suspense>
        <SignOutButton />
      </AppHeader>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
        {children}
      </main>
    </>
  );
}

async function CurrentUser({ allowedRoles }: { allowedRoles: Role[] }) {
  const user = await requireRole(...allowedRoles);
  return <UserBadge name={user.name} />;
}
