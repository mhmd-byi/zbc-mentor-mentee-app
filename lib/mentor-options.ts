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
