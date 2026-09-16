<div align="center">

# Plinth

**The open-source developer platform for building modern web applications and SaaS products.**

[![GitHub stars](https://img.shields.io/github/stars/yoni-crypto/plinth?style=social)](https://github.com/yoni-crypto/plinth)
[![GitHub forks](https://img.shields.io/github/forks/yoni-crypto/plinth?style=social)](https://github.com/yoni-crypto/plinth)
[![GitHub issues](https://img.shields.io/github/issues/yoni-crypto/plinth)](https://github.com/yoni-crypto/plinth/issues)
[![GitHub license](https://img.shields.io/github/license/yoni-crypto/plinth)](https://github.com/yoni-crypto/plinth/blob/main/LICENSE)
[![CI](https://github.com/yoni-crypto/plinth/actions/workflows/ci.yml/badge.svg)](https://github.com/yoni-crypto/plinth/actions/workflows/ci.yml)

[Documentation](https://github.com/yoni-crypto/plinth#documentation) · [Report Bug](https://github.com/yoni-crypto/plinth/issues) · [Request Feature](https://github.com/yoni-crypto/plinth/issues)

</div>

---

## Why Plinth?

Building a SaaS product from scratch requires months of work on authentication, billing, multi-tenancy, notifications, and dozens of other features. **Plinth** gives you all of this out of the box — production-ready, modular, and provider-agnostic.

- **Ship in days, not months** — Pre-built auth, billing, RBAC, notifications, audit logs, and more
- **Provider-agnostic** — Swap Stripe for Chapa, Resend for SMTP, S3 for local storage — no vendor lock-in
- **Type-safe everywhere** — Full TypeScript with Zod validation and Drizzle ORM
- **Production-ready** — Security headers, rate limiting, Docker support, CI/CD included
- **Modular architecture** — Use only what you need, extend what you want

## Features

| Feature | Description |
|---|---|
| **Authentication** | Better Auth with OAuth, 2FA, magic links, and session management |
| **Authorization** | RBAC with Owner/Admin/Member/Viewer roles + granular permissions |
| **Billing** | Stripe + Chapa adapters, plans, subscriptions, feature gates, usage limits |
| **Multi-tenancy** | Organization-based isolation with membership management |
| **Notifications** | In-app notification system with read/unread tracking |
| **Audit Logging** | Complete audit trail for all user and admin actions |
| **API Keys** | Prefix-based key management with scoping and expiration |
| **Webhooks** | Outgoing webhooks with HMAC-SHA256 signatures and delivery logging |
| **Feature Flags** | Global, user-specific, and org-specific overrides |
| **Email** | React Email templates + Resend + SMTP adapters |
| **Storage** | UploadThing + S3/R2 + local adapters with file validation |
| **Rate Limiting** | Sliding window algorithm with response headers |
| **Admin Panel** | User management, org management, system stats |
| **Background Jobs** | Inngest for async task processing |
| **Analytics** | PostHog integration for user analytics |
| **AI Integration** | Vercel AI SDK for chat and completions |
| **i18n** | next-intl for internationalization (10 languages) |
| **Blog/Docs** | MDX-powered content management |
| **E2E Tests** | Playwright for end-to-end testing |
| **Error Monitoring** | Sentry integration for error tracking |
| **Credits System** | Usage-based billing with credit management |
| **Waitlist** | Launch waitlist with referral tracking |
| **User Impersonation** | Admin can login as user for support |
| **Onboarding** | Multi-step onboarding flow |
| **Health Checks** | Database latency monitoring and status endpoints |
| **CLI** | Project scaffolding and module generation |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) + [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Database | [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [Better Auth](https://better-auth.com/) (OAuth, 2FA, magic links) |
| Payments | [Stripe](https://stripe.com/) + [Chapa](https://chapa.co/) |
| Email | [React Email](https://react.email/) + [Resend](https://resend.com/) + SMTP |
| Storage | [UploadThing](https://uploadthing.com/) + [AWS S3](https://aws.amazon.com/s3/) |
| Analytics | [PostHog](https://posthog.com/) |
| AI | [Vercel AI SDK](https://sdk.vercel.ai/) |
| Background Jobs | [Inngest](https://inngest.com/) |
| Error Monitoring | [Sentry](https://sentry.io/) |
| i18n | [next-intl](https://next-intl.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |
| Deployment | [Docker](https://www.docker.com/) + [Vercel](https://vercel.com/) |

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL 16+

### Installation

```bash
# Clone the repository
git clone https://github.com/yoni-crypto/plinth.git
cd plinth

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
pnpm db:push

# Seed with demo data
pnpm db:seed

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Email | Password | Role |
|---|---|---|
| admin@plinth.dev | password123 | Super Admin |
| member@plinth.dev | password123 | Member |

## Configuration

### Required

```env
DATABASE_URL=postgresql://user:password@localhost:5432/plinth
AUTH_SECRET=your-secret-key-at-least-32-chars
```

### Optional

```env
# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Auth
AUTH_EXPIRES_IN=7d

# Email (default: log)
EMAIL_PROVIDER=resend|smtp|log
EMAIL_FROM=noreply@example.com

# Storage (default: local)
STORAGE_PROVIDER=uploadthing|s3|local
STORAGE_BUCKET=uploads

# Payments (default: stripe)
PAYMENT_PROVIDER=stripe|chapa

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# AI
OPENAI_API_KEY=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [`.env.example`](.env.example) for all available options.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run Vitest tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm db:push` | Push schema to database |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed database with demo data |

## Docker

```bash
# Start with Docker Compose
docker compose up -d

# Run migrations
docker compose exec app pnpm db:push

# Seed database
docker compose exec app pnpm db:seed
```

## Project Structure

```
plinth/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, Register, 2FA, etc.
│   │   ├── (dashboard)/        # Dashboard, Settings, Admin, Onboarding
│   │   ├── (marketing)/        # Blog, Docs
│   │   └── api/                # API routes
│   ├── components/             # UI components
│   │   ├── ui/                 # shadcn primitives (50+ components)
│   │   ├── layout/             # AppShell, Sidebar, Header
│   │   ├── forms/              # FormField, FormSection
│   │   ├── data/               # DataTable, SearchInput
│   │   └── shared/             # EmptyState, ErrorState, Loading
│   ├── config/                 # Environment validation (Zod)
│   ├── lib/                    # Utilities, DB client, schema
│   │   ├── auth/               # Better Auth configuration
│   │   ├── analytics/          # PostHog integration
│   │   ├── jobs/               # Inngest background jobs
│   │   └── ai/                 # Vercel AI SDK
│   ├── hooks/                  # Custom React hooks
│   ├── i18n/                   # Internationalization config
│   ├── messages/               # Translation files (10 languages)
│   └── modules/                # Feature modules
│       ├── auth/               # Authentication & sessions
│       ├── billing/            # Plans, subscriptions, gates, credits
│       ├── rbac/               # Roles & permissions
│       ├── organizations/      # Multi-tenancy
│       ├── notifications/      # In-app notifications
│       ├── audit/              # Audit logging
│       ├── api-keys/           # API key management
│       ├── webhooks/           # Outgoing webhooks
│       ├── payments/           # Stripe & Chapa adapters
│       ├── email/              # React Email + Resend + SMTP
│       ├── storage/            # UploadThing + S3 & local storage
│       ├── feature-flags/      # Feature flag system
│       ├── admin/              # Admin module + impersonation
│       ├── rate-limit/         # Rate limiting
│       ├── waitlist/           # Launch waitlist system
│       └── module-system/      # Plugin architecture
├── packages/
│   └── cli/                    # CLI tool for scaffolding
├── content/                    # MDX blog posts
├── docs/                       # Documentation site
├── scripts/                    # Seed & utility scripts
├── tests/                      # E2E tests (Playwright)
└── sentry.client.config.ts     # Sentry configuration
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Docker

```bash
docker compose -f docker-compose.yml up -d
```

### Manual

```bash
pnpm build
pnpm start
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [yoni-crypto](https://github.com/yoni-crypto)**

If you find Plinth useful, please give it a ⭐ on GitHub!

</div>
