// Initials and name of the signed-in person.
export function UserBadge({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
      >
        {initials}
      </span>
      <span className="sr-only text-sm font-medium sm:not-sr-only">{name}</span>
    </div>
  );
}
