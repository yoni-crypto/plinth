"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import type { NavItem } from "@/components/layout/sidebar-nav";

interface User {
  name: string | null;
  email: string;
  avatar: string | null;
  isSuperAdmin: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.success) setUser(d.data.user);
    });
  }, []);

  const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Settings", href: "/settings", icon: Settings },
    ...(user?.isSuperAdmin ? [{ title: "Admin", href: "/admin", icon: Shield }] : []),
  ];

  return (
    <AppShell
      navItems={navItems}
      user={user ?? undefined}
      appName="Plinth"
    >
      {children}
    </AppShell>
  );
}
