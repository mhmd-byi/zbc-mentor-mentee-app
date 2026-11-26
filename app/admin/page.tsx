import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";
import { FormMessage } from "@/components/ui/form-message";
import { UsersTable } from "@/components/users/users-table";
import { listUsers } from "@/lib/users";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Dashboard
      area="admin"
      allowedRoles={["admin"]}
      description="Manage people and keep the programme running."
    >
      <Users searchParams={searchParams} />
    </Dashboard>
  );
}

async function Users({
  searchParams,
}: Pick<PageProps<"/admin">, "searchParams">) {
  const [users, { created }] = await Promise.all([listUsers(), searchParams]);

  return (
    <>
      {created !== undefined && (
        <FormMessage success="Account created. Share the temporary password with them privately." />
      )}
      <UsersTable users={users} />
    </>
  );
}
