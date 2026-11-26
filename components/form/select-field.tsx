"use client";

import { Select, type SelectOption } from "@/components/ui/select";
import { useFieldContext } from "./form-context";
import { PopupField } from "./popup-field";

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
};

// A labelled dropdown with its error message, wired to the surrounding form field.
export function SelectField({ label, ...selectProps }: SelectFieldProps) {
  const { name } = useFieldContext<string>();

  return (
    <PopupField label={label}>
      {(control) => <Select {...control} {...selectProps} name={name} />}
    </PopupField>
  );
}
