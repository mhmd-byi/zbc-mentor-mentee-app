import { z } from "zod";

// Meeting times are entered and shown in India time, which has no daylight saving.
export function meetingStart(date: string, time: string) {
  return new Date(`${date}T${time}:00+05:30`);
}

const optionalText = z.string().trim().max(500, "Use 500 characters or fewer.");

export const meetingSchema = z
  .object({
    pairingId: z.string().min(1, "Choose who to meet."),
    date: z.iso.date("Choose a date."),
    time: z.iso.time({ precision: -1, error: "Choose a time." }),
    location: z
      .string()
      .trim()
      .min(1, "Say where you'll meet, or paste the link.")
      .max(300, "Use 300 characters or fewer."),
    note: optionalText,
  })
  .refine(
    ({ date, time }) => meetingStart(date, time).getTime() > Date.now(),
    { path: ["time"], message: "Choose a time in the future." },
  );

export type MeetingValues = z.input<typeof meetingSchema>;

// Declining needs no reason. Cancelling does.
export const declineSchema = z.object({ reason: optionalText });

export const cancelSchema = z.object({
  reason: optionalText.min(1, "Say why you're cancelling."),
});

export type ReasonValues = z.input<typeof declineSchema>;
