"use client";

import { withFieldGroup } from "@/components/form/use-app-form";
import { FieldLegend, FieldSet } from "@/components/ui/field";

// Choosing a password when signing up.
export const PasswordFields = withFieldGroup({
  defaultValues: { password: "", confirmation: "" },
  render: function PasswordFieldsRender({ group }) {
    return (
      <FieldSet>
        <FieldLegend>Your password</FieldLegend>
        <div className="grid gap-5 sm:grid-cols-2">
          <group.AppField name="password">
            {(field) => (
              <field.TextField
                label="Password"
                description="At least 8 characters."
                type="password"
                autoComplete="new-password"
              />
            )}
          </group.AppField>
          <group.AppField name="confirmation">
            {(field) => (
              <field.TextField
                label="Confirm password"
                type="password"
                autoComplete="new-password"
              />
            )}
          </group.AppField>
        </div>
      </FieldSet>
    );
  },
});
