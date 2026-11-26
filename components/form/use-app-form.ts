import { createFormHook } from "@tanstack/react-form";
import { CheckboxGroupField } from "./checkbox-group-field";
import { Form } from "./form";
import { fieldContext, formContext } from "./form-context";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";

// Use this for every form. Register new field types here.
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxGroupField,
    SelectField,
    TextField,
    TextareaField,
  },
  formComponents: { Form },
});
