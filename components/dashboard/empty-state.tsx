import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7"
          >
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
          </svg>
        </span>
        <h2 className="text-lg font-semibold tracking-[-0.01em]">{title}</h2>
        <p className="max-w-sm text-pretty text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
