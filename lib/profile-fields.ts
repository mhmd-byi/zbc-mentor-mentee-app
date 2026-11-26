// Rules shared by the mentor and mentee sign-up forms.
import { z } from "zod";
import { AVAILABILITY_OPTIONS, EXPERTISE_AREAS } from "./mentor-options";

export const areasSchema = z.array(
  z.string().refine((value) => EXPERTISE_AREAS.includes(value)),
);

export const availabilitySchema = z
  .array(
    z
      .string()
      .refine((value) =>
        AVAILABILITY_OPTIONS.some((option) => option.value === value),
      ),
  )
  .min(1, "Choose at least one time.");

// The rules below compare fields, and `when` makes them run alongside other errors.

// Needs a choice from the list, or something typed in the "other" box.
export function areaRule(listKey: string, otherKey: string, message: string) {
  return {
    check(values: unknown) {
      const record = (values ?? {}) as Record<string, unknown>;
      const list = record[listKey];
      return (
        (Array.isArray(list) && list.length > 0) ||
        String(record[otherKey] ?? "").trim() !== ""
      );
    },
    params: { path: [otherKey], message, when: () => true },
  };
}

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
