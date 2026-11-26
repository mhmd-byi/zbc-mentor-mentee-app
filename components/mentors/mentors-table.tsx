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
import { UserStatusBadge } from "@/components/users/user-status-badge";
import type { MentorRecord } from "@/lib/mentors";
import { ApplicationStatusBadge } from "./application-status-badge";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { equalsString: filterFn_equalsString },
});

const column = createColumnHelper<typeof features, MentorRecord>();

function expertiseOf(mentor: MentorRecord) {
  return [...mentor.expertise, mentor.otherExpertise]
    .filter(Boolean)
    .join(", ");
}

const columns = column.columns([
  column.accessor("name", {
    header: "Mentor",
    cell: ({ row }) => (
      <Link
        href={`/counselor/mentors/${row.original.id}`}
        className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="block font-semibold text-primary">
          {row.original.name}
        </span>
        <span className="block text-muted-foreground">
          {row.original.occupation || row.original.email}
        </span>
      </Link>
    ),
  }),
  column.accessor(expertiseOf, {
    id: "expertise",
    header: "Expertise",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-60 whitespace-normal">
        {expertiseOf(row.original)}
      </span>
    ),
  }),
  column.accessor("maxMentees", {
    header: "Limit",
    cell: ({ row }) => row.original.maxMentees ?? "Not set",
  }),
  column.accessor("submittedOn", { header: "Submitted" }),
  column.accessor("applicationStatus", {
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <span className="flex flex-wrap gap-1">
        <ApplicationStatusBadge status={row.original.applicationStatus} />
        {row.original.accountStatus === "deactivated" && (
          <UserStatusBadge status="deactivated" />
        )}
      </span>
    ),
  }),
]);

// Left out on narrow screens; they're on the mentor's own page.
const HIDDEN_ON_PHONES = ["expertise", "maxMentees", "submittedOn"];

function columnClass(id: string) {
  return HIDDEN_ON_PHONES.includes(id) ? "hidden px-4 md:table-cell" : "px-4";
}

export function MentorsTable({ mentors }: { mentors: MentorRecord[] }) {
  const table = useTable({
    features,
    columns,
    data: mentors,
    initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
    globalFilterFn: (row, _columnId, search: string) => {
      const mentor = row.original;
      const needle = search.trim().toLowerCase();
      return [
        mentor.name,
        mentor.email,
        mentor.occupation,
        expertiseOf(mentor),
      ].some((value) => value.toLowerCase().includes(needle));
    },
  });

  const { rows } = table.getRowModel();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          aria-label="Search mentors"
          placeholder="Search name, email, occupation or expertise"
          className="sm:flex-1"
          value={String(table.state.globalFilter ?? "")}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
        />
        <NativeSelect
          aria-label="Filter by status"
          className="w-full sm:w-fit"
          value={String(
            table.getColumn("applicationStatus")?.getFilterValue() ?? "",
          )}
          onChange={(event) =>
            table
              .getColumn("applicationStatus")
              ?.setFilterValue(event.target.value || undefined)
          }
        >
          <NativeSelectOption value="">Any status</NativeSelectOption>
          <NativeSelectOption value="pending">
            Pending review
          </NativeSelectOption>
          <NativeSelectOption value="approved">Approved</NativeSelectOption>
          <NativeSelectOption value="rejected">Rejected</NativeSelectOption>
        </NativeSelect>
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
            No mentor matches your search.
          </p>
        )}
      </Card>

      <TablePagination
        count={table.getFilteredRowModel().rows.length}
        noun={["mentor", "mentors"]}
        pageIndex={table.state.pagination.pageIndex}
        pageCount={table.getPageCount()}
        hasPrevious={table.getCanPreviousPage()}
        hasNext={table.getCanNextPage()}
        onPrevious={() => table.previousPage()}
        onNext={() => table.nextPage()}
      />
    </div>
  );
}
