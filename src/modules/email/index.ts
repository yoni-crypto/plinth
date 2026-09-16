import type { EmailProvider, EmailTemplateName, EmailTemplate } from "./types";
import { createResendAdapter } from "./providers/resend";
import { createSmtpAdapter } from "./providers/smtp";

function getProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER || "resend";
  switch (provider) {
    case "resend":
      return createResendAdapter();
    case "smtp":
      return createSmtpAdapter();
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}

function renderTemplate(name: EmailTemplateName, data: Record<string, string>): EmailTemplate {
  const templates: Record<EmailTemplateName, (d: Record<string, string>) => EmailTemplate> = {
    verification: (d) => ({
      subject: "Verify your email address",
      html: `<p>Hi ${d.name || "there"},</p><p>Please verify your email address by clicking the link below:</p><p><a href="${d.url}">Verify email</a></p><p>This link expires in 24 hours.</p>`,
    }),
    "password-reset": (d) => ({
      subject: "Reset your password",
      html: `<p>Hi ${d.name || "there"},</p><p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${d.url}">Reset password</a></p><p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
    }),
    invitation: (d) => ({
      subject: `You've been invited to join ${d.organizationName || "an organization"}`,
      html: `<p>Hi,</p><p>You've been invited to join <strong>${d.organizationName || "an organization"}</strong> on Plinth.</p><p><a href="${d.url}">Accept invitation</a></p>`,
    }),
    welcome: (d) => ({
      subject: "Welcome to Plinth",
      html: `<p>Hi ${d.name || "there"},</p><p>Welcome to Plinth! Your account has been created.</p><p><a href="${d.url || process.env.NEXT_PUBLIC_APP_URL}">Go to dashboard</a></p>`,
    }),
    "payment-confirmation": (d) => ({
      subject: "Payment confirmed",
      html: `<p>Hi ${d.name || "there"},</p><p>Your payment of <strong>${d.amount || ""}</strong> has been confirmed.</p><p>Thank you for your purchase!</p>`,
    }),
    "magic-link": (d) => ({
      subject: "Your verification code",
      html: `<p>Hi ${d.email || "there"},</p><p>Your verification code is: <strong>${d.url}</strong></p><p>This code expires in 10 minutes.</p>`,
    }),
  };

  return templates[name](data);
}

export async function sendEmail(input: {
  to: string | string[];
  template: EmailTemplateName;
  data: Record<string, string>;
  from?: string;
}): Promise<{ id: string }> {
  const provider = getProvider();
  const rendered = renderTemplate(input.template, input.data);

  return provider.send({
    to: input.to,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    from: input.from,
  });
}

export type { EmailProvider, EmailTemplateName };
