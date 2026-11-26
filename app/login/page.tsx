import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { CenteredCard } from "@/components/layout/centered-card";
import { getCurrentUser } from "@/lib/auth";
import { DASHBOARD_PATHS } from "@/lib/roles";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <CenteredCard
      title="Sign in"
      description="to ZBC Mentorship"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Can&apos;t sign in? Contact your administrator.
        </p>
      }
    >
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <LoginForm />
    </CenteredCard>
  );
}

async function RedirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect(DASHBOARD_PATHS[user.role]);
  return null;
}
