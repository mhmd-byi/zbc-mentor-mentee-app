import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";
import { CenteredCard } from "@/components/layout/centered-card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <CenteredCard
      title="Sign in"
      description="to ZBC Mentorship"
      footer={
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/become-a-mentor"
            className={buttonVariants({ variant: "secondary" })}
          >
            Become a mentor
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Can&apos;t sign in? Contact your administrator.
          </p>
        </div>
      }
    >
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <LoginForm />
    </CenteredCard>
  );
}
