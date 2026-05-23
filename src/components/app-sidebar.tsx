"use client";

import React from "react";
import { useAppStore } from "@/store/app-store";
import { getIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// -------------------- Role Label Map --------------------

const ROLE_LABELS: Record<string, string> = {
  SuperAdmin: "Super Admin",
  InstituteAdmin: "Institute Admin",
  BranchAdmin: "Branch Admin",
  Teacher: "Teacher",
  Student: "Student",
};

// -------------------- NavItem --------------------

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: { id: string; label: string; icon: string; badge?: number };
  isActive: boolean;
  onClick: () => void;
}) {
  const iconElement = React.createElement(getIcon(item.icon), {
    className: cn(
      "w-[18px] h-[18px] shrink-0 transition-colors duration-200",
      isActive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-slate-400 dark:text-slate-500 group-data-[collapsible=icon]:text-slate-500 dark:group-data-[collapsible=icon]:text-slate-400"
    ),
  });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={onClick}
        tooltip={item.label}
        className={cn(
          "h-9 rounded-lg transition-all duration-200",
          "border-l-[3px]",
          "group-data-[collapsible=icon]:border-l-0",
          isActive
            ? "border-l-emerald-500 bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/40 dark:text-emerald-400"
            : "border-l-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
        )}
      >
        {iconElement}
        <span className="truncate">{item.label}</span>
      </SidebarMenuButton>
      {item.badge !== undefined && item.badge > 0 && (
        <SidebarMenuBadge
          className={cn(
            "h-5 min-w-5 rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
            isActive
              ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white"
              : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          )}
        >
          {item.badge}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

// -------------------- Role Badge --------------------

function RoleBadge({ role }: { role: string }) {
  const label = ROLE_LABELS[role] ?? role;

  return (
    <div className="group-data-[collapsible=icon]:hidden px-3 pb-2">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
        {label}
      </div>
    </div>
  );
}

// -------------------- AppSidebar --------------------

export function AppSidebar() {
  const navigationItems = useAppStore((s) => s.navigationItems);
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const mainItems = navigationItems.slice(0, 6);
  const secondaryItems = navigationItems.slice(6);

  return (
    <Sidebar collapsible="icon">
      {/* ── Brand Header ── */}
      <SidebarHeader className="border-0 p-0 gap-0">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-4 h-14 flex items-center border-b-2 border-emerald-500/40">
          <div className="flex items-center gap-1 w-full group-data-[collapsible=icon]:justify-center">
            <img src="/logo.png" alt="CampusHub" className="h-12 w-12 shrink-0 object-contain" />
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <h2 className="text-[17px] font-bold tracking-tight text-white truncate leading-tight">
                CampusHub
              </h2>
              <p className="text-[11px] text-emerald-100/80 truncate leading-tight mt-0.5">
                {currentUser?.instituteName ?? "Management System"}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 pt-3">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-[10px] uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500 font-semibold px-3 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={currentPage === item.id}
                  onClick={() => setCurrentPage(item.id)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {secondaryItems.length > 0 && (
          <>
            <SidebarSeparator className="mx-3 my-2 bg-slate-200/60 dark:bg-slate-700/40" />
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-[10px] uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500 font-semibold px-3 mb-1">
                More
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryItems.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={currentPage === item.id}
                      onClick={() => setCurrentPage(item.id)}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* ── Role Badge ── */}
      {currentUser?.role && <RoleBadge role={currentUser.role} />}

      {/* ── Footer ── */}
      <SidebarSeparator className="mx-3 bg-slate-200/60 dark:bg-slate-700/40" />
      <SidebarFooter className="p-2">
        {/* User info */}
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-emerald-500/30 dark:ring-emerald-400/30">
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-900/40 dark:text-emerald-400">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-slate-800 truncate leading-tight dark:text-slate-200">
              {currentUser?.name}
            </p>
            <p className="text-xs text-slate-400 truncate leading-tight dark:text-slate-500">
              {ROLE_LABELS[currentUser?.role ?? ""] ?? currentUser?.role}
            </p>
          </div>
        </div>

        {/* Logout button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-950/30 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 mt-0.5 rounded-lg transition-colors duration-200"
          onClick={async () => {
            // Clear Zustand store
            logout();
            // Sign out from NextAuth
            await signOut({ redirect: false });
            // Check if we're on super admin page
            const isSuperAdmin = window.location.pathname.startsWith('/superadmin');
            // Reload to show login page (stay on superadmin if that's where we are)
            if (isSuperAdmin) {
              window.location.reload();
            } else {
              window.location.href = '/';
            }
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="group-data-[collapsible=icon]:hidden">Log out</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
