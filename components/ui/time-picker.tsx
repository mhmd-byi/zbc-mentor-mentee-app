"use client";

import { useState } from "react";
import { Button } from "./button";
import { PickerPopover } from "./picker-popover";
import type { PopupControlProps } from "./popup";
import { RadioChoices } from "./radio-choices";

type Period = "am" | "pm";
type Time = { hour: number; minute: number; period: Period };

const pad = (number: number) => String(number).padStart(2, "0");

// "18:05" is 6:05 pm.
function readTime(value: string): Time {
  const [hour, minute] = value.split(":").map(Number);
  return {
    hour: hour % 12 || 12,
    minute,
    period: hour < 12 ? "am" : "pm",
  };
}

function writeTime({ hour, minute, period }: Time) {
  return `${pad((hour % 12) + (period === "pm" ? 12 : 0))}:${pad(minute)}`;
}

const PERIODS = [
  { value: "am", label: "AM" },
  { value: "pm", label: "PM" },
] as const;

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => ({
  value: hour,
  label: String(hour),
}));

// Every five minutes.
const MINUTES = Array.from({ length: 12 }, (_, index) => ({
  value: index * 5,
  label: pad(index * 5),
}));

const CELL =
  "hover:bg-muted has-checked:bg-primary has-checked:text-primary-foreground has-checked:hover:bg-primary";

type TimeChoicesProps = {
  value: string;
  onValueChange: (value: string) => void;
  onDone: () => void;
};

function TimeChoices({ value, onValueChange, onDone }: TimeChoicesProps) {
  // Holds AM or PM until an hour is chosen.
  const [draftPeriod, setDraftPeriod] = useState<Period>("pm");
  const time = value ? readTime(value) : undefined;
  const period = time?.period ?? draftPeriod;

  return (
    <div className="flex w-60 flex-col gap-2">
      <RadioChoices
        legend="Morning or afternoon"
        hideLegend
        options={PERIODS}
        selected={period}
        onSelect={(next) => {
          setDraftPeriod(next);
          if (time) onValueChange(writeTime({ ...time, period: next }));
        }}
        className="grid-cols-2 rounded-xl bg-secondary p-1"
        optionClassName="h-9 text-sm has-checked:bg-selected has-checked:shadow-sm"
      />
      <RadioChoices
        legend="Hour"
        options={HOURS}
        selected={time?.hour}
        onSelect={(hour) =>
          onValueChange(
            writeTime({ hour, minute: time?.minute ?? 0, period }),
          )
        }
        className="grid-cols-4"
        optionClassName={CELL}
      />
      <RadioChoices
        legend="Minute"
        options={MINUTES}
        selected={time?.minute}
        // Choosing minutes first starts at 12.
        onSelect={(minute) =>
          onValueChange(
            writeTime({ hour: time?.hour ?? 12, minute, period }),
          )
        }
        className="grid-cols-4"
        optionClassName={CELL}
      />
      <Button className="mt-1 w-full" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}

type TimePickerProps = PopupControlProps & {
  // 24-hour HH:MM, or "" while nothing is chosen.
  value: string;
  onValueChange: (value: string) => void;
};

export function TimePicker({
  value,
  onValueChange,
  ...popupProps
}: TimePickerProps) {
  const time = value ? readTime(value) : undefined;

  return (
    <PickerPopover
      {...popupProps}
      text={
        time ? `${time.hour}:${pad(time.minute)} ${time.period}` : ""
      }
      placeholder="Choose a time"
      title="Choose a time"
      focusSelector="input:checked"
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
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      }
    >
      {(close) => (
        <TimeChoices
          value={value}
          onValueChange={onValueChange}
          onDone={close}
        />
      )}
    </PickerPopover>
  );
}
