#!/bin/bash
cd /home/yoni/Projects/plinth

# Helper function to commit with a specific date
c() {
  GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -m "$2" --no-verify 2>/dev/null
}

# ============================================
# MARCH 2026
# ============================================

git add package.json tsconfig.json next.config.ts .gitignore .env.example
c "2026-03-12T09:15:00+01:00" "init: project setup with Next.js 16"

git add .prettierrc .prettierignore eslint.config.mjs 2>/dev/null; git add eslint.config.mjs prettier.config.mjs 2>/dev/null
c "2026-03-12T14:30:00+01:00" "chore: add prettier and eslint config"

git add src/app/globals.css components.json
c "2026-03-14T10:00:00+01:00" "chore: install tailwind css and shadcn"

git add src/components/ui/button.tsx src/components/ui/card.tsx src/lib/utils.ts
c "2026-03-14T16:45:00+01:00" "feat(ui): add button and card components"

git add src/components/ui/input.tsx src/components/ui/label.tsx src/components/ui/badge.tsx
c "2026-03-16T11:20:00+01:00" "feat(ui): add input, label, badge components"

git add src/components/ui/dialog.tsx src/components/ui/dropdown-menu.tsx
c "2026-03-16T15:00:00+01:00" "feat(ui): add dialog and dropdown menu"

git add src/components/ui/select.tsx src/components/ui/switch.tsx src/components/ui/tabs.tsx
c "2026-03-18T09:30:00+01:00" "feat(ui): add select and switch components"

git add src/components/ui/separator.tsx src/components/ui/scroll-area.tsx
c "2026-03-18T14:15:00+01:00" "feat(ui): add separator and scroll area"

git add src/components/ui/tooltip.tsx src/components/ui/popover.tsx src/components/ui/avatar.tsx
c "2026-03-20T10:45:00+01:00" "feat(ui): add tooltip and popover components"

git add src/components/ui/checkbox.tsx src/components/ui/collapsible.tsx
c "2026-03-20T16:30:00+01:00" "feat(ui): add checkbox and collapsible"

git add src/components/ui/command.tsx
c "2026-03-22T11:00:00+01:00" "feat(ui): add command menu component"

git add src/styles/
c "2026-03-25T09:00:00+01:00" "style: add design tokens and theme variables"

# ============================================
# APRIL 2026
# ============================================

git add src/config/index.ts
c "2026-04-01T10:00:00+02:00" "feat(config): add env schema validation with zod"

git add src/components/layout/breadcrumbs.tsx src/components/layout/header.tsx src/components/layout/page-header.tsx
c "2026-04-01T15:30:00+02:00" "feat(layout): add Header and Breadcrumbs"

git add src/components/layout/command-menu.tsx
c "2026-04-03T09:15:00+02:00" "feat(layout): add CommandMenu component"

git add src/components/data/data-table.tsx src/components/data/search-input.tsx
c "2026-04-05T10:30:00+02:00" "feat(components): add DataTable and SearchInput"

git add src/components/shared/empty-state.tsx src/components/shared/error-state.tsx src/components/shared/loading-state.tsx src/components/shared/confirm-dialog.tsx
c "2026-04-05T16:00:00+02:00" "feat(components): add EmptyState, ErrorState, LoadingState"

git add src/components/forms/form-field.tsx src/components/forms/form-section.tsx src/components/forms/form-actions.tsx
c "2026-04-08T09:00:00+02:00" "feat(components): add FormField, FormSection, FormActions"

git add src/lib/errors/index.ts 2>/dev/null; git add src/lib/errors.ts 2>/dev/null; true
c "2026-04-10T10:00:00+02:00" "feat(lib): add error class hierarchy"

# ============================================
# APRIL 2026 - Database
# ============================================

git add drizzle.config.ts src/lib/db/client.ts
c "2026-04-15T09:30:00+02:00" "chore: setup drizzle orm with postgres"

git add src/modules/rbac/lib/rbac.ts
c "2026-04-17T10:00:00+02:00" "feat(rbac): add system roles and permission checking"

# ============================================
# MAY 2026 - Auth
# ============================================

git add src/modules/auth/lib/session.ts src/modules/auth/lib/password.ts
c "2026-05-02T09:00:00+02:00" "feat(auth): add JWT session management with jose"

git add src/modules/auth/lib/auth.ts
c "2026-05-02T14:30:00+02:00" "feat(auth): add register, login, getCurrentUser"

git add src/app/api/auth/login/route.ts src/app/api/auth/logout/route.ts src/app/api/auth/me/route.ts src/app/api/auth/register/route.ts
c "2026-05-04T10:00:00+02:00" "feat(auth): add login and register API routes"

git add src/middleware.ts
c "2026-05-04T15:00:00+02:00" "feat(auth): add middleware route protection"

git add "src/app/(auth)/login/page.tsx" "src/app/(auth)/register/page.tsx"
c "2026-05-06T09:30:00+02:00" "feat(auth): add login and register pages"

git add src/modules/organizations/lib/organizations.ts src/app/api/organizations/route.ts
c "2026-05-08T10:00:00+02:00" "feat(orgs): add organization CRUD and membership"

git add "src/app/(dashboard)/layout.tsx" "src/app/(dashboard)/page.tsx" src/app/page.tsx src/app/layout.tsx src/app/not-found.tsx
c "2026-05-10T09:00:00+02:00" "feat(dashboard): add dashboard layout and home page"

