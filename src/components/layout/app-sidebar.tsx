"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav, type NavItem } from "./sidebar-nav";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";

export interface AppSidebarProps {
  navItems: NavItem[];
  user?: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  appName?: string;
  appLogo?: React.ReactNode;
}

export function AppSidebar({ navItems, user, appName = "Plinth", appLogo }: AppSidebarProps) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          {appLogo || <div className="h-6 w-6 rounded bg-primary" />}
          <span className="truncate">{appName}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        <SidebarNav items={navItems} />
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-2">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent w-full transition-colors" />
              }
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? "User"} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="truncate flex-1 text-left">{user?.name || "User"}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeSwitcher />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
