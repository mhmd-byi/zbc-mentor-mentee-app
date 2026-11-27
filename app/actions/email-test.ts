"use server";

import { requireRole } from "@/lib/auth";
import { buildNotice, deliverEmail } from "@/lib/email";
import { formatDateTime } from "@/lib/format";
import type { FormState } from "@/lib/schemas";
import { userSchema } from "@/lib/user-schema";

// Reports exactly what Resend said, so only admins can use it.
export async function sendTestEmail(
  _state: FormState,
  values: { to: string },
): Promise<FormState> {
  await requireRole("admin");
  const parsed = userSchema.shape.email.safeParse(values.to);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const problem = await deliverEmail(
    buildNotice(parsed.data, "Test email", [
      "This is a test. If you're reading it, email is working.",
      // Tells one test apart from another.
      `Sent on ${formatDateTime(new Date())}.`,
    ]),
  );
  return problem
    ? { error: problem }
    : {
        success: `Resend accepted the email to ${parsed.data}. Check the inbox and spam folder.`,
      };
}
