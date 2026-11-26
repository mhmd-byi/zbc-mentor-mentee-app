import Link from "next/link";

type SegmentedNavProps = {
  label: string;
  items: { href: string; label: string }[];
  // The href of the page being shown.
  current: string;
};

export function SegmentedNav({ label, items, current }: SegmentedNavProps) {
  return (
    <nav
      aria-label={label}
      className="flex gap-1 self-start rounded-2xl bg-secondary p-1"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === current ? "page" : undefined}
          className="flex h-9 items-center rounded-xl px-4 font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:bg-selected aria-[current=page]:shadow-sm"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
