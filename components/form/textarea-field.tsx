"use client";

import { useId, type ComponentProps } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "./form-context";

type TextareaFieldProps = Omit<
  ComponentProps<typeof Textarea>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & { label: string; description?: string };

// A labelled multi-line input with its error message, wired to the form field.
export function TextareaField({
  label,
  description,
  ...textareaProps
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const errorId = `${id}-error`;
  const { errors } = field.state.meta;
  const invalid = errors.length > 0;

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        {...textareaProps}
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
