import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";
import { AppHeader } from "@/components/layout/app-header";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SignupPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

// The frame around a public sign-up form.
export function SignupPage({ title, description, children }: SignupPageProps) {
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
        <PageHeader title={title} description={description} />
        <Card>
          <CardContent>{children}</CardContent>
        </Card>
      </main>
    </>
  );
}
