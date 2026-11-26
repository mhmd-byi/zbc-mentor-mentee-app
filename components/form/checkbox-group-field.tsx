"use client";

import { useId } from "react";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { useFieldContext } from "./form-context";

type CheckboxGroupFieldProps = {
  label: string;
  options: { value: string; label: string }[];
};

// Several choices shown as tappable pills. The field's value is the chosen list.
export function CheckboxGroupField({
  label,
  options,
}: CheckboxGroupFieldProps) {
  const field = useFieldContext<string[]>();
  const errorId = `${useId()}-error`;
  const { errors } = field.state.meta;
  const invalid = errors.length > 0;
  const selected = field.state.value;

  return (
    <FieldSet
      className="gap-2"
      aria-describedby={invalid ? errorId : undefined}
    >
      <FieldLegend variant="label">{label}</FieldLegend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-input bg-card px-4 text-sm font-medium has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            <input
              type="checkbox"
              className="size-4 accent-primary"
              name={field.name}
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={(event) =>
                field.handleChange(
                  event.target.checked
                    ? [...selected, option.value]
                    : selected.filter((value) => value !== option.value),
                )
              }
              onBlur={field.handleBlur}
              aria-invalid={invalid || undefined}
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldError id={errorId} errors={errors} />
    </FieldSet>
  );
}
