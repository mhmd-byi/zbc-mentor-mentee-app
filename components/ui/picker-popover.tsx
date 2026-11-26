"use client";

import { Popover } from "@base-ui/react/popover";
import { cn } from "cn";
import { useId, useRef, useState, type ReactNode } from "react";
import {
  popupIconClassName,
  popupPanelClassName,
  popupTriggerClassName,
  type PopupControlProps,
} from "./popup";

type PickerPopoverProps = PopupControlProps & {
  // The chosen value as shown, or "" while nothing is chosen.
  text: string;
  placeholder: string;
  icon: ReactNode;
  // Names the pop-up for screen readers.
  title: string;
  // What to focus when it opens.
  focusSelector: string;
  // The panel's contents, which mount only while it is open.
  children: (close: () => void) => ReactNode;
};

// A button showing a value, which opens a panel for choosing it.
export function PickerPopover({
  text,
  placeholder,
  icon,
  title,
  focusSelector,
  children,
  onOpenChange,
  className,
  "aria-describedby": describedBy,
  ...triggerProps
}: PickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const textId = useId();

  function change(next: boolean) {
    setOpen(next);
    onOpenChange?.(next);
  }

  return (
    <Popover.Root open={open} onOpenChange={change}>
      <Popover.Trigger
        {...triggerProps}
        // The label names the button, so the value is read as its description.
        aria-describedby={[textId, describedBy].filter(Boolean).join(" ")}
        className={cn(popupTriggerClassName, className)}
      >
        <span
          id={textId}
          className={cn("truncate", !text && "text-muted-foreground")}
        >
          {text || placeholder}
        </span>
        <span aria-hidden className={popupIconClassName}>
          {icon}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          className="z-50 outline-none"
          align="start"
          sideOffset={6}
          collisionPadding={12}
        >
          <Popover.Popup
            ref={panel}
            aria-label={title}
            // On touch the panel itself takes focus, so nothing looks pre-pressed.
            initialFocus={(openType) =>
              openType === "touch"
                ? true
                : (panel.current?.querySelector<HTMLElement>(focusSelector) ??
                  true)
            }
            className={cn(
              popupPanelClassName,
              "max-h-(--available-height) overflow-y-auto p-2",
            )}
          >
            {children(() => change(false))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
