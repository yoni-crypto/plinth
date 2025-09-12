import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

export const metadata: Metadata = {
  title: "Documentation | Plinth",
  description: "Comprehensive documentation for building with Plinth.",
};

const sections = [
  {
    title: "Getting Started",
    description: "Quick start guide and setup instructions",
    icon: Icons.rocket,
    items: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "Project Structure", href: "/docs/project-structure" },
    ],
  },
  {
    title: "Authentication",
    description: "Secure auth with OAuth, 2FA, and more",
    icon: Icons.shield,
    items: [
      { title: "Setup", href: "/docs/auth/setup" },
      { title: "OAuth Providers", href: "/docs/auth/oauth" },
      { title: "Two-Factor Auth", href: "/docs/auth/2fa" },
    ],
  },
  {
    title: "Billing",
    description: "Stripe integration and subscription management",
    icon: Icons.creditCard,
    items: [
      { title: "Setup", href: "/docs/billing/setup" },
      { title: "Subscriptions", href: "/docs/billing/subscriptions" },
      { title: "Usage-Based Billing", href: "/docs/billing/usage" },
    ],
  },
  {
    title: "Deployment",
    description: "Deploy to Vercel, Docker, or your own server",
    icon: Icons.server,
    items: [
      { title: "Vercel", href: "/docs/deployment/vercel" },
      { title: "Docker", href: "/docs/deployment/docker" },
      { title: "Self-Hosted", href: "/docs/deployment/self-hosted" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Documentation</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Everything you need to build with Plinth.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" render={<Link href="/docs/installation" />}>
            Get Started
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
