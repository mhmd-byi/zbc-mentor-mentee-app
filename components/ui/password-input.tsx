"use client";

import { cn } from "cn";
import { useLayoutEffect, useState, type ComponentProps } from "react";
import { Input } from "./input";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  // For passwords meant to be read, such as a temporary one an admin passes on.
  defaultVisible?: boolean;
};

// A password input with an eye button that shows or hides what was typed.
export function PasswordInput({
  className,
  defaultVisible = false,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(defaultVisible);

  // Next keeps visited pages mounted but hidden, so don't stay revealed.
  useLayoutEffect(() => () => setVisible(defaultVisible), [defaultVisible]);

  return (
    <div className="relative">
      <Input
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        {...props}
        type={visible ? "text" : "password"}
        // Edge adds its own eye button, which would sit beside ours.
        className={cn("pr-12 [&::-ms-reveal]:hidden", className)}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        // Keeps focus in the input, so tapping the eye doesn't trigger its checks.
        onPointerDown={(event) => event.preventDefault()}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 grid w-12 cursor-pointer touch-manipulation place-items-center rounded-xl text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:scale-[0.94]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
          {/* The slash means "press to hide". */}
          {visible && <path d="m4 4 16 16" />}
        </svg>
      </button>
    </div>
  );
}
