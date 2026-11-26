import Link from "next/link";
import type { ReactNode } from "react";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="-mb-2 flex h-11 items-center gap-1 self-start rounded-lg font-medium text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      {children}
    </Link>
  );
}
