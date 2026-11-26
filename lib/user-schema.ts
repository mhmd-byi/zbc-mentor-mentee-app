import { z } from "zod";
import { MOHALLAS } from "./mohallas";
import { ROLES, type Role } from "./roles";
import { passwordSchema } from "./schemas";

export const userSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address.")),
  role: z
    .string()
    .refine(
      (value): value is Role => (ROLES as readonly string[]).includes(value),
      "Choose a role.",
    ),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number."),
  itsId: z
    .string()
    .trim()
    .regex(/^[0-9]{8}$/, "Enter the 8-digit ITS ID."),
  city: z.string().trim().max(100, "Use 100 characters or fewer."),
  mohalla: z
    .string()
    .refine((value) => MOHALLAS.includes(value), "Choose a mohalla."),
});

export const newUserSchema = userSchema.extend({ password: passwordSchema });

// What the user form holds. Editing ignores the password.
export type UserFormValues = z.input<typeof newUserSchema>;
