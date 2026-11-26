"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table";
import type { Features } from "@/components/table/features";
import { PersonLink } from "@/components/table/person-link";
import { TableSearch } from "@/components/table/table-controls";
import { useDataTable } from "@/components/table/use-data-table";
import type { MenteeRecord } from "@/lib/mentees";
import { areasText, availabilityLabels } from "@/lib/mentor-options";

const column = createColumnHelper<Features, MenteeRecord>();

const interestsOf = (mentee: MenteeRecord) =>
  areasText(mentee.interests, mentee.otherInterests);

const columns = column.columns([
  column.accessor("name", {
    header: "Mentee",
    cell: ({ row }) => (
      <PersonLink
        href={`/counselor/mentees/${row.original.id}`}
        name={row.original.name}
        detail={row.original.email}
      />
    ),
  }),
  column.accessor(interestsOf, {
    id: "interests",
    header: "Interests",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-60 whitespace-normal">
        {interestsOf(row.original)}
      </span>
    ),
  }),
  column.accessor(
    (mentee) => availabilityLabels(mentee.availability).join(", "),
    {
      id: "availability",
      header: "Available",
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-48 whitespace-normal">
          {availabilityLabels(row.original.availability).join(", ")}
        </span>
      ),
    },
  ),
  column.accessor("joinedOn", { header: "Joined" }),
]);

export function WaitingMenteesTable({ mentees }: { mentees: MenteeRecord[] }) {
  const table = useDataTable({
    data: mentees,
    columns,
    searchText: (mentee) => [
      mentee.name,
      mentee.email,
      mentee.occupation,
      interestsOf(mentee),
    ],
  });

  return (
    <div className="flex flex-col gap-4">
      <TableSearch
        table={table}
        label="Search waiting mentees"
        placeholder="Search name, email, occupation or interests"
      />
      <DataTable
        table={table}
        hiddenOnPhones={["interests", "availability"]}
        noun={["mentee waiting", "mentees waiting"]}
        emptyMessage="No mentee matches your search."
      />
    </div>
  );
}
