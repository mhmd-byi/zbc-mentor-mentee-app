"use client";

import { useId } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useFieldContext } from "./form-context";

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
};

// A labelled dropdown with its error message, wired to the surrounding form field.
export function SelectField({
  label,
  placeholder,
  options,
  disabled,
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const errorId = `${id}-error`;
  const { errors } = field.state.meta;
  const invalid = errors.length > 0;

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <NativeSelect
        id={id}
        name={field.name}
        className="w-full"
        disabled={disabled}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
      >
        <NativeSelectOption value="">{placeholder}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <FieldError id={errorId} errors={errors} />
    </Field>
  );
}
