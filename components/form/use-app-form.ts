import { createFormHook } from "@tanstack/react-form";
import { CheckboxGroupField } from "./checkbox-group-field";
import { DateField } from "./date-field";
import { Form } from "./form";
import { fieldContext, formContext } from "./form-context";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { TimeField } from "./time-field";

// Use this for every form. Register new field types here.
// withFieldGroup makes a set of fields that several forms can share.
export const { useAppForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    CheckboxGroupField,
    DateField,
    SelectField,
    TextField,
    TextareaField,
    TimeField,
  },
  formComponents: { Form },
});
