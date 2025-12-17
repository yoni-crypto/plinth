"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, type AppSidebarProps } from "./app-sidebar";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
  navItems: AppSidebarProps["navItems"];
  user?: AppSidebarProps["user"];
  appName?: string;
}

export function AppShell({ children, navItems, user, appName }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar navItems={navItems} user={user} appName={appName} />
      <SidebarInset>
        <Header user={user} />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
