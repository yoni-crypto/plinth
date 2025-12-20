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
| **Authentication** | JWT sessions, HttpOnly cookies, bcryptjs, middleware protection |
| **Authorization** | RBAC with Owner/Admin/Member/Viewer roles + granular permissions |
| **Billing** | Stripe + Chapa adapters, plans, subscriptions, feature gates, usage limits |
| **Multi-tenancy** | Organization-based isolation with membership management |
| **Notifications** | In-app notification system with read/unread tracking |
| **Audit Logging** | Complete audit trail for all user and admin actions |
| **API Keys** | Prefix-based key management with scoping and expiration |
| **Webhooks** | Outgoing webhooks with HMAC-SHA256 signatures and delivery logging |
| **Feature Flags** | Global, user-specific, and org-specific overrides |
| **Email** | Resend + SMTP adapters with templating |
| **Storage** | S3/R2 + local adapters with file validation |
| **Rate Limiting** | Sliding window algorithm with response headers |
| **Admin Panel** | User management, org management, system stats |
| **Health Checks** | Database latency monitoring and status endpoints |
| **CLI** | Project scaffolding and module generation |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Database | [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) |
| Auth | [jose](https://github.com/panva/jose) (JWT) + bcryptjs |
| Payments | [Stripe](https://stripe.com/) + [Chapa](https://chapa.co/) |
| Email | [Resend](https://resend.com/) + SMTP |
| Storage | [AWS S3](https://aws.amazon.com/s3/) + local filesystem |
| Testing | [Vitest](https://vitest.dev/) |
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
| admin@example.com | password123 | Owner |

## Configuration

### Required

```env
DATABASE_URL=postgresql://user:password@localhost:5432/plinth
AUTH_SECRET=your-secret-key-at-least-32-chars
```

### Optional

```env
# Auth
AUTH_EXPIRES_IN=7d

# Email (default: log)
EMAIL_PROVIDER=resend|smtp|log
EMAIL_FROM=noreply@example.com

# Storage (default: local)
STORAGE_PROVIDER=s3|local
STORAGE_BUCKET=uploads

# Payments (default: stripe)
PAYMENT_PROVIDER=stripe|chapa

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
│   │   ├── (auth)/             # Login, Register pages
│   │   ├── (dashboard)/        # Dashboard, Settings, Admin
│   │   └── api/                # API routes
│   ├── components/             # UI components
│   │   ├── ui/                 # shadcn primitives (26 components)
│   │   ├── layout/             # AppShell, Sidebar, Header
│   │   ├── forms/              # FormField, FormSection
│   │   ├── data/               # DataTable, SearchInput
│   │   └── shared/             # EmptyState, ErrorState, Loading
│   ├── config/                 # Environment validation (Zod)
│   ├── lib/                    # Utilities, DB client, schema
│   ├── hooks/                  # Custom React hooks
│   └── modules/                # Feature modules
│       ├── auth/               # Authentication & sessions
│       ├── billing/            # Plans, subscriptions, gates
│       ├── rbac/               # Roles & permissions
│       ├── organizations/      # Multi-tenancy
│       ├── notifications/      # In-app notifications
│       ├── audit/              # Audit logging
│       ├── api-keys/           # API key management
│       ├── webhooks/           # Outgoing webhooks
│       ├── payments/           # Stripe & Chapa adapters
│       ├── email/              # Resend & SMTP adapters
│       ├── storage/            # S3 & local storage
│       ├── feature-flags/      # Feature flag system
│       ├── admin/              # Admin module
│       ├── rate-limit/         # Rate limiting
│       └── module-system/      # Plugin architecture
├── packages/
│   └── cli/                    # CLI tool for scaffolding
├── docs/                       # Documentation site
├── scripts/                    # Seed & utility scripts
└── tests/                      # Test setup
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
