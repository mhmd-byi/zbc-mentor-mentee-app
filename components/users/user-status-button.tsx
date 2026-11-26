"use client";

import { startTransition, useActionState } from "react";
import { setUserStatus } from "@/app/actions/users";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import type { UserStatus } from "@/lib/db";

type UserStatusButtonProps = {
  userId: string;
  status: UserStatus;
};

// No confirmation step: deactivating is undone with the same button.
export function UserStatusButton({ userId, status }: UserStatusButtonProps) {
  const [state, submit, isPending] = useActionState(
    setUserStatus.bind(null, userId),
    {},
  );
  const isActive = status === "active";

  return (
    <div className="flex flex-col items-start gap-3">
      {!isPending && <FormMessage {...state} />}
      <PendingButton
        variant={isActive ? "destructive" : "default"}
        pending={isPending}
        pendingLabel="Saving…"
        onClick={() =>
          startTransition(() => submit(isActive ? "deactivated" : "active"))
        }
      >
        {isActive ? "Deactivate account" : "Reactivate account"}
      </PendingButton>
    </div>
  );
}
