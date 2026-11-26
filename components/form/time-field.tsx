"use client";

import { TimePicker } from "@/components/ui/time-picker";
import { PopupField } from "./popup-field";

// A labelled time picker, wired to the form field. Its value is 24-hour HH:MM.
export function TimeField({ label }: { label: string }) {
  return (
    <PopupField label={label}>
      {(control) => <TimePicker {...control} />}
    </PopupField>
  );
}
