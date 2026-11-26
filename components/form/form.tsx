"use client";

import type { ReactNode } from "react";
import { FieldGroup } from "@/components/ui/field";
import { useFormContext } from "./form-context";

export function Form({ children }: { children: ReactNode }) {
  const form = useFormContext();

  return (
    // method="post" keeps values such as passwords out of the URL if submitted before hydration.
    <form
      method="post"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        const element = event.currentTarget;
        await form.handleSubmit();
        // Once any errors have rendered, take the person to the first one.
        requestAnimationFrame(() =>
          element.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        );
      }}
    >
      <FieldGroup>{children}</FieldGroup>
    </form>
  );
}
