"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";
import {
  popupIconClassName,
  popupPanelClassName,
  popupTriggerClassName,
  type PopupControlProps,
} from "./popup";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = PopupControlProps & {
  options: readonly SelectOption[];
  // "" means nothing is chosen, unless an option has that value.
  value: string;
  onValueChange: (value: string) => void;
  // Shown while nothing is chosen.
  placeholder?: string;
  name?: string;
  disabled?: boolean;
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
        className={cn(popupTriggerClassName, className)}
      >
        <SelectPrimitive.Value
          placeholder={placeholder}
          className={cn(
            "truncate",
            placeholder && "data-placeholder:text-muted-foreground",
          )}
        />
        <SelectPrimitive.Icon className={popupIconClassName}>
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
              popupPanelClassName,
              "max-w-(--available-width) min-w-(--anchor-width) overflow-hidden",
            )}
          >
            <SelectPrimitive.List className="max-h-[min(var(--available-height),20rem)] scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="grid min-h-11 cursor-pointer touch-manipulation grid-cols-[1.25rem_1fr] items-center gap-2 rounded-[0.625rem] py-2 pr-5 pl-2.5 text-base outline-none select-none data-disabled:cursor-default data-disabled:opacity-35 data-highlighted:bg-primary data-highlighted:text-primary-foreground data-selected:font-semibold"
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
