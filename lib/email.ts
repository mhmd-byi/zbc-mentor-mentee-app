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

// Sends through Resend. Returns false if the email couldn't be sent.
export async function sendEmail(email: Email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    // Local development without Resend: print the email in the server terminal.
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[email not sent] To: ${email.to}\n${email.subject}\n${email.text}`,
      );
      return true;
    }
    console.error("Set RESEND_API_KEY and EMAIL_FROM to send email.");
    return false;
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
    if (!response.ok) {
      console.error(
        `Resend refused the email (${response.status}): ${await response.text()}`,
      );
    }
    return response.ok;
  } catch (error) {
    console.error("Couldn't reach Resend:", error);
    return false;
  }
}
