// Rules shared by the mentor and mentee sign-up forms.
import { z } from "zod";
import { AVAILABILITY_OPTIONS } from "./mentor-options";

// Expertise or interests, typed freely. Matching compares the entries between commas.
export function areasSchema(message: string) {
  return z
    .string()
    .trim()
    .min(1, message)
    .max(200, "Use 200 characters or fewer.");
}

export const availabilitySchema = z
  .array(
    z
      .string()
      .refine((value) =>
        AVAILABILITY_OPTIONS.some((option) => option.value === value),
      ),
  )
  .min(1, "Choose at least one time.");

// This rule compares fields, and `when` makes it run alongside other errors.
export const passwordRule = {
  check(values: unknown) {
    const { password, confirmation } = (values ?? {}) as {
      password?: unknown;
      confirmation?: unknown;
    };
    return password === confirmation;
  },
  params: {
    path: ["confirmation"],
    message: "The passwords don't match.",
    when: () => true,
  },
};
