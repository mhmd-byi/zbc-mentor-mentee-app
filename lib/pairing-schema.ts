import { z } from "zod";

export const PAIRING_OUTCOMES = [
  { value: "completed", label: "Completed" },
  { value: "ended_early", label: "Ended early" },
] as const;

export type PairingOutcome = (typeof PAIRING_OUTCOMES)[number]["value"];

export const endPairingSchema = z.object({
  outcome: z
    .string()
    .refine(
      (value): value is PairingOutcome =>
        PAIRING_OUTCOMES.some((outcome) => outcome.value === value),
      "Choose how it ended.",
    ),
  note: z.string().trim().max(500, "Use 500 characters or fewer."),
});

export type EndPairingValues = z.input<typeof endPairingSchema>;
