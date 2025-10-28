import nodemailer from "nodemailer";
import type { EmailProvider } from "../types";

export function createSmtpAdapter(): EmailProvider {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) throw new Error("SMTP_HOST is required when EMAIL_PROVIDER=smtp");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  return {
    async send({ to, subject, html, text, from }) {
      const result = await transporter.sendMail({
        from: from || process.env.SMTP_FROM || user || "noreply@plinth.dev",
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        html,
        text,
      });
      return { id: result.messageId };
    },
  };
}
