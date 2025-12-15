import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plinth Documentation",
  description: "Documentation for the Plinth developer platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <div className="flex min-h-screen">
          <aside className="w-64 border-r border-gray-200 p-6">
            <h1 className="text-xl font-bold mb-8">Plinth</h1>
            <nav className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Getting Started</h2>
                <ul className="space-y-2">
                  <li><a href="/" className="text-sm hover:text-blue-600">Introduction</a></li>
                  <li><a href="/quickstart" className="text-sm hover:text-blue-600">Quick Start</a></li>
                  <li><a href="/installation" className="text-sm hover:text-blue-600">Installation</a></li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Core Concepts</h2>
                <ul className="space-y-2">
                  <li><a href="/modules" className="text-sm hover:text-blue-600">Modules</a></li>
                  <li><a href="/authentication" className="text-sm hover:text-blue-600">Authentication</a></li>
                  <li><a href="/authorization" className="text-sm hover:text-blue-600">Authorization</a></li>
                  <li><a href="/database" className="text-sm hover:text-blue-600">Database</a></li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Features</h2>
                <ul className="space-y-2">
                  <li><a href="/billing" className="text-sm hover:text-blue-600">Billing</a></li>
                  <li><a href="/webhooks" className="text-sm hover:text-blue-600">Webhooks</a></li>
                  <li><a href="/email" className="text-sm hover:text-blue-600">Email</a></li>
                  <li><a href="/storage" className="text-sm hover:text-blue-600">Storage</a></li>
                  <li><a href="/feature-flags" className="text-sm hover:text-blue-600">Feature Flags</a></li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">API Reference</h2>
                <ul className="space-y-2">
                  <li><a href="/api/auth" className="text-sm hover:text-blue-600">Auth API</a></li>
                  <li><a href="/api/billing" className="text-sm hover:text-blue-600">Billing API</a></li>
                  <li><a href="/api/admin" className="text-sm hover:text-blue-600">Admin API</a></li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Deployment</h2>
                <ul className="space-y-2">
                  <li><a href="/docker" className="text-sm hover:text-blue-600">Docker</a></li>
                  <li><a href="/vercel" className="text-sm hover:text-blue-600">Vercel</a></li>
                  <li><a href="/environment" className="text-sm hover:text-blue-600">Environment Variables</a></li>
                </ul>
              </div>
            </nav>
          </aside>
          <main className="flex-1 p-12 max-w-4xl">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
