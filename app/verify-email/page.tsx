import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { VerifyEmailButton } from "@/components/auth/verify-email-button";
import { CenteredCard } from "@/components/layout/centered-card";
import { Loading } from "@/components/layout/loading";
import { buttonVariants } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

export const metadata: Metadata = { title: "Verify your email" };

export default function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  return (
    <CenteredCard
      title="Verify your email"
      description="Confirm your address to join the waiting list."
      // The login page forwards anyone signed in to their dashboard.
      footer={
        <Link href="/login" className={buttonVariants({ variant: "secondary" })}>
          Continue
        </Link>
      }
    >
      <Suspense fallback={<Loading />}>
        <Verify searchParams={searchParams} />
      </Suspense>
    </CenteredCard>
  );
}

async function Verify({
  searchParams,
}: Pick<PageProps<"/verify-email">, "searchParams">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) {
    return (
      <FormMessage error="This link is incomplete. Open it from the email again." />
    );
  }
  return <VerifyEmailButton token={token} />;
}
