import { z } from "zod";
import {
  areaRule,
  areasSchema,
  availabilitySchema,
  passwordRule,
} from "./profile-fields";
import { passwordSchema } from "./schemas";
import { userSchema } from "./user-schema";

const ADULT_AGE = 18;

// The latest birth date that makes someone an adult today, going by India's date.
function latestAdultBirthDate() {
  const [year, month, day] = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  })
    .format(new Date())
    .split("-");
  return `${Number(year) - ADULT_AGE}-${month}-${day}`;
}

const profileShape = {
  dateOfBirth: z.iso
    .date("Enter your date of birth.")
    .refine(
      (value) => value <= latestAdultBirthDate(),
      "You must be 18 or older to join.",
    ),
  education: z
    .string()
    .trim()
    .min(1, "Enter your qualification and field of study.")
    .max(150, "Use 150 characters or fewer."),
  occupation: z
    .string()
    .trim()
    .min(1, "Enter your job or business, or that you're a student.")
    .max(150, "Use 150 characters or fewer."),
  interests: areasSchema,
  otherInterests: z.string().trim().max(200, "Use 200 characters or fewer."),
  goals: z
    .string()
    .trim()
    .min(1, "Tell us what you hope to get from mentoring.")
    .max(1000, "Use 1000 characters or fewer."),
  availability: availabilitySchema,
};

export const menteeProfileSchema = z.object(profileShape);

const interestRule = areaRule(
  "interests",
  "otherInterests",
  "Add at least one area of interest.",
);

export const menteeSignupSchema = z
  .object({
    name: userSchema.shape.name,
    email: userSchema.shape.email,
    phone: userSchema.shape.phone,
    itsId: userSchema.shape.itsId,
    city: userSchema.shape.city,
    mohalla: userSchema.shape.mohalla,
    ...profileShape,
    password: passwordSchema,
    confirmation: z.string(),
  })
  .refine(interestRule.check, interestRule.params)
  .refine(passwordRule.check, passwordRule.params);

export type MenteeFormValues = z.input<typeof menteeSignupSchema>;
