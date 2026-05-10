"use client";

import { useAppStore } from "@/store/app-store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, Moon, Search, Sun, User, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  SuperAdmin: "Super Admin",
  InstituteAdmin: "Institute Admin",
  BranchAdmin: "Branch Admin",
  Teacher: "Teacher",
  Student: "Student",
};

export function AppHeader() {
  const currentUser = useAppStore((s) => s.currentUser);
  const currentPage = useAppStore((s) => s.currentPage);
  const navigationItems = useAppStore((s) => s.navigationItems);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const unreadNotificationCount = useAppStore((s) => s.unreadNotificationCount);
  const logout = useAppStore((s) => s.logout);

  const currentPageLabel =
    navigationItems.find((item) => item.id === currentPage)?.label ?? "Dashboard";

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const breadcrumbSegments: { label: string; isCurrent: boolean }[] =
    currentPageLabel.includes(" ")
      ? currentPageLabel.split(" ").length > 1
        ? [
            { label: currentPageLabel.split(" ")[0], isCurrent: false },
            { label: currentPageLabel.split(" ").slice(1).join(" "), isCurrent: true },
          ]
        : [{ label: currentPageLabel, isCurrent: true }]
      : [{ label: currentPageLabel, isCurrent: true }];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700/50 dark:bg-[#0a0f1a]/80">
      {/* ── Left Section ── */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors duration-200" />

        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList className="text-sm">
            {breadcrumbSegments.length > 1 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="#"
                    className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-150"
                  >
                    {breadcrumbSegments[0].label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-300 dark:text-slate-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-slate-800 dark:text-slate-100">
                    {breadcrumbSegments[1].label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-slate-800 dark:text-slate-100">
                  {currentPageLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <span className="sm:hidden text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
          {currentPageLabel}
        </span>
      </div>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-1.5">
        {/* Search Input */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search..."
            className={cn(
              "h-8 w-56 pl-8 pr-14 text-sm rounded-lg",
              "bg-slate-50 border-slate-200/80 text-slate-700 placeholder:text-slate-400",
              "focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20",
              "dark:bg-slate-800/50 dark:border-slate-700/60 dark:text-slate-200 dark:placeholder:text-slate-500",
              "dark:focus:bg-slate-800 dark:focus:border-emerald-600/50 dark:focus:ring-emerald-500/20",
              "transition-all duration-200"
            )}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </div>

        {/* Search button on mobile */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 md:hidden transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="md:hidden">Search</TooltipContent>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {theme === "light" ? "Dark mode" : "Light mode"}
          </TooltipContent>
        </Tooltip>

        {/* Notification Bell */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications</TooltipContent>
        </Tooltip>

        {/* User Avatar & Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 gap-2 rounded-lg pl-1.5 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 ml-0.5"
            >
              <Avatar className="h-6.5 w-6.5 ring-1 ring-slate-200 dark:ring-slate-700">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold dark:bg-emerald-900/40 dark:text-emerald-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline-block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                {currentUser?.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-slate-400" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-slate-400" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
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
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
