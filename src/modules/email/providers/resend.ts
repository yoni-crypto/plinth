import type { EmailProvider } from "../types";

export function createResendAdapter(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend");

  return {
    async send({ to, subject, html, text, from }) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: from || `Plinth <onboarding@resend.dev>`,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Resend error: ${error}`);
      }

      const data = await res.json();
      return { id: data.id };
    },
  };
}
