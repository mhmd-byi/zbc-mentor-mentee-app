import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";
import { AppHeader } from "@/components/layout/app-header";
import { PageHeader } from "@/components/layout/page-header";
import { MentorApplicationForm } from "@/components/mentors/mentor-application-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Become a mentor" };

export default function BecomeAMentorPage() {
  return (
    <>
      <AppHeader>
        <Link href="/login" className={buttonVariants({ variant: "secondary" })}>
          Sign in
        </Link>
      </AppHeader>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
        <Suspense fallback={null}>
          <RedirectIfSignedIn />
        </Suspense>
        <PageHeader
          title="Become a mentor"
          description="Tell us about yourself. A counselor will review your application."
        />
        <Card>
          <CardContent>
            <MentorApplicationForm />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
