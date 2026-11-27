import "server-only";
import { sendNotice } from "./email";
import { ROLE_LABELS, type Role } from "./roles";

// Passwords are never emailed: the admin passes them on another way.
const PASSWORD_STEPS =
  "An administrator will give you a temporary password separately. You'll choose your own when you sign in with it.";

type Recipient = { name: string; email: string };

// Tells someone that an admin made them an account. Returns false if it failed.
export function sendWelcomeEmail({
  name,
  email,
  role,
}: Recipient & { role: Role }) {
  return sendNotice(email, "Your account is ready", [
    `Hello ${name},`,
    "An account has been created for you.",
    `Role: ${ROLE_LABELS[role]}`,
    `Sign in with this email address: ${email}`,
    PASSWORD_STEPS,
  ]);
}

export function sendPasswordResetEmail({ name, email }: Recipient) {
  return sendNotice(email, "Your password was reset", [
    `Hello ${name},`,
    "An administrator reset your password, and you've been signed out.",
    PASSWORD_STEPS,
    "If you weren't expecting this, contact an administrator.",
  ]);
}
