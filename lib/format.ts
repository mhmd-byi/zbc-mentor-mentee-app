// Use on the server, so the server and browser can't disagree about a date.
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

export function formatDate(date?: Date) {
  return date ? DATE_FORMAT.format(date) : "";
}

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

export function formatDateTime(date: Date) {
  return `${DATE_TIME_FORMAT.format(date)} IST`;
}

// Today's date in India as YYYY-MM-DD, the form date inputs use.
export function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date(),
  );
}
