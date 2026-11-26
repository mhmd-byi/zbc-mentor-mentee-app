import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

// Translucent bar that content scrolls under. Pass its actions as children.
export function AppHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-material backdrop-blur-xl backdrop-saturate-180 reduce-transparency:bg-card reduce-transparency:[backdrop-filter:none]">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Logo height={44} />
          <span className="hidden font-semibold tracking-[-0.01em] sm:block">
            ZBC Mentorship
          </span>
        </div>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
