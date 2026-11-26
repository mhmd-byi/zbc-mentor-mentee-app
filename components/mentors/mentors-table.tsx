"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table";
import type { Features } from "@/components/table/features";
import { PersonLink } from "@/components/table/person-link";
import { TableFilter, TableSearch } from "@/components/table/table-controls";
import { useDataTable } from "@/components/table/use-data-table";
import { UserStatusBadge } from "@/components/users/user-status-badge";
import { areasText } from "@/lib/mentor-options";
import type { MentorRecord } from "@/lib/mentors";
import { ApplicationStatusBadge } from "./application-status-badge";

const column = createColumnHelper<Features, MentorRecord>();

const expertiseOf = (mentor: MentorRecord) =>
  areasText(mentor.expertise, mentor.otherExpertise);

const columns = column.columns([
  column.accessor("name", {
    header: "Mentor",
    cell: ({ row }) => (
      <PersonLink
        href={`/counselor/mentors/${row.original.id}`}
        name={row.original.name}
        detail={row.original.occupation || row.original.email}
      />
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
  column.accessor("activeMentees", {
    header: "Mentees",
    cell: ({ row }) => {
      const { applicationStatus, activeMentees, maxMentees } = row.original;
      if (applicationStatus !== "approved") return "–";
      return `${activeMentees} of ${maxMentees ?? "not set"}`;
    },
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

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function MentorsTable({ mentors }: { mentors: MentorRecord[] }) {
  const table = useDataTable({
    data: mentors,
    columns,
    searchText: (mentor) => [
      mentor.name,
      mentor.email,
      mentor.occupation,
      expertiseOf(mentor),
    ],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <TableSearch
          table={table}
          label="Search mentors"
          placeholder="Search name, email, occupation or expertise"
        />
        <TableFilter
          table={table}
          column="applicationStatus"
          label="Filter by status"
          allLabel="Any status"
          options={STATUS_OPTIONS}
        />
      </div>
      <DataTable
        table={table}
        hiddenOnPhones={["expertise", "activeMentees", "submittedOn"]}
        noun={["mentor", "mentors"]}
        emptyMessage="No mentor matches your search."
      />
    </div>
  );
}
