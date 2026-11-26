"use client";

import { useId } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, type SelectOption } from "@/components/ui/select";
import { useFieldContext } from "./form-context";

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: SelectOption[];
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
      <Select
        id={id}
        name={field.name}
        className="w-full"
        placeholder={placeholder}
        options={options}
        disabled={disabled}
        value={field.state.value}
        onValueChange={field.handleChange}
        // The field is left when its menu closes, or on tabbing past it. Focus
        // moving into an open menu doesn't count.
        onOpenChange={(open) => {
          if (!open) field.handleBlur();
        }}
        onBlur={(event) => {
          if (event.currentTarget.getAttribute("aria-expanded") !== "true") {
            field.handleBlur();
          }
        }}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
      />
      <FieldError id={errorId} errors={errors} />
    </Field>
  );
}
