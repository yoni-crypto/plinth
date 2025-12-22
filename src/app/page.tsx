"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CreditCard,
  Users,
  Bell,
  FileText,
  Key,
  Webhook,
  Flag,
  Lock,
  Database,
  Zap,
  ArrowRight,
  Star,
  Github,
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Authentication",
    description: "JWT sessions, HttpOnly cookies, bcryptjs hashing, middleware protection",
  },
  {
    icon: Shield,
    title: "RBAC & Authorization",
    description: "Owner/Admin/Member/Viewer roles with granular permissions",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Stripe + Chapa adapters, plans, subscriptions, feature gates",
  },
  {
    icon: Users,
    title: "Multi-tenancy",
    description: "Organization-based isolation with membership management",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "In-app notification system with read/unread tracking",
  },
  {
    icon: FileText,
    title: "Audit Logging",
    description: "Complete audit trail for all user and admin actions",
  },
  {
    icon: Key,
    title: "API Keys",
    description: "Prefix-based key management with scoping and expiration",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "HMAC-SHA256 signed deliveries with retry logic",
  },
  {
    icon: Flag,
    title: "Feature Flags",
    description: "Global, user-specific, and org-specific overrides",
  },
  {
    icon: Database,
    title: "Email & Storage",
    description: "Resend/SMTP email + S3/local file storage adapters",
  },
  {
    icon: Zap,
    title: "Rate Limiting",
    description: "Sliding window algorithm with response headers",
  },
  {
    icon: Shield,
    title: "Admin Panel",
    description: "User management, org management, system health checks",
  },
];

const stats = [
  { value: "18+", label: "Modules" },
  { value: "26", label: "UI Components" },
  { value: "23", label: "API Routes" },
  { value: "6", label: "Months of Development" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Database className="h-5 w-5" />
            Plinth
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-sm mb-6">
            <Star className="h-3 w-3 fill-primary text-primary" />
            Open Source — MIT License
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Build SaaS products
            <br />
            <span className="text-primary">in days, not months</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plinth is a production-ready, modular developer platform with authentication,
            billing, RBAC, notifications, and 15+ more features — all out of the box.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com/yoni-crypto/plinth" target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="h-4 w-4" />
                Star on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need to ship</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stop rebuilding the same features for every project. Plinth gives you
            production-ready infrastructure so you can focus on your product.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Built with modern tech</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Next.js 16, React 19, TypeScript 5, Tailwind CSS, shadcn/ui, PostgreSQL, Drizzle ORM, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 16",
              "React 19",
              "TypeScript 5",
              "Tailwind CSS",
              "shadcn/ui",
              "PostgreSQL",
              "Drizzle ORM",
              "Stripe",
              "Chapa",
              "Resend",
              "AWS S3",
              "Vitest",
              "Docker",
            ].map((tech) => (
              <span key={tech} className="rounded-full border bg-background px-4 py-2 text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
          <p className="text-muted-foreground mb-8">
            Start building your next SaaS product today. Free and open source.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com/yoni-crypto/plinth" target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg">
                View Source Code
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Database className="h-4 w-4" />
            Plinth
          </div>
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a href="https://github.com/yoni-crypto" className="underline hover:text-foreground">
              yoni-crypto
            </a>
            . MIT License.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://github.com/yoni-crypto/plinth" className="hover:text-foreground">
              GitHub
            </a>
            <a href="https://github.com/yoni-crypto/plinth/issues" className="hover:text-foreground">
              Issues
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
