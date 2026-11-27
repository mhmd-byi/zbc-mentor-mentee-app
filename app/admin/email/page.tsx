import type { Metadata } from "next";
import { Suspense } from "react";
import { TestEmailForm } from "@/components/email/test-email-form";
import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/layout/back-link";
import { DetailsList } from "@/components/layout/details-list";
import { Loading } from "@/components/layout/loading";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/auth";
import { emailSettings } from "@/lib/email";
import { getUser } from "@/lib/users";

export const metadata: Metadata = { title: "Email test" };

export default function EmailTestPage() {
  return (
    <AppShell allowedRoles={["admin"]}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <BackLink href="/admin">All users</BackLink>
        <PageHeader
          title="Email test"
          description="Check that the app can send email."
        />
        <Suspense fallback={<Loading />}>
          <EmailTest />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function EmailTest() {
  const admin = await requireRole("admin");
  const user = await getUser(admin.id);
  // Read after the sign-in check, so these are the running server's values.
  const settings = emailSettings();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Settings in use</CardTitle>
          <CardDescription>
            Changed them? Restart or redeploy the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DetailsList
            details={[
              {
                label: "Resend API key",
                value: settings.apiKeySet ? "Set" : "Missing",
              },
              {
                label: "Sender (EMAIL_FROM)",
                value: settings.from || "Missing",
                wide: true,
              },
              {
                label: "Links in emails point to (APP_URL)",
                value: settings.appUrl || "Missing",
                wide: true,
              },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Send a test</CardTitle>
          <CardDescription>
            Each test counts towards your Resend sending limit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestEmailForm defaultTo={user?.email ?? ""} />
        </CardContent>
      </Card>
    </>
  );
}
