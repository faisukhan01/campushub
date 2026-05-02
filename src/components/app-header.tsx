"use client";

import { useAppStore } from "@/store/app-store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Bell, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const currentUser = useAppStore((s) => s.currentUser);
  const currentPage = useAppStore((s) => s.currentPage);
  const navigationItems = useAppStore((s) => s.navigationItems);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const unreadNotificationCount = useAppStore((s) => s.unreadNotificationCount);

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
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4">
      <SidebarTrigger className="h-9 w-9 hover:bg-accent" />

      <Breadcrumb className="hidden sm:flex ml-3">
        <BreadcrumbList className="text-sm">
          {breadcrumbSegments.length > 1 ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="text-muted-foreground">
                  {breadcrumbSegments[0].label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  {breadcrumbSegments[1].label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {currentPageLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <span className="sm:hidden ml-3 text-sm font-medium truncate flex-1">
        {currentPageLabel}
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Input
          placeholder="Search..."
          className={cn("w-64 hidden md:flex h-9 rounded-md border bg-muted/50 text-sm")}
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>

        <Avatar className="h-7 w-7 ml-1">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
