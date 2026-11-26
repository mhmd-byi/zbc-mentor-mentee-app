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
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>{children}</FieldGroup>
    </form>
  );
}
