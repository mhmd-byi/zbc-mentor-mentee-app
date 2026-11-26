// Use on the server, so the server and browser can't disagree about a date.
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

export function formatDate(date?: Date) {
  return date ? DATE_FORMAT.format(date) : "";
}
