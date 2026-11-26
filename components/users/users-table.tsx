"use client";

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_equalsString,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { ROLE_LABELS, ROLES } from "@/lib/roles";
import type { UserRecord } from "@/lib/users";
import { UserStatusBadge } from "./user-status-badge";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { equalsString: filterFn_equalsString },
});

const column = createColumnHelper<typeof features, UserRecord>();

const columns = column.columns([
  column.accessor("name", {
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.id}`}
        className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="block font-semibold text-primary">
          {row.original.name}
        </span>
        <span className="block text-muted-foreground">
          {row.original.email}
        </span>
      </Link>
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

// Left out on narrow screens; they're on the person's own page.
const HIDDEN_ON_PHONES = ["phone", "itsId"];

function columnClass(id: string) {
  return HIDDEN_ON_PHONES.includes(id) ? "hidden px-4 md:table-cell" : "px-4";
}

export function UsersTable({ users }: { users: UserRecord[] }) {
  const table = useTable({
    features,
    columns,
    data: users,
    initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
    // One search box that looks across the identifying details.
    globalFilterFn: (row, _columnId, search: string) => {
      const { name, email, phone, itsId } = row.original;
      const needle = search.trim().toLowerCase();
      return [name, email, phone, itsId].some((value) =>
        value.toLowerCase().includes(needle),
      );
    },
  });

  const { rows } = table.getRowModel();
  const matches = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  function filterValue(id: "role" | "status") {
    return String(table.getColumn(id)?.getFilterValue() ?? "");
  }

  function setFilter(id: "role" | "status", value: string) {
    table.getColumn(id)?.setFilterValue(value || undefined);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          aria-label="Search people"
          placeholder="Search name, email, phone or ITS ID"
          className="sm:flex-1"
          value={String(table.state.globalFilter ?? "")}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
        />
        <NativeSelect
          aria-label="Filter by role"
          className="w-full sm:w-fit"
          value={filterValue("role")}
          onChange={(event) => setFilter("role", event.target.value)}
        >
          <NativeSelectOption value="">All roles</NativeSelectOption>
          {ROLES.map((role) => (
            <NativeSelectOption key={role} value={role}>
              {ROLE_LABELS[role]}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Filter by status"
          className="w-full sm:w-fit"
          value={filterValue("status")}
          onChange={(event) => setFilter("status", event.target.value)}
        >
          <NativeSelectOption value="">Any status</NativeSelectOption>
          <NativeSelectOption value="active">Active</NativeSelectOption>
          <NativeSelectOption value="deactivated">
            Deactivated
          </NativeSelectOption>
        </NativeSelect>
        <Link
          href="/admin/users/new"
          className={buttonVariants({ size: "lg" })}
        >
          Add user
        </Link>
      </div>

      <Card className="py-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${columnClass(header.column.id)} text-muted-foreground`}
                  >
                    <table.FlexRender header={header} />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${columnClass(cell.column.id)} py-3`}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-muted-foreground">
            No one matches your search.
          </p>
        )}
      </Card>

      <TablePagination
        count={matches}
        noun={["person", "people"]}
        pageIndex={table.state.pagination.pageIndex}
        pageCount={pageCount}
        hasPrevious={table.getCanPreviousPage()}
        hasNext={table.getCanNextPage()}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
      />
    </div>
  );
}
