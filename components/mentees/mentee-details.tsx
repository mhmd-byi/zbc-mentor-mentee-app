import { DetailsList } from "@/components/layout/details-list";
import type { MenteeRecord } from "@/lib/mentees";
import { areasText, availabilityLabels } from "@/lib/mentor-options";

// Everything a mentee told us when signing up.
export function MenteeDetails({ mentee }: { mentee: MenteeRecord }) {
  return (
    <DetailsList
      details={[
        { label: "Email", value: mentee.email },
        { label: "Phone", value: mentee.phone },
        { label: "ITS ID", value: mentee.itsId },
        { label: "City or area", value: mentee.city },
        { label: "Mohalla", value: mentee.mohalla },
        { label: "Date of birth", value: mentee.dateOfBirth },
        { label: "Education", value: mentee.education },
        { label: "Occupation", value: mentee.occupation },
        {
          label: "Interests",
          value: areasText(mentee.interests, mentee.otherInterests),
        },
        {
          label: "Availability",
          value: availabilityLabels(mentee.availability).join(", "),
        },
        { label: "Goals", value: mentee.goals, wide: true },
      ]}
    />
  );
}
