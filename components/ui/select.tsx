"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";
import type { FocusEventHandler } from "react";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  options: readonly SelectOption[];
  // "" means nothing is chosen, unless an option has that value.
  value: string;
  onValueChange: (value: string) => void;
  // Shown while nothing is chosen.
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

// A pop-up menu following .agents/skills/apple-design: it grows out of its
// button, sits on a translucent material and ticks the current choice.
export function Select({
  options,
  value,
  onValueChange,
  placeholder,
  name,
  disabled,
  onOpenChange,
  className,
  ...triggerProps
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      items={options}
      value={value}
      onValueChange={(next) => onValueChange(next ?? "")}
      onOpenChange={onOpenChange}
      name={name}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        {...triggerProps}
        data-slot="select-trigger"
        className={cn(
          "flex h-12 min-w-0 cursor-pointer touch-manipulation items-center justify-between gap-3 rounded-xl border border-input bg-card pr-3 pl-4 text-left text-base transition-[border-color,box-shadow] duration-100 outline-none select-none [-webkit-tap-highlight-color:transparent] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-ring data-popup-open:ring-3 data-popup-open:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className={cn(
            "truncate",
            placeholder && "data-placeholder:text-muted-foreground",
          )}
        />
        <SelectPrimitive.Icon className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <path d="m8 9.5 4-4 4 4M8 14.5l4 4 4-4" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          className="z-50 outline-none"
          alignItemWithTrigger={false}
          sideOffset={6}
          collisionPadding={12}
        >
          <SelectPrimitive.Popup
            className={cn(
              "max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-2xl bg-material text-foreground shadow-float ring-1 ring-foreground/10 backdrop-blur-2xl backdrop-saturate-180 outline-none",
              // Enters and leaves along the same path; with reduced motion it only fades.
              "transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95",
              "reduce-transparency:bg-card reduce-transparency:[backdrop-filter:none]",
            )}
          >
            <SelectPrimitive.List className="max-h-[min(var(--available-height),20rem)] scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="grid min-h-11 cursor-pointer touch-manipulation grid-cols-[1.25rem_1fr] items-center gap-2 rounded-[0.625rem] py-2 pr-5 pl-2.5 text-base outline-none select-none data-highlighted:bg-primary data-highlighted:text-primary-foreground data-selected:font-semibold"
                >
                  <SelectPrimitive.ItemIndicator className="col-start-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                      aria-hidden="true"
                    >
                      <path d="M5 12.5 9.5 17 19 7" />
                    </svg>
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText className="col-start-2">
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
