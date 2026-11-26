"use client";

import { cn } from "cn";
import { useId } from "react";

type RadioChoicesProps<Value extends string | number> = {
  legend: string;
  // Keeps the heading for screen readers only.
  hideLegend?: boolean;
  options: readonly { value: Value; label: string }[];
  selected: Value | undefined;
  onSelect: (value: Value) => void;
  // Layout of the group, and the look of each choice.
  className: string;
  optionClassName: string;
};

// One choice from a few, laid out as tappable cells. They are real radio
// buttons underneath, so arrow keys move between them.
export function RadioChoices<Value extends string | number>({
  legend,
  hideLegend,
  options,
  selected,
  onSelect,
  className,
  optionClassName,
}: RadioChoicesProps<Value>) {
  const name = useId();

  return (
    <fieldset>
      <legend
        className={
          hideLegend
            ? "sr-only"
            : "mb-1 px-1 text-xs font-semibold text-muted-foreground uppercase"
        }
      >
        {legend}
      </legend>
      <div className={cn("grid gap-1", className)}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "grid h-10 cursor-pointer touch-manipulation place-items-center rounded-lg text-base tabular-nums transition-[scale,background-color] duration-100 select-none has-checked:font-semibold has-focus-visible:ring-3 has-focus-visible:ring-ring/50 motion-safe:active:scale-[0.96]",
              optionClassName,
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              checked={selected === option.value}
              onChange={() => onSelect(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
