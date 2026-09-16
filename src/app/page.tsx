"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/shared/icons";
import {
  Shield,
  CreditCard,
  Users,
  LayoutDashboard,
  Zap,
  Globe,
  Lock,
  BarChart3,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Authentication",
    description:
      "Secure auth with OAuth, 2FA, magic links, and session management powered by Better Auth.",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description:
      "Stripe integration with subscriptions, usage-based billing, and multi-currency support.",
  },
  {
    icon: Users,
    title: "Multi-Tenancy",
    description:
      "Organization management with team invitations, RBAC, and custom permissions.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description:
      "Built-in admin panel for managing users, organizations, and system health.",
  },
  {
    icon: Zap,
    title: "Background Jobs",
    description:
      "Async task processing with Inngest for emails, webhooks, and scheduled tasks.",
  },
  {
    icon: Globe,
    title: "Internationalization",
    description:
      "Multi-language support with next-intl for global reach.",
  },
  {
    icon: Lock,
    title: "Feature Flags",
    description:
      "Toggle features without deploying with global, user, and organization flags.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "PostHog integration for user analytics, events, and insights.",
  },
];

const techStack = [
  { name: "Next.js 15", description: "React framework" },
  { name: "React 19", description: "UI library" },
  { name: "TypeScript 5", description: "Type safety" },
  { name: "Tailwind CSS 4", description: "Styling" },
  { name: "Drizzle ORM", description: "Database ORM" },
  { name: "PostgreSQL", description: "Database" },
  { name: "Better Auth", description: "Authentication" },
  { name: "Stripe", description: "Payments" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "100 credits/month",
      "1 organization",
      "Basic auth",
      "Community support",
    ],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For growing teams",
    features: [
      "10,000 credits/month",
      "Unlimited organizations",
      "2FA & OAuth",
      "Priority support",
      "Custom domains",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited credits",
      "Unlimited organizations",
      "SSO & SAML",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Open Source SaaS Starter
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Build Your SaaS{" "}
              <span className="text-primary">Faster</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              The ultimate open-source starter for building production-ready SaaS
              applications with Next.js, React, and TypeScript.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" render={<Link href="/register" />}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" render={<a href="https://github.com/yoni-crypto/plinth" target="_blank" rel="noopener noreferrer" />}>
                <Icons.github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold">7.3k+</div>
              <div className="text-sm text-muted-foreground">GitHub Stars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">18</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">TypeScript</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground">
              A complete toolkit for building modern SaaS applications
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 bg-muted/50">
                <CardHeader>
                  <feature.icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-y bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Built with Modern Tech</h2>
            <p className="text-muted-foreground">
              Using the latest technologies for the best developer experience
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-lg border bg-background p-4 text-center"
              >
                <div className="font-medium">{tech.name}</div>
                <div className="text-sm text-muted-foreground">
                  {tech.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Simple Pricing</h2>
            <p className="text-muted-foreground">
              Choose the plan that works for you
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    render={<Link href={plan.href} />}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Build?</h2>
          <p className="mb-8 text-muted-foreground">
            Start building your SaaS today with Plinth
          </p>
          <Button size="lg" render={<Link href="/register" />}>
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Icons.logo className="h-6 w-6" />
                <span className="text-lg font-bold">Plinth</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate open-source SaaS starter.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-primary">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/yoni-crypto/plinth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/license" className="hover:text-primary">
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 Plinth. MIT License.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/yoni-crypto/plinth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.github className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Icons.twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
