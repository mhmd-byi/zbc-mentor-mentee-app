import "server-only";
import { getUsers } from "./db";
import { appUrl, sendEmail } from "./email";
import type { PairingIds } from "./pairing-service";

const MESSAGES = {
  started: {
    subject: "You have a new mentoring pairing",
    body: (name: string) =>
      `You've been paired with ${name}. Sign in to see their contact details.`,
  },
  ended: {
    subject: "A mentoring pairing has ended",
    body: (name: string) => `Your mentoring pairing with ${name} has ended.`,
  },
};

// Names are typed by users, so they must not be read as HTML.
function escapeHtml(text: string) {
  return text.replace(
    /[&<>"']/g,
    (character) => `&#${character.charCodeAt(0)};`,
  );
}

// Tells both people in each pairing. Returns false if any email couldn't be sent.
export async function notifyPairings(
  event: keyof typeof MESSAGES,
  pairings: PairingIds[],
) {
  const { subject, body } = MESSAGES[event];
  const base = appUrl();
  const link = base ? `${base}/login` : "";
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
      const message = body(other.name);
      const sent = await sendEmail({
        to: person.email,
        subject: `${subject} (ZBC Mentorship)`,
        text: `${message}\n\n${link}`,
        html: `<p>${escapeHtml(message)}</p>${link && `<p><a href="${link}">Sign in</a></p>`}`,
      });
      allSent = sent && allSent;
    }
  }
  return allSent;
}
