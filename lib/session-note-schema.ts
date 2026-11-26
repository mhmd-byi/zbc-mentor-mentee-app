import { z } from "zod";
import { todayInIndia } from "./format";

// "Session" here means a mentoring session, not a sign-in.
export const sessionNoteSchema = z.object({
  date: z.iso
    .date("Choose a date.")
    .refine(
      (date) => date <= todayInIndia(),
      "Choose today or an earlier date.",
    ),
  summary: z
    .string()
    .trim()
    .min(1, "Write what you covered.")
    .max(2000, "Use 2000 characters or fewer."),
  nextSteps: z.string().trim().max(1000, "Use 1000 characters or fewer."),
});

export type SessionNoteValues = z.input<typeof sessionNoteSchema>;
