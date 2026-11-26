"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { MentorMatch } from "@/lib/mentors";
import { AssignButton } from "./assign-button";

type AssignMentorListProps = {
  menteeId: string;
  // Already ordered with the closest matches first.
  matches: MentorMatch[];
};

export function AssignMentorList({ menteeId, matches }: AssignMentorListProps) {
  const [search, setSearch] = useState("");
  const needle = search.trim().toLowerCase();
  const shown = matches.filter(({ name, occupation, expertise }) =>
    [name, occupation, expertise].some((value) =>
      value.toLowerCase().includes(needle),
    ),
  );

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="search"
        aria-label="Search mentors"
        placeholder="Search name, occupation or expertise"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <ul className="divide-y">
        {shown.map((match) => (
          <li
            key={match.id}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <Link
                href={`/counselor/mentors/${match.id}`}
                className="font-semibold text-primary"
              >
                {match.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {[match.occupation, match.expertise]
                  .filter(Boolean)
                  .join(" · ") || "No profile details"}
              </p>
              <p className="text-sm text-muted-foreground">
                {match.activeMentees} of {match.maxMentees} places filled
              </p>
              {match.shared.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-sm">In common:</span>
                  {match.shared.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <AssignButton menteeId={menteeId} mentorId={match.id} />
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p className="py-3 text-center text-muted-foreground">
          No mentor matches your search.
        </p>
      )}
    </div>
  );
}
