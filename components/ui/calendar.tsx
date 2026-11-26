"use client";

import type { ChangeEvent } from "react";
import {
  DayPicker,
  type ChevronProps,
  type DropdownProps,
  type Matcher,
} from "react-day-picker";
import { todayInIndia } from "@/lib/format";
import { Select } from "./select";

// Dates are passed around as YYYY-MM-DD. These read and write them as calendar
// days, without time zones shifting them.
export function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// The month and year menus use the app's own dropdown.
function CalendarDropdown({
  options = [],
  value,
  onChange,
  disabled,
  "aria-label": label,
}: DropdownProps) {
  return (
    <Select
      aria-label={label}
      className="h-9 gap-1.5 rounded-lg border-transparent bg-secondary pr-1.5 pl-2.5 text-sm font-semibold"
      disabled={disabled}
      options={options.map((option) => ({
        ...option,
        value: String(option.value),
      }))}
      value={String(value)}
      // The calendar only reads the new value from the event.
      onValueChange={(next) =>
        onChange?.({
          target: { value: next },
        } as ChangeEvent<HTMLSelectElement>)
      }
    />
  );
}

const CHEVRON_PATHS = {
  left: "m14.5 6-6 6 6 6",
  right: "m9.5 6 6 6-6 6",
  up: "m6 14.5 6-6 6 6",
  down: "m6 9.5 6 6 6-6",
};

function CalendarChevron({ orientation = "right" }: ChevronProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d={CHEVRON_PATHS[orientation]} />
    </svg>
  );
}

const NAV_BUTTON =
  "grid size-9 cursor-pointer touch-manipulation place-items-center rounded-full text-primary outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-30 motion-safe:active:scale-[0.94]";

const CLASS_NAMES = {
  root: "w-fit",
  month: "grid grid-cols-[1fr_auto] items-center gap-y-2",
  month_caption: "flex items-center",
  dropdowns: "flex items-center gap-1",
  nav: "flex",
  button_previous: NAV_BUTTON,
  button_next: NAV_BUTTON,
  month_grid: "col-span-2 border-collapse",
  weekday:
    "size-10 pb-1 text-xs font-semibold text-muted-foreground uppercase",
  day: "p-0 text-center [&[data-today]:not([data-selected])>button]:font-semibold [&[data-today]:not([data-selected])>button]:text-primary data-disabled:[&>button]:pointer-events-none data-disabled:[&>button]:opacity-30 data-selected:[&>button]:bg-primary data-selected:[&>button]:font-semibold data-selected:[&>button]:text-primary-foreground",
  day_button:
    "grid size-10 cursor-pointer touch-manipulation place-items-center rounded-full text-base tabular-nums transition-[scale,background-color] duration-100 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:scale-[0.94]",
};

// A limit that depends on today's date can be a function, so that the date is
// only read once the calendar is on screen.
export type DateLimit = string | (() => string);

const readLimit = (limit?: DateLimit) => {
  const value = typeof limit === "function" ? limit() : limit;
  return value ? parseIsoDate(value) : undefined;
};

type CalendarProps = {
  // YYYY-MM-DD, or "" while nothing is chosen.
  value: string;
  onSelect: (value: string) => void;
  // The first and last days that can be picked.
  min?: DateLimit;
  max?: DateLimit;
};

export function Calendar({ value, onSelect, min, max }: CalendarProps) {
  const today = parseIsoDate(todayInIndia());
  const year = today.getFullYear();
  const first = readLimit(min);
  const last = readLimit(max);
  // How far the month and year menus reach.
  const start = first ?? new Date(year - 10, 0);
  const end = last ?? new Date(year + 2, 11);
  const selected = value ? parseIsoDate(value) : undefined;

  const unavailable: Matcher[] = [];
  if (first) unavailable.push({ before: first });
  if (last) unavailable.push({ after: last });

  return (
    <DayPicker
      mode="single"
      // Pressing the chosen day again keeps it chosen.
      required
      selected={selected}
      onSelect={(date) => onSelect(toIsoDate(date))}
      // Opens on the chosen month, or else the nearest one to today in range.
      defaultMonth={
        selected ?? (today < start ? start : today > end ? end : today)
      }
      today={today}
      startMonth={start}
      endMonth={end}
      disabled={unavailable}
      captionLayout="dropdown"
      reverseYears
      navLayout="after"
      formatters={{
        formatMonthDropdown: (month) =>
          month.toLocaleDateString("en-GB", { month: "short" }),
      }}
      classNames={CLASS_NAMES}
      components={{ Dropdown: CalendarDropdown, Chevron: CalendarChevron }}
    />
  );
}
