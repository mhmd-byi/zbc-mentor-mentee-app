import { AVAILABILITY_OPTIONS } from "@/lib/mentor-options";
import type { MentorRecord } from "@/lib/mentors";

// Everything on a mentor's application, read-only.
export function MentorDetails({ mentor }: { mentor: MentorRecord }) {
  const availability = AVAILABILITY_OPTIONS.filter((option) =>
    mentor.availability.includes(option.value),
  ).map((option) => option.label);

  const rows = [
    ["Email", mentor.email],
    ["Phone", mentor.phone],
    ["ITS ID", mentor.itsId],
    ["City or area", mentor.city],
    ["Mohalla", mentor.mohalla],
    ["Occupation", mentor.occupation],
    ["Company or business", mentor.company],
    ["Years of experience", mentor.yearsExperience?.toString()],
    [
      "Expertise",
      [...mentor.expertise, mentor.otherExpertise].filter(Boolean).join(", "),
    ],
    ["Availability", availability.join(", ")],
    ["Maximum mentees", mentor.maxMentees?.toString()],
    ["About", mentor.bio],
  ];

  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className={label === "About" ? "sm:col-span-2" : ""}>
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="break-words whitespace-pre-line">
            {value || "Not provided"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
