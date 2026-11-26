"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { startTransition, useActionState, useLayoutEffect } from "react";
import type { ZodType } from "zod";
import { applyAsMentor, resubmitApplication } from "@/app/actions/mentors";
import { useAppForm } from "@/components/form/use-app-form";
import { PasswordFields } from "@/components/signup/password-fields";
import { PersonalFields } from "@/components/signup/personal-fields";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { FormMessage } from "@/components/ui/form-message";
import { PendingButton } from "@/components/ui/pending-button";
import {
  AVAILABILITY_OPTIONS,
  EXPERTISE_AREAS,
  MENTEE_LIMIT_OPTIONS,
} from "@/lib/mentor-options";
import {
  mentorApplicationSchema,
  resubmissionFormSchema,
  type MentorFormValues,
} from "@/lib/mentor-schema";
import type { MentorRecord } from "@/lib/mentors";

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));

const EXPERTISE_OPTIONS = toOptions(EXPERTISE_AREAS);
const LIMIT_OPTIONS = toOptions(MENTEE_LIMIT_OPTIONS);

// Pass `mentor` to correct and resend a rejected application.
export function MentorApplicationForm({ mentor }: { mentor?: MentorRecord }) {
  const [state, submit, isPending] = useActionState(
    mentor ? resubmitApplication : applyAsMentor,
    {},
  );
  const defaultValues: MentorFormValues = {
    name: mentor?.name ?? "",
    email: mentor?.email ?? "",
    phone: mentor?.phone ?? "",
    itsId: mentor?.itsId ?? "",
    city: mentor?.city ?? "",
    mohalla: mentor?.mohalla ?? "",
    occupation: mentor?.occupation ?? "",
    company: mentor?.company ?? "",
    yearsExperience: mentor?.yearsExperience?.toString() ?? "",
    expertise: mentor?.expertise ?? [],
    otherExpertise: mentor?.otherExpertise ?? "",
    availability: mentor?.availability ?? [],
    bio: mentor?.bio ?? "",
    maxMentees: mentor?.maxMentees?.toString() ?? "",
    password: "",
    confirmation: "",
  };
  // One type for both, since the form holds the same fields either way.
  const schema: ZodType<unknown, MentorFormValues> = mentor
    ? resubmissionFormSchema
    : mentorApplicationSchema;
  const form = useAppForm({
    defaultValues,
    // A long form: check on submit, then as the person fixes things.
    validationLogic: revalidateLogic(),
    validators: { onDynamic: schema },
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
          // The email can't be changed when resubmitting.
          showEmail={!mentor}
        />

        <FieldSet>
          <FieldLegend>Your work</FieldLegend>
          <div className="grid gap-5 sm:grid-cols-2">
            <form.AppField name="occupation">
              {(field) => <field.TextField label="Job title or profession" />}
            </form.AppField>
            <form.AppField name="company">
              {(field) => (
                <field.TextField label="Company or business (optional)" />
              )}
            </form.AppField>
            <form.AppField name="yearsExperience">
              {(field) => (
                <field.TextField
                  label="Years of experience"
                  inputMode="numeric"
                  maxLength={2}
                />
              )}
            </form.AppField>
          </div>
          {EXPERTISE_OPTIONS.length > 0 && (
            <form.AppField name="expertise">
              {(field) => (
                <field.CheckboxGroupField
                  label="Areas of expertise"
                  options={EXPERTISE_OPTIONS}
                />
              )}
            </form.AppField>
          )}
          <form.AppField name="otherExpertise">
            {(field) => (
              <field.TextField
                label={
                  EXPERTISE_OPTIONS.length
                    ? "Other areas (optional)"
                    : "Areas of expertise"
                }
                description="Separate areas with commas."
              />
            )}
          </form.AppField>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Mentoring</FieldLegend>
          <form.AppField name="availability">
            {(field) => (
              <field.CheckboxGroupField
                label="When can you usually meet?"
                options={AVAILABILITY_OPTIONS}
              />
            )}
          </form.AppField>
          <form.AppField name="maxMentees">
            {(field) => (
              <field.SelectField
                label="How many mentees can you take?"
                placeholder="Choose a number"
                options={LIMIT_OPTIONS}
              />
            )}
          </form.AppField>
          <form.AppField name="bio">
            {(field) => (
              <field.TextareaField
                label="About you and why you want to mentor"
                maxLength={1000}
              />
            )}
          </form.AppField>
        </FieldSet>

        {!mentor && (
          <PasswordFields
            form={form}
            fields={{ password: "password", confirmation: "confirmation" }}
          />
        )}

        {!isPending && <FormMessage {...state} />}
        <PendingButton
          type="submit"
          size="lg"
          className="w-full"
          pending={isPending}
          pendingLabel="Sending…"
        >
          {mentor ? "Send again" : "Send application"}
        </PendingButton>
      </form.Form>
    </form.AppForm>
  );
}
