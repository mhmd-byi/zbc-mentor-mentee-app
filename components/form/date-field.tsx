"use client";

import { DatePicker, type DateLimit } from "@/components/ui/date-picker";
import { PopupField } from "./popup-field";

type DateFieldProps = {
  label: string;
  description?: string;
  min?: DateLimit;
  max?: DateLimit;
};

// A labelled date picker, wired to the form field. Its value is YYYY-MM-DD.
export function DateField({ label, description, ...limits }: DateFieldProps) {
  return (
    <PopupField label={label} description={description}>
      {(control) => <DatePicker {...control} {...limits} />}
    </PopupField>
  );
}
