import { DetailsList } from "@/components/layout/details-list";
import { areasText, availabilityLabels } from "@/lib/mentor-options";
import type { MentorRecord } from "@/lib/mentors";

// Everything on a mentor's application.
export function MentorDetails({ mentor }: { mentor: MentorRecord }) {
  return (
    <DetailsList
      details={[
        { label: "Email", value: mentor.email },
        { label: "Phone", value: mentor.phone },
        { label: "ITS ID", value: mentor.itsId },
        { label: "City or area", value: mentor.city },
        { label: "Mohalla", value: mentor.mohalla },
        { label: "Occupation", value: mentor.occupation },
        { label: "Company or business", value: mentor.company },
        {
          label: "Years of experience",
          value: mentor.yearsExperience?.toString(),
        },
        {
          label: "Expertise",
          value: areasText(mentor.expertise, mentor.otherExpertise),
        },
        {
          label: "Availability",
          value: availabilityLabels(mentor.availability).join(", "),
        },
        { label: "Maximum mentees", value: mentor.maxMentees?.toString() },
        { label: "About", value: mentor.bio, wide: true },
      ]}
    />
  );
}
