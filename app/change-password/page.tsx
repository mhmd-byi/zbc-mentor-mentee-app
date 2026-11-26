import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CenteredCard } from "@/components/layout/centered-card";
import { Loading } from "@/components/layout/loading";
import { requireUser } from "@/lib/auth";
import { DASHBOARD_PATHS } from "@/lib/roles";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ChangePasswordPage() {
  return (
    <CenteredCard
      title="Choose a new password"
      description="Replace your temporary password to continue."
      footer={<SignOutButton />}
    >
      <Suspense fallback={<Loading />}>
        <ChangePassword />
      </Suspense>
    </CenteredCard>
  );
}

async function ChangePassword() {
  const user = await requireUser();
  if (!user.mustChangePassword) redirect(DASHBOARD_PATHS[user.role]);
  return <ChangePasswordForm />;
}
