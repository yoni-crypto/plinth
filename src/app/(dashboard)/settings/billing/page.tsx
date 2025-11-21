"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

interface Subscription {
  id: string;
  status: string;
  plan: Plan | null;
  currentPeriodEnd: string | null;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.organizations.length > 0) {
          setOrgId(d.data.organizations[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!orgId) return;

    Promise.all([
      fetch("/api/billing?action=plans").then((r) => r.json()),
      fetch(`/api/billing?action=subscription&organizationId=${orgId}`).then((r) => r.json()),
      fetch(`/api/billing?action=invoices&organizationId=${orgId}`).then((r) => r.json()),
    ]).then(([plansData, subData, invData]) => {
      if (plansData.success) setPlans(plansData.data.plans);
      if (subData.success) setSubscription(subData.data.subscription);
      if (invData.success) setInvoices(invData.data.invoices);
    }).finally(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Manage your subscription and billing." />

      {subscription && subscription.plan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                {subscription.status}
              </Badge>
            </div>
            <CardDescription>
              {subscription.currentPeriodEnd
                ? `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : "No renewal date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                ${(subscription.plan.price / 100).toFixed(0)}
              </span>
              <span className="text-muted-foreground">/{subscription.plan.interval}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{subscription.plan.name}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan?.slug === plan.slug;
          return (
            <Card key={plan.id} className={isCurrent ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {plan.price === 0 ? "Free" : `$${(plan.price / 100).toFixed(0)}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isCurrent ? "outline" : "default"}
                  className="w-full"
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Your billing history.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      ${(invoice.amount / 100).toFixed(2)} {invoice.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
