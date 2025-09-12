"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { Check } from "lucide-react";

const steps = [
  {
    title: "Welcome to Plinth",
    description: "Let's get you set up in just a few steps.",
  },
  {
    title: "Create Organization",
    description: "Set up your first organization.",
  },
  {
    title: "Choose Plan",
    description: "Select the plan that works for you.",
  },
  {
    title: "All Done!",
    description: "You're ready to start building.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Create organization
      await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName }),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{steps[step].title}</CardTitle>
          <CardDescription>{steps[step].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Authentication configured</span>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Billing ready</span>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Admin dashboard enabled</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  placeholder="My Company"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="cursor-pointer rounded-lg border-2 border-primary p-4">
                  <div className="font-medium">Free</div>
                  <div className="text-sm text-muted-foreground">
                    Perfect for getting started
                  </div>
                </div>
                <div className="cursor-pointer rounded-lg border p-4 hover:border-muted-foreground">
                  <div className="font-medium">Pro - $29/mo</div>
                  <div className="text-sm text-muted-foreground">
                    For growing teams
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <Icons.checkCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-muted-foreground">
                Your account is all set up. Start building something amazing!
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={isLoading || (step === 1 && !orgName)}
                className="ml-auto"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Go to Dashboard"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
