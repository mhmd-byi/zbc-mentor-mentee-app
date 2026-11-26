"use client";

import { useId, type ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import type { PopupControlProps } from "@/components/ui/popup";
import { useFieldContext } from "./form-context";

type PopupFieldControl = PopupControlProps & {
  value: string;
  onValueChange: (value: string) => void;
};

type PopupFieldProps = {
  label: string;
  description?: string;
  children: (control: PopupFieldControl) => ReactNode;
};

// The label, error and wiring shared by fields whose control opens a pop-up.
export function PopupField({ label, description, children }: PopupFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const errorId = `${id}-error`;
  const { errors } = field.state.meta;
  const invalid = errors.length > 0;

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children({
        id,
        className: "w-full",
        value: field.state.value,
        onValueChange: field.handleChange,
        // The field is left when its pop-up closes, or on tabbing past it.
        // Focus moving into an open pop-up doesn't count.
        onOpenChange: (open) => {
          if (!open) field.handleBlur();
        },
        onBlur: (event) => {
          if (event.currentTarget.getAttribute("aria-expanded") !== "true") {
            field.handleBlur();
          }
        },
        "aria-invalid": invalid || undefined,
        "aria-describedby": invalid ? errorId : undefined,
      })}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError id={errorId} errors={errors} />
    </Field>
  );
}
