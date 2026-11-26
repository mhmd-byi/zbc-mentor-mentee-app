import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BackLink } from "@/components/layout/back-link";
import { Loading } from "@/components/layout/loading";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemporaryPasswordForm } from "@/components/users/temporary-password-form";
import { UserForm } from "@/components/users/user-form";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { UserStatusButton } from "@/components/users/user-status-button";
import { requireRole } from "@/lib/auth";
import { getUser } from "@/lib/users";

export const metadata: Metadata = { title: "Edit user" };

export default function EditUserPage({
  params,
}: PageProps<"/admin/users/[id]">) {
  return (
    <AppShell allowedRoles={["admin"]}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <BackLink href="/admin">All users</BackLink>
        <Suspense fallback={<Loading />}>
          <EditUser params={params} />
        </Suspense>
      </div>
    </AppShell>
  );
}

async function EditUser({
  params,
}: Pick<PageProps<"/admin/users/[id]">, "params">) {
  const admin = await requireRole("admin");
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();
  const isSelf = user.id === admin.id;
  const canBePaired = user.role === "mentor" || user.role === "mentee";

  return (
    <>
      <PageHeader title={user.name} description={user.email} />
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          {isSelf && (
            <CardDescription>
              This is your account, so its role and status are locked.
            </CardDescription>
          )}
          {canBePaired && (
            <CardDescription>
              Changing their role ends any active pairing and emails both people.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <UserForm key={user.id} user={user} lockRole={isSelf} />
        </CardContent>
      </Card>
      {!isSelf && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Temporary password</CardTitle>
              <CardDescription>
                Use this if they can&apos;t sign in. It signs them out
                everywhere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemporaryPasswordForm key={user.id} userId={user.id} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Account status <UserStatusBadge status={user.status} />
              </CardTitle>
              <CardDescription>
                A deactivated person can&apos;t sign in. Their records are kept.
                {canBePaired &&
                  " Deactivating also ends any active pairing and emails both people."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserStatusButton
                key={user.id}
                userId={user.id}
                status={user.status}
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
