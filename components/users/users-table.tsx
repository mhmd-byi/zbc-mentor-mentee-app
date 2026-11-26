"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/table/data-table";
import type { Features } from "@/components/table/features";
import { PersonLink } from "@/components/table/person-link";
import { TableFilter, TableSearch } from "@/components/table/table-controls";
import { useDataTable } from "@/components/table/use-data-table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ROLE_LABELS, ROLES } from "@/lib/roles";
import type { UserRecord } from "@/lib/users";
import { UserStatusBadge } from "./user-status-badge";

const column = createColumnHelper<Features, UserRecord>();

const columns = column.columns([
  column.accessor("name", {
    header: "Name",
    cell: ({ row }) => (
      <PersonLink
        href={`/admin/users/${row.original.id}`}
        name={row.original.name}
        detail={row.original.email}
      />
    ),
  }),
  column.accessor("role", {
    header: "Role",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <Badge variant="secondary">{ROLE_LABELS[row.original.role]}</Badge>
    ),
  }),
  column.accessor("phone", { header: "Phone" }),
  column.accessor("itsId", { header: "ITS ID" }),
  column.accessor("status", {
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
  }),
]);

const ROLE_OPTIONS = ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "deactivated", label: "Deactivated" },
];

export function UsersTable({ users }: { users: UserRecord[] }) {
  const table = useDataTable({
    data: users,
    columns,
    searchText: ({ name, email, phone, itsId }) => [name, email, phone, itsId],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <TableSearch
          table={table}
          label="Search people"
          placeholder="Search name, email, phone or ITS ID"
        />
        <TableFilter
          table={table}
          column="role"
          label="Filter by role"
          allLabel="All roles"
          options={ROLE_OPTIONS}
        />
        <TableFilter
          table={table}
          column="status"
          label="Filter by status"
          allLabel="Any status"
          options={STATUS_OPTIONS}
        />
        <Link
          href="/admin/users/new"
          className={buttonVariants({ size: "lg" })}
        >
          Add user
        </Link>
      </div>
      <DataTable
        table={table}
        // They're on the person's own page.
        hiddenOnPhones={["phone", "itsId"]}
        noun={["person", "people"]}
        emptyMessage="No one matches your search."
      />
    </div>
  );
}
