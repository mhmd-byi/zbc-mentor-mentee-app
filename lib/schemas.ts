// Also imported by scripts/create-admin.mjs, so keep it free of relative imports.
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(200, "Use 200 characters or fewer.");

export const newPasswordSchema = z
  .object({ password: passwordSchema, confirmation: z.string() })
  .refine((values) => values.password === values.confirmation, {
    path: ["confirmation"],
    message: "The passwords don't match.",
  });

export type NewPasswordValues = z.infer<typeof newPasswordSchema>;

// What a form's server action sends back.
export type FormState = { error?: string; success?: string };
