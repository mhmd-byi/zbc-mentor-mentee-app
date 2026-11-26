// Add the areas here. Mentors pick them as expertise, and mentees as interests.
export const EXPERTISE_AREAS: readonly string[] = [];

export const AVAILABILITY_OPTIONS = [
  { value: "weekday-daytime", label: "Weekday daytime" },
  { value: "weekday-evening", label: "Weekday evenings" },
  { value: "weekend", label: "Weekends" },
];

// How many mentees a mentor can be set to take: 1 to 10.
export const MENTEE_LIMIT_OPTIONS = Array.from({ length: 10 }, (_, index) =>
  String(index + 1),
);

export function availabilityLabels(values: string[]) {
  return AVAILABILITY_OPTIONS.filter((option) =>
    values.includes(option.value),
  ).map((option) => option.label);
}

// Chosen areas and typed ones, as a single line.
export function areasText(areas: string[], other: string) {
  return [...areas, other].filter(Boolean).join(", ");
}
