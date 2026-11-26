import { z } from "zod";
import { MENTEE_LIMIT_OPTIONS } from "./mentor-options";
import {
  areasSchema,
  availabilitySchema,
  passwordRule,
} from "./profile-fields";
import { passwordSchema } from "./schemas";
import { userSchema } from "./user-schema";

export const maxMenteesSchema = z
  .string()
  .refine(
    (value) => MENTEE_LIMIT_OPTIONS.includes(value),
    "Choose how many mentees.",
  )
  .transform(Number);

export const rejectionReasonSchema = z
  .string()
  .trim()
  .min(1, "Give a reason, so they know what to change.")
  .max(500, "Use 500 characters or fewer.");

const detailsShape = {
  name: userSchema.shape.name,
  phone: userSchema.shape.phone,
  itsId: userSchema.shape.itsId,
  city: userSchema.shape.city,
  mohalla: userSchema.shape.mohalla,
  occupation: z
    .string()
    .trim()
    .min(1, "Enter your job title or profession.")
    .max(100, "Use 100 characters or fewer."),
  company: z.string().trim().max(100, "Use 100 characters or fewer."),
  yearsExperience: z
    .string()
    .trim()
    .regex(/^([0-9]|[1-5][0-9]|60)$/, "Enter a number of years from 0 to 60.")
    .transform(Number),
  otherExpertise: areasSchema("Add at least one area of expertise."),
  availability: availabilitySchema,
  bio: z
    .string()
    .trim()
    .min(1, "Tell us a little about yourself.")
    .max(1000, "Use 1000 characters or fewer."),
  maxMentees: maxMenteesSchema,
};

export const mentorDetailsSchema = z.object(detailsShape);

export const mentorApplicationSchema = z
  .object({
    ...detailsShape,
    email: userSchema.shape.email,
    password: passwordSchema,
    confirmation: z.string(),
  })
  .refine(passwordRule.check, passwordRule.params);

// Same fields, so one form serves both. Resubmitting ignores the account ones.
export const resubmissionFormSchema = z.object({
  ...detailsShape,
  email: z.string(),
  password: z.string(),
  confirmation: z.string(),
});

export type MentorFormValues = z.input<typeof mentorApplicationSchema>;
