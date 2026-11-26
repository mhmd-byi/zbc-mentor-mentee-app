"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table";
import type { Features } from "@/components/table/features";
import { PersonLink } from "@/components/table/person-link";
import { TableFilter, TableSearch } from "@/components/table/table-controls";
import { useDataTable } from "@/components/table/use-data-table";
import { PAIRING_OUTCOMES } from "@/lib/pairing-schema";
import type { PairingRecord } from "@/lib/pairings";
import { PairingStateBadge } from "./pairing-state-badge";

const column = createColumnHelper<Features, PairingRecord>();

const columns = column.columns([
  column.accessor("menteeName", {
    header: "Mentee",
    cell: ({ row }) => (
      <PersonLink
        href={`/counselor/mentees/${row.original.menteeId}`}
        name={row.original.menteeName}
      />
    ),
  }),
  column.accessor("mentorName", {
    header: "Mentor",
    cell: ({ row }) => (
      <PersonLink
        href={`/counselor/mentors/${row.original.mentorId}`}
        name={row.original.mentorName}
      />
    ),
  }),
  column.accessor("startedOn", { header: "Started" }),
  column.accessor("endedOn", { header: "Ended" }),
  column.accessor("note", {
    header: "Note",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-52 whitespace-normal">
        {row.original.note}
      </span>
    ),
  }),
  column.accessor("state", {
    header: "Status",
    filterFn: "equalsString",
    cell: ({ row }) => <PairingStateBadge state={row.original.state} />,
  }),
]);

const STATE_OPTIONS = [
  { value: "active", label: "Active" },
  ...PAIRING_OUTCOMES,
];

export function PairingsTable({ pairings }: { pairings: PairingRecord[] }) {
  const table = useDataTable({
    data: pairings,
    columns,
    searchText: ({ menteeName, mentorName }) => [menteeName, mentorName],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <TableSearch
          table={table}
          label="Search pairings"
          placeholder="Search mentor or mentee"
        />
        <TableFilter
          table={table}
          column="state"
          label="Filter by status"
          allLabel="Any status"
          options={STATE_OPTIONS}
        />
      </div>
      <DataTable
        table={table}
        hiddenOnPhones={["startedOn", "endedOn", "note"]}
        noun={["pairing", "pairings"]}
        emptyMessage="No pairing matches your search."
      />
    </div>
  );
}
