import type { ComponentProps } from "react";
import { Button } from "./button";

type PendingButtonProps = ComponentProps<typeof Button> & {
  pending: boolean;
  pendingLabel: string;
};

// A button that shows what is happening and can't be pressed twice.
export function PendingButton({
  pending,
  pendingLabel,
  children,
  ...props
}: PendingButtonProps) {
  return (
    <Button {...props} disabled={pending}>
      {pending ? (
        <>
          <span
            aria-hidden
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:hidden"
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
