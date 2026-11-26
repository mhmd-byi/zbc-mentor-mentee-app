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

// "Accounting,  Digital  marketing" becomes ["Accounting", "Digital marketing"].
function splitAreas(text: string) {
  return text
    .split(",")
    .map((area) => area.trim().replace(/\s+/g, " "))
    .filter(Boolean);
}

// The mentor's areas that the mentee typed too, ignoring capitals.
export function sharedAreas(expertise: string, interests: string) {
  const wanted = new Set(
    splitAreas(interests).map((area) => area.toLowerCase()),
  );
  // delete() succeeds only once, so a repeated area isn't listed twice.
  return splitAreas(expertise).filter((area) =>
    wanted.delete(area.toLowerCase()),
  );
}
