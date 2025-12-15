export default function Home() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Plinth Documentation</h1>
      <p className="text-xl text-gray-600">
        A production-ready, modular developer platform for building modern web applications.
      </p>

      <h2>Features</h2>
      <ul>
        <li><strong>Authentication</strong> - Custom JWT sessions with HttpOnly cookies</li>
        <li><strong>Authorization</strong> - Role-based access control with system roles</li>
        <li><strong>Billing</strong> - Stripe and Chapa payment adapters</li>
        <li><strong>Multi-tenancy</strong> - Organization-based multi-tenancy</li>
        <li><strong>Notifications</strong> - In-app notification system</li>
        <li><strong>Audit Logging</strong> - Complete audit trail</li>
        <li><strong>Webhooks</strong> - Outgoing webhook system</li>
        <li><strong>Feature Flags</strong> - Global and per-org feature flags</li>
        <li><strong>Admin</strong> - User and organization management</li>
        <li><strong>CLI</strong> - Command-line tool for project scaffolding</li>
      </ul>

      <h2>Quick Start</h2>
      <pre><code>{`# Create a new project
npx plinth-cli init my-app

# Navigate to project
cd my-app

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Initialize database
pnpm db:push

# Seed demo data
pnpm db:seed

# Start development server
pnpm dev`}</code></pre>

      <h2>Tech Stack</h2>
      <ul>
        <li>Next.js 16 + React 19</li>
        <li>TypeScript 5 (strict)</li>
        <li>Tailwind CSS v4 + shadcn/ui</li>
        <li>PostgreSQL + Drizzle ORM</li>
        <li>Vitest for testing</li>
      </ul>
    </div>
  );
}
