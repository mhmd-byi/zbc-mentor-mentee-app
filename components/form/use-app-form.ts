import { createFormHook } from "@tanstack/react-form";
import { Form } from "./form";
import { fieldContext, formContext } from "./form-context";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";

// Use this for every form. Register new field types here.
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { SelectField, TextField },
  formComponents: { Form },
});
