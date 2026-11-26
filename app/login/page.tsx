import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { PageHeader } from "@/components/layout/page-header";
import { Logo } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { DASHBOARD_PATHS } from "@/lib/roles";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-brand-glow px-4 py-10">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <Card className="w-full max-w-[27rem] motion-safe:animate-materialize sm:[--card-spacing:--spacing(10)]">
        <CardContent className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-5 text-center">
            <Logo height={104} />
            <PageHeader title="Sign in" description="to ZBC Mentorship" />
          </div>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        Can&apos;t sign in? Contact your administrator.
      </p>
    </main>
  );
}

async function RedirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect(DASHBOARD_PATHS[user.role]);
  return null;
}
