import "server-only";
import { getUsers } from "./db";
import { sendNotice } from "./email";
import type { PairingIds } from "./pairing-service";

const MESSAGES = {
  started: {
    subject: "You have a new mentoring pairing",
    lines: (name: string) => [
      `You've been paired with ${name}. Sign in to see their contact details.`,
    ],
  },
  ended: {
    subject: "A mentoring pairing has ended",
    lines: (name: string) => [
      `Your mentoring pairing with ${name} has ended.`,
      "Any upcoming meetings between you are cancelled.",
    ],
  },
};

// Tells both people in each pairing. Returns false if any email couldn't be sent.
export async function notifyPairings(
  event: keyof typeof MESSAGES,
  pairings: PairingIds[],
) {
  const { subject, lines } = MESSAGES[event];
  let allSent = true;

  for (const { mentorId, menteeId } of pairings) {
    const people = await getUsers()
      .find(
        { _id: { $in: [mentorId, menteeId] } },
        { projection: { name: 1, email: 1 } },
      )
      .toArray();

    // One at a time, to stay within the email service's rate limit.
    for (const person of people) {
      const other = people.find(({ _id }) => !_id.equals(person._id));
      if (!other) continue;
      const sent = await sendNotice(person.email, subject, lines(other.name));
      allSent = sent && allSent;
    }
  }
  return allSent;
}
