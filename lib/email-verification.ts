import "server-only";
import type { ObjectId } from "mongodb";
import { createHash, randomBytes } from "node:crypto";
import { getUsers } from "./db";
import { sendEmail } from "./email";

const LINK_LIFETIME_MS = 24 * 60 * 60 * 1000;

// Only the hash is stored, so reading the database doesn't give anyone a usable link.
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Never taken from the request, which could be forged to point the link elsewhere.
function appUrl() {
  const url = process.env.APP_URL;
  if (url) return url.replace(/\/+$/, "");
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : null;
}

// Emails a fresh link, which replaces any earlier one.
export async function sendVerificationEmail(userId: ObjectId, email: string) {
  const base = appUrl();
  if (!base) {
    console.error("Set APP_URL to send verification links.");
    return false;
  }

  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  await getUsers().updateOne(
    { _id: userId },
    {
      $set: {
        emailVerification: {
          tokenHash: hashToken(token),
          email,
          sentAt: new Date(now),
          expiresAt: new Date(now + LINK_LIFETIME_MS),
        },
      },
    },
  );

  // The message deliberately contains nothing the person typed.
  const link = `${base}/verify-email?token=${token}`;
  const sent = await sendEmail({
    to: email,
    subject: "Verify your email for ZBC Mentorship",
    text: `Open this link to verify your email:\n${link}\n\nIt works for 24 hours. If you didn't sign up, ignore this email.`,
    html: `<p>Verify your email to join the ZBC Mentorship waiting list.</p><p><a href="${link}">Verify my email</a></p><p>The link works for 24 hours. If you didn't sign up, ignore this email.</p>`,
  });
  // Without a delivered link there is nothing to wait for.
  if (!sent) {
    await getUsers().updateOne(
      { _id: userId },
      { $unset: { emailVerification: "" } },
    );
  }
  return sent;
}

export async function confirmEmail(token: string) {
  const users = getUsers();
  const user = await users.findOne(
    {
      "emailVerification.tokenHash": hashToken(token),
      "emailVerification.expiresAt": { $gt: new Date() },
    },
    { projection: { email: 1, emailVerification: 1 } },
  );
  if (!user || user.emailVerification?.email !== user.email) return false;

  await users.updateOne(
    { _id: user._id },
    { $set: { emailVerified: true }, $unset: { emailVerification: "" } },
  );
  return true;
}
