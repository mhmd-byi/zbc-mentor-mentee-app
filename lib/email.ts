import "server-only";

type Email = { to: string; subject: string; text: string; html: string };

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

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, ...email }),
    });
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
