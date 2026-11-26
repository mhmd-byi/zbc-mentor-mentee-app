"use client";

import { useId, type ComponentProps } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "./form-context";

type TextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & { label: string; description?: string };

// A labelled input with its error message, wired to the surrounding form field.
export function TextField({ label, description, ...inputProps }: TextFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const errorId = `${id}-error`;
  const { errors } = field.state.meta;
  const invalid = errors.length > 0;

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        {...inputProps}
        id={id}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError id={errorId} errors={errors} />
    </Field>
  );
}
