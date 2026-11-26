"use client";

import { useId, type ComponentProps } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useFieldContext } from "./form-context";

type TextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & {
  label: string;
  description?: string;
  // Password fields only: start with the password readable.
  defaultVisible?: boolean;
};

// A labelled input with its error message, wired to the surrounding form field.
// type="password" gets a show/hide button.
export function TextField({
  label,
  description,
  type,
  defaultVisible,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const id = useId();
  const errorId = `${id}-error`;
  const { errors } = field.state.meta;
  const invalid = errors.length > 0;

  const controlProps = {
    ...inputProps,
    id,
    name: field.name,
    value: field.state.value,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      field.handleChange(event.target.value),
    onBlur: field.handleBlur,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? errorId : undefined,
  };

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {type === "password" ? (
        <PasswordInput {...controlProps} defaultVisible={defaultVisible} />
      ) : (
        <Input {...controlProps} type={type} />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError id={errorId} errors={errors} />
    </Field>
  );
}
