"use client";

import { cn } from "cn";
import { useId } from "react";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { useFieldContext } from "./form-context";

type CheckboxGroupFieldProps = {
  label: string;
  options: { value: string; label: string }[];
};

// Several choices as a grouped list with round ticks, following
// .agents/skills/apple-design. The field's value is the chosen list.
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
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-input bg-card",
          invalid && "border-destructive ring-3 ring-destructive/20",
        )}
      >
        {options.map((option) => (
          // The whole row is the target, and it responds as soon as it's pressed.
          <label
            key={option.value}
            className="group relative flex cursor-pointer touch-manipulation items-center gap-3 pl-4 transition-colors duration-100 select-none [-webkit-tap-highlight-color:transparent] hover:bg-muted active:bg-secondary"
          >
            {/* Hidden but real, so keyboards and screen readers work as usual. */}
            <input
              type="checkbox"
              className="peer sr-only"
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
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-muted-foreground/70 text-primary-foreground transition-[background-color,border-color] duration-150 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5 opacity-0 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-safe:scale-50"
              >
                <path d="M5 12.5 9.5 17 19 7" />
              </svg>
            </span>
            {/* The divider starts at the text, leaving the ticks unbroken. */}
            <span className="flex min-h-12 flex-1 items-center border-t py-2 pr-4 text-base group-first-of-type:border-t-0">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={errorId} errors={errors} />
    </FieldSet>
  );
}
