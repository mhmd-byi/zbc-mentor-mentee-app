import "server-only";

type Email = { to: string; subject: string; text: string; html: string };

// The app's address, for links in emails. Never taken from a request, which
// could be forged to point a link elsewhere.
export function appUrl() {
  const url = process.env.APP_URL;
  if (url) return url.replace(/\/+$/, "");
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : null;
}

// Names and messages are typed by users, so they must not be read as HTML.
function escapeHtml(text: string) {
  return text.replace(
    /[&<>"']/g,
    (character) => `&#${character.charCodeAt(0)};`,
  );
}

// A short message to one person, ending with a link to sign in.
export function buildNotice(to: string, subject: string, lines: string[]) {
  const base = appUrl();
  const link = base ? `${base}/login` : "";
  const paragraphs = lines
    .map((line) => `<p style="white-space:pre-line">${escapeHtml(line)}</p>`)
    .join("");

  return {
    to,
    subject: `${subject} (ZBC Mentorship)`,
    text: `${lines.join("\n")}\n\n${link}`,
    html: `${paragraphs}${link && `<p><a href="${link}">Sign in</a></p>`}`,
  };
}

export function sendNotice(to: string, subject: string, lines: string[]) {
  return sendEmail(buildNotice(to, subject, lines));
}

// What the email settings are. The API key itself never leaves this file.
export function emailSettings() {
  return {
    apiKeySet: Boolean(process.env.RESEND_API_KEY),
    from: process.env.EMAIL_FROM ?? "",
    appUrl: appUrl() ?? "",
  };
}

// Sends through Resend. Returns false if the email couldn't be sent.
export async function sendEmail(email: Email) {
  const { apiKeySet, from } = emailSettings();
  // Local development without Resend: print the email in the server terminal.
  if ((!apiKeySet || !from) && process.env.NODE_ENV === "development") {
    console.info(
      `[email not sent] To: ${email.to}\n${email.subject}\n${email.text}`,
    );
    return true;
  }

  const problem = await deliverEmail(email);
  if (problem) console.error(problem);
  return problem === null;
}

// Resend explains a refusal as JSON with a message.
function refusalReason(body: string): string {
  try {
    return JSON.parse(body).message ?? body;
  } catch {
    return body;
  }
}

// Hands an email to Resend. Returns why it wasn't accepted, or null if it was.
export async function deliverEmail(email: Email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return "Nothing was sent. Set RESEND_API_KEY and EMAIL_FROM first.";
  }

  const post = () =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, ...email }),
    });

  try {
    let response = await post();
    if (response.status === 429) {
      // Too many at once: wait a moment and try one more time.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      response = await post();
    }
    if (response.ok) return null;
    const reason = refusalReason(await response.text());
    return `Resend refused the email (${response.status}): ${reason}`;
  } catch (error) {
    console.error(error);
    return "Couldn't reach Resend. Check the server's internet connection.";
  }
}
