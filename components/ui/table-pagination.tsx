import { Button } from "./button";

type TablePaginationProps = {
  count: number;
  // Singular and plural, such as ["person", "people"].
  noun: [string, string];
  pageIndex: number;
  pageCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function TablePagination({
  count,
  noun: [singular, plural],
  pageIndex,
  pageCount,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {count} {count === 1 ? singular : plural}
        {pageCount > 1 && `, page ${pageIndex + 1} of ${pageCount}`}
      </p>
      {pageCount > 1 && (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={!hasPrevious}
            onClick={onPrevious}
          >
            Previous
          </Button>
          <Button variant="secondary" disabled={!hasNext} onClick={onNext}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
