"use client";

import { Calendar, parseIsoDate, type DateLimit } from "./calendar";
import { PickerPopover } from "./picker-popover";
import type { PopupControlProps } from "./popup";

export type { DateLimit };

type DatePickerProps = PopupControlProps & {
  // YYYY-MM-DD, or "" while nothing is chosen.
  value: string;
  onValueChange: (value: string) => void;
  min?: DateLimit;
  max?: DateLimit;
};

export function DatePicker({
  value,
  onValueChange,
  min,
  max,
  ...popupProps
}: DatePickerProps) {
  return (
    <PickerPopover
      {...popupProps}
      text={
        value
          ? parseIsoDate(value).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : ""
      }
      placeholder="Choose a date"
      title="Choose a date"
      // The calendar keeps one day reachable with Tab: the chosen one, or today.
      focusSelector='[role="grid"] button[tabindex="0"]'
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      }
    >
      {(close) => (
        <Calendar
          value={value}
          onSelect={(date) => {
            onValueChange(date);
            close();
          }}
          min={min}
          max={max}
        />
      )}
    </PickerPopover>
  );
}
