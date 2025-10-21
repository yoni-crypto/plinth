import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="h-12 w-12 rounded-xl bg-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Plinth</h1>
        <p className="text-muted-foreground max-w-md">
          A modular developer platform for building modern web applications and SaaS products.
        </p>
      </div>
      <div className="flex gap-3">
        <Button>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
