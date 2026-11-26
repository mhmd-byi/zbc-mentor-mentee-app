"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState, useLayoutEffect } from "react";
import { joinAsMentee } from "@/app/actions/mentees";
import { useAppForm } from "@/components/form/use-app-form";
import { PasswordFields } from "@/components/signup/password-fields";
import { PersonalFields } from "@/components/signup/personal-fields";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import { menteeSignupSchema, type MenteeFormValues } from "@/lib/mentee-schema";
import { AVAILABILITY_OPTIONS } from "@/lib/mentor-options";

const DEFAULT_VALUES: MenteeFormValues = {
  name: "",
  email: "",
  phone: "",
  itsId: "",
  city: "",
  mohalla: "",
  dateOfBirth: "",
  education: "",
  occupation: "",
  otherInterests: "",
  goals: "",
  availability: [],
  password: "",
  confirmation: "",
};

export function MenteeSignupForm() {
  const [state, submit, isPending] = useActionState(joinAsMentee, {});
  const form = useAppForm({
    defaultValues: DEFAULT_VALUES,
    // A long form: check on submit, then as the person fixes things.
    validationLogic: revalidateLogic(),
    validators: { onDynamic: menteeSignupSchema },
    onSubmit: ({ value }) => startTransition(() => submit(value)),
  });

  // Next keeps visited pages mounted but hidden: keep the draft, drop the passwords.
  useLayoutEffect(
    () => () => {
      form.resetField("password");
      form.resetField("confirmation");
    },
    [form],
  );

  return (
    <form.AppForm>
      <form.Form>
        <PersonalFields
          form={form}
          fields={{
            name: "name",
            email: "email",
            phone: "phone",
            itsId: "itsId",
            city: "city",
            mohalla: "mohalla",
          }}
          showEmail
        />

        <FieldSet>
          <FieldLegend>Study and work</FieldLegend>
          <div className="grid gap-5 sm:grid-cols-2">
            <form.AppField name="dateOfBirth">
              {(field) => (
                <field.TextField
                  label="Date of birth"
                  description="Mentees must be 18 or older."
                  type="date"
                  autoComplete="bday"
                />
              )}
            </form.AppField>
            <form.AppField name="education">
              {(field) => (
                <field.TextField
                  label="Education"
                  description="Qualification and field of study."
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="occupation">
            {(field) => (
              <field.TextField
                label="Occupation"
                description="Your job or business, or that you're a student."
              />
            )}
          </form.AppField>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Mentoring</FieldLegend>
          <form.AppField name="otherInterests">
            {(field) => (
              <field.TextField
                label="Areas of interest"
                description="Separate areas with commas, such as Accounting, Marketing."
                maxLength={200}
              />
            )}
          </form.AppField>
          <form.AppField name="goals">
            {(field) => (
              <field.TextareaField
                label="What do you hope to get from mentoring?"
                maxLength={1000}
              />
            )}
          </form.AppField>
          <form.AppField name="availability">
            {(field) => (
              <field.CheckboxGroupField
                label="When can you usually meet?"
                options={AVAILABILITY_OPTIONS}
              />
            )}
          </form.AppField>
        </FieldSet>

        <PasswordFields
          form={form}
          fields={{ password: "password", confirmation: "confirmation" }}
        />

        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          size="lg"
          className="w-full"
          pending={isPending}
          pendingLabel="Joining…"
        >
          Join as a mentee
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
