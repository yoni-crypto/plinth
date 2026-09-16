import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider, PostHogPageView } from "@/lib/analytics/posthog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Plinth — Open-Source Developer Platform for SaaS & Web Apps",
    template: "%s | Plinth",
  },
  description:
    "Production-ready, modular developer platform for building modern web applications and SaaS products. Auth, billing, RBAC, notifications, audit logs, and more — out of the box.",
  keywords: [
    "SaaS starter",
    "developer platform",
    "Next.js starter",
    "open source SaaS",
    "authentication",
    "billing system",
    "RBAC",
    "multi-tenancy",
    "web application boilerplate",
    "production ready",
    "TypeScript",
    "React",
    "PostgreSQL",
    "Drizzle ORM",
    "Stripe integration",
    "Chapa payments",
    "open source",
    "free",
    "MIT license",
    "Better Auth",
    "2FA",
    "OAuth",
    "i18n",
    "React Email",
    "PostHog",
    "Sentry",
    "Inngest",
    "AI SDK",
  ],
  authors: [{ name: "yoni-crypto", url: "https://github.com/yoni-crypto" }],
  creator: "yoni-crypto",
  publisher: "yoni-crypto",
  metadataBase: new URL("https://github.com/yoni-crypto/plinth"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/yoni-crypto/plinth",
    siteName: "Plinth",
    title: "Plinth — Open-Source Developer Platform for SaaS & Web Apps",
    description:
      "Production-ready, modular developer platform for building modern web applications and SaaS products. Auth, billing, RBAC, notifications, audit logs, and more — out of the box.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Plinth — Open-Source Developer Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plinth — Open-Source Developer Platform for SaaS & Web Apps",
    description:
      "Production-ready, modular developer platform for building modern web applications and SaaS products.",
    images: ["/og-image.png"],
    creator: "@yoni_crypto",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Plinth",
    description:
      "Production-ready, modular developer platform for building modern web applications and SaaS products.",
    url: "https://github.com/yoni-crypto/plinth",
    codeRepository: "https://github.com/yoni-crypto/plinth",
    programmingLanguage: "TypeScript",
    license: "https://opensource.org/licenses/MIT",
    author: {
      "@type": "Person",
      name: "yoni-crypto",
      url: "https://github.com/yoni-crypto",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    features: [
      "Authentication",
      "Authorization (RBAC)",
      "Billing & Subscriptions",
      "Multi-tenancy",
      "Notifications",
      "Audit Logging",
      "API Keys",
      "Webhooks",
      "Feature Flags",
      "Email Integration",
      "File Storage",
      "Rate Limiting",
      "Background Jobs",
      "Analytics",
      "AI Integration",
      "i18n",
      "2FA",
      "OAuth",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <PostHogPageView />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
