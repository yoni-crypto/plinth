# Plinth

A production-ready, modular developer platform for building modern web applications and SaaS products.

## Tech Stack

- **Framework:** Next.js 16 + React 19
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Custom JWT sessions (jose)
- **Payments:** Stripe + Chapa adapters
- **Email:** Resend + SMTP adapters
- **Storage:** S3/R2 + local adapters
- **Testing:** Vitest

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL 16+

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd plinth

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Configure your .env file (see Configuration below)

# Initialize database
pnpm db:push

# Seed database with demo data
pnpm db:seed

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Demo Account

After seeding:
- **Email:** admin@example.com
- **Password:** password123

## Configuration

### Required Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/plinth
AUTH_SECRET=your-secret-key-at-least-32-chars
```

### Optional Environment Variables

```env
# Auth
AUTH_EXPIRES_IN=7d

# Email (default: log)
EMAIL_PROVIDER=resend|smtp|log
EMAIL_FROM=noreply@example.com
RESEND_API_KEY=re_xxx
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASSWORD=pass

# Storage (default: local)
STORAGE_PROVIDER=s3|local
STORAGE_BUCKET=uploads
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1

# Payments (default: stripe)
PAYMENT_PROVIDER=stripe|chapa
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CHAPA_SECRET_KEY=CHASECK_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Available Scripts

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
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   └── (auth)/             # Auth pages
├── components/             # UI components
│   ├── ui/                 # shadcn primitives
│   └── layout/             # Layout components
├── config/                 # Environment config
├── lib/                    # Utilities
│   └── db/                 # Database schema + client
└── modules/                # Feature modules
    ├── auth/               # Authentication
    ├── billing/            # Billing system
    ├── rbac/               # Role-based access
    ├── organizations/      # Multi-tenancy
    ├── notifications/      # Notifications
    ├── audit/              # Audit logging
    ├── api-keys/           # API key management
    ├── webhooks/           # Outgoing webhooks
    ├── payments/           # Payment abstraction
    ├── email/              # Email abstraction
    ├── storage/            # File storage
    ├── feature-flags/      # Feature flags
    ├── admin/              # Admin module
    └── rate-limit/         # Rate limiting
```

## Modules

### Authentication
Custom JWT sessions with HttpOnly cookies, bcryptjs password hashing, and middleware route protection.

### Billing
Provider-agnostic billing with Stripe and Chapa adapters. Supports plans, subscriptions, feature gates, and usage limits.

### RBAC
Role-based access control with system roles (Owner, Admin, Member, Viewer) and granular permissions.

### Multi-tenancy
Organization-based multi-tenancy with membership management and role-based access per organization.

### Notifications
In-app notification system with read/unread tracking and bulk operations.

### Audit Logging
Complete audit trail for all user and admin actions.

### Webhooks
Outgoing webhook system with HMAC-SHA256 signatures and delivery logging.

### Feature Flags
Global, user-specific, and organization-specific feature flag overrides.

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Manual

```bash
pnpm build
pnpm start
```

## License

MIT