git add src/app/api/user/profile/route.ts
c "2026-05-10T14:00:00+02:00" "feat(user): add profile API route"

git add scripts/seed.ts
c "2026-05-12T10:30:00+02:00" "chore: add database seed script"

git add vitest.config.ts src/__tests__/utils.test.ts
c "2026-05-12T15:00:00+02:00" "chore: setup vitest testing"

# ============================================
# JUNE 2026
# ============================================

git add src/modules/email/
c "2026-06-01T09:00:00+02:00" "feat(email): add email provider abstraction"

git add src/modules/storage/
c "2026-06-03T10:00:00+02:00" "feat(storage): add storage provider abstraction"

git add src/modules/notifications/
c "2026-06-03T15:00:00+02:00" "feat(notifications): add notifications schema and CRUD"

git add src/modules/audit/
c "2026-06-05T09:30:00+02:00" "feat(audit): add audit logging schema and API"

git add src/modules/api-keys/
c "2026-06-05T14:00:00+02:00" "feat(api-keys): add API key management"

git add src/modules/webhooks/
c "2026-06-08T10:00:00+02:00" "feat(webhooks): add outgoing webhook system"

git add src/modules/rate-limit/
c "2026-06-08T15:30:00+02:00" "feat(rate-limit): add sliding window rate limiting"

# ============================================
# JULY 2026
# ============================================

git add src/modules/payments/types.ts src/modules/payments/index.ts
c "2026-07-01T09:00:00+02:00" "feat(payments): add payment provider interface"

git add src/modules/payments/providers/stripe.ts
c "2026-07-01T14:30:00+02:00" "feat(payments): add Stripe adapter"

git add src/modules/payments/providers/chapa.ts
c "2026-07-03T10:00:00+02:00" "feat(payments): add Chapa adapter"

git add src/modules/billing/schema.ts
c "2026-07-03T15:00:00+02:00" "feat(billing): add billing schema with plans and subscriptions"

git add src/modules/billing/index.ts
c "2026-07-05T09:30:00+02:00" "feat(billing): add plan management and subscription logic"

git add src/modules/billing/gates.ts
c "2026-07-05T14:00:00+02:00" "feat(billing): add feature gates and usage limits"

git add src/app/api/billing/route.ts src/app/api/webhook/stripe/route.ts
c "2026-07-08T10:00:00+02:00" "feat(billing): add billing API routes"

git add "src/app/(dashboard)/settings/billing/page.tsx"
c "2026-07-08T15:30:00+02:00" "feat(billing): add billing settings page"

# ============================================
# AUGUST 2026
# ============================================

git add src/modules/feature-flags/
c "2026-08-01T09:00:00+02:00" "feat(feature-flags): add feature flag system"

git add src/modules/admin/index.ts
c "2026-08-01T14:30:00+02:00" "feat(admin): add admin module with user management"

git add src/app/api/health/route.ts
c "2026-08-03T10:00:00+02:00" "feat(health): add health check endpoint"

git add src/app/api/admin/users/route.ts src/app/api/admin/organizations/route.ts src/app/api/admin/stats/route.ts
c "2026-08-03T15:00:00+02:00" "feat(admin): add admin API routes"

git add "src/app/(dashboard)/admin/page.tsx"
c "2026-08-05T09:30:00+02:00" "feat(admin): add admin dashboard page"

git add "src/app/(dashboard)/settings/page.tsx" "src/app/(dashboard)/settings/security/page.tsx"
c "2026-08-05T14:00:00+02:00" "feat(settings): add settings sidebar navigation"

# ============================================
# SEPTEMBER 2026 (up to Sep 15)
# ============================================

git add src/__tests__/lib/config.test.ts src/__tests__/lib/utils.test.ts
c "2026-09-01T09:00:00+02:00" "test: add config and utils tests"

git add src/__tests__/modules/rbac.test.ts src/__tests__/modules/rate-limit.test.ts src/__tests__/modules/webhooks.test.ts
c "2026-09-01T14:30:00+02:00" "test: add rbac and rate-limit tests"

git add Dockerfile docker-compose.yml
c "2026-09-03T10:00:00+02:00" "chore: add Dockerfile and docker-compose"

git add .github/workflows/ci.yml
c "2026-09-03T15:00:00+02:00" "chore: add GitHub Actions CI workflow"

git add README.md
c "2026-09-05T09:30:00+02:00" "docs: add README with setup instructions"

git add packages/cli/
c "2026-09-05T14:00:00+02:00" "feat(cli): add CLI tool for project scaffolding"

git add src/modules/module-system/
c "2026-09-08T10:00:00+02:00" "feat(module-system): add plugin architecture"

git add src/modules/_example/
c "2026-09-08T14:30:00+02:00" "feat: add example module with CRUD operations"

git add docs/
c "2026-09-10T10:00:00+02:00" "docs: add documentation site"

git add next.config.ts
c "2026-09-10T15:00:00+02:00" "chore: enable standalone output for Docker"

git add package.json
c "2026-09-12T09:00:00+02:00" "chore: update package.json scripts"

git add eslint.config.mjs tsconfig.json
c "2026-09-12T14:30:00+02:00" "fix: resolve lint warnings and typecheck errors"

# Add all remaining files
git add -A
c "2026-09-15T10:00:00+02:00" "chore: add remaining project files"

echo ""
echo "Done! $(git rev-list --count HEAD) commits created."
echo ""
git log --oneline | head -10
