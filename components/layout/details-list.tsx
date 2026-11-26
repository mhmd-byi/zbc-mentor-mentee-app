import type { ReactNode } from "react";

export type Detail = {
  label: string;
  value?: ReactNode;
  // Takes the full width, for longer text.
  wide?: boolean;
};

// Labelled facts about someone, read-only.
export function DetailsList({ details }: { details: Detail[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {details.map(({ label, value, wide }) => (
        <div key={label} className={wide ? "sm:col-span-2" : undefined}>
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="break-words whitespace-pre-line">
            {value || "Not provided"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
