// What the dropdown, date and time controls share, so they look and behave alike.
import type { FocusEventHandler } from "react";

// The props a form field passes to any control that opens a pop-up.
export type PopupControlProps = {
  id?: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

// The button that opens the pop-up, styled like a text input.
export const popupTriggerClassName =
  "flex h-12 min-w-0 cursor-pointer touch-manipulation items-center justify-between gap-3 rounded-xl border border-input bg-card pr-3 pl-4 text-left text-base transition-[border-color,box-shadow] duration-100 outline-none select-none [-webkit-tap-highlight-color:transparent] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-ring data-popup-open:ring-3 data-popup-open:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

// The tinted square holding the trigger's icon.
export const popupIconClassName =
  "grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary";

// The frosted panel. It leaves the way it came; with reduced motion it only fades.
export const popupPanelClassName =
  "origin-(--transform-origin) rounded-2xl bg-material text-foreground shadow-float ring-1 ring-foreground/10 backdrop-blur-2xl backdrop-saturate-180 outline-none transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95 reduce-transparency:bg-card reduce-transparency:[backdrop-filter:none]";
