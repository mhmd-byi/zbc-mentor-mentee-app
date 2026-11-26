"use client";

import { useTransition } from "react";
import { logout } from "@/app/actions/auth";
import { PendingButton } from "@/components/ui/pending-button";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <PendingButton
      variant="secondary"
      pending={isPending}
      pendingLabel="Signing out…"
      onClick={() =>
        startTransition(async () => {
          await logout();
          // A full page load drops everything the previous user had in memory.
          window.location.replace("/login");
        })
      }
    >
      Sign out
    </PendingButton>
  );
}
