"use client";

import { withFieldGroup } from "@/components/form/use-app-form";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { MOHALLAS } from "@/lib/mohallas";

const MOHALLA_OPTIONS = MOHALLAS.map((name) => ({ value: name, label: name }));

// The "About you" fields that every sign-up form starts with.
export const PersonalFields = withFieldGroup({
  defaultValues: {
    name: "",
    email: "",
    phone: "",
    itsId: "",
    city: "",
    mohalla: "",
  },
  props: { showEmail: true as boolean },
  render: function PersonalFieldsRender({ group, showEmail }) {
    return (
      <FieldSet>
        <FieldLegend>About you</FieldLegend>
        <div className="grid gap-5 sm:grid-cols-2">
          <group.AppField name="name">
            {(field) => (
              <field.TextField label="Full name" autoComplete="name" />
            )}
          </group.AppField>
          {showEmail && (
            <group.AppField name="email">
              {(field) => (
                <field.TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                />
              )}
            </group.AppField>
          )}
          <group.AppField name="phone">
            {(field) => (
              <field.TextField label="Phone" type="tel" autoComplete="tel" />
            )}
          </group.AppField>
          <group.AppField name="itsId">
            {(field) => (
              <field.TextField
                label="ITS ID"
                inputMode="numeric"
                maxLength={8}
              />
            )}
          </group.AppField>
          <group.AppField name="city">
            {(field) => <field.TextField label="City or area (optional)" />}
          </group.AppField>
          <group.AppField name="mohalla">
            {(field) => (
              <field.SelectField
                label="Mohalla (optional)"
                placeholder={
                  MOHALLA_OPTIONS.length ? "Choose a mohalla" : "No options yet"
                }
                options={MOHALLA_OPTIONS}
                disabled={MOHALLA_OPTIONS.length === 0}
              />
            )}
          </group.AppField>
        </div>
      </FieldSet>
    );
  },
});
