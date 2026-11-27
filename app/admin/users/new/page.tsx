import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/layout/back-link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { UserForm } from "@/components/users/user-form";

export const metadata: Metadata = { title: "Add user" };

export default function NewUserPage() {
  return (
    <AppShell allowedRoles={["admin"]}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <BackLink href="/admin">All users</BackLink>
        <PageHeader
          title="Add user"
          description="They'll be emailed about the account. You give them the temporary password yourself."
        />
        <Card>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
