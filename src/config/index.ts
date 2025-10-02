import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Plinth"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),

  // Email (optional)
  EMAIL_PROVIDER: z.enum(["resend", "smtp"]).optional(),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Storage (optional)
  STORAGE_PROVIDER: z.enum(["s3", "r2", "local"]).default("local"),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_PUBLIC_URL: z.string().optional(),
  LOCAL_STORAGE_DIR: z.string().optional(),
  MAX_FILE_SIZE: z.coerce.number().optional(),
  ALLOWED_FILE_TYPES: z.string().optional(),

  // Payments (optional)
  PAYMENT_PROVIDER: z.enum(["stripe", "chapa"]).default("stripe"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CHAPA_SECRET_KEY: z.string().optional(),

  // OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
});

function getConfig() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.flatten().fieldErrors;
    const messages = Object.entries(formatted)
      .map(([key, value]) => `  ${key}: ${value?.join(", ")}`)
      .join("\n");

    throw new Error(
      `Invalid environment variables:\n${messages}\n\nCheck .env.example for reference.`
    );
  }

  return parsed.data;
}

export const config = getConfig();

export type Config = z.infer<typeof envSchema>;
