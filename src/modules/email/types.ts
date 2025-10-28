export interface EmailProvider {
  send(input: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }): Promise<{ id: string }>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export type EmailTemplateName =
  | "verification"
  | "password-reset"
  | "invitation"
  | "welcome"
  | "payment-confirmation";
