"use client";

import { useAppStore } from "@/store/app-store";
import { getIcon } from "@/lib/icon-map";
import { GraduationCap, LogOut } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Nav items that should get a "New" pulsing badge
const newFeatureItems = new Set(["ai-assistant", "live-chat"]);

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

  // Split navigation into groups (first 6 main, rest secondary)
  const mainItems = navigationItems.slice(0, 6);
  const secondaryItems = navigationItems.slice(6);

  return (
    <Sidebar collapsible="icon">
      {/* Header with gradient */}
      <SidebarHeader className="px-3 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 border-0 relative overflow-hidden">
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-teal-400/20 to-emerald-500/0 animate-[gradient-shift_8s_ease-in-out_infinite]" />
        <div className="relative flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex-shrink-0 border border-white/10 transition-transform duration-200 group-data-[collapsible=icon]:scale-110">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden transition-opacity duration-200">
            <h2 className="text-sm font-bold text-white truncate leading-tight">
              CampusHub
            </h2>
            <p className="text-[10px] text-emerald-100 truncate leading-tight">
              {currentUser?.instituteName ?? "Management System"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Emerald accent line with gradient */}
      <div className="h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 opacity-50" />

      {/* Navigation */}
      <SidebarContent>
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-muted-foreground/70 text-[11px] uppercase tracking-wider font-semibold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = currentPage === item.id;
                const isNewFeature = newFeatureItems.has(item.id);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setCurrentPage(item.id)}
                      className={`relative transition-all duration-200 rounded-md mx-1 focus-ring ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 shadow-sm border-l-[3px] border-l-emerald-500"
                          : "hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20"
                      }`
                    >
                      <div className={`flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`transition-all duration-200 ${
                        isActive
                          ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                          : ""
                      }`}>
                        {item.label}
                      </span>
                      {/* New feature pulsing badge */}
                      {isNewFeature && !isActive && (
                        <span className="ml-auto mr-1 relative flex h-2 w-2 group-data-[collapsible=icon]:hidden">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </SidebarMenuButton>
                    {item.badge && item.badge > 0 && (
                      <SidebarMenuBadge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0 text-[10px]">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Animated section divider with gradient */}
        <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent dark:via-emerald-700/30" />

        {/* Secondary Navigation Group */}
        {secondaryItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-muted-foreground/70 text-[11px] uppercase tracking-wider font-semibold">
              More
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryItems.map((item) => {
                  const Icon = getIcon(item.icon);
                  const isActive = currentPage === item.id;
                  const isNewFeature = newFeatureItems.has(item.id);
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => setCurrentPage(item.id)}
                        className={`relative transition-all duration-200 rounded-md mx-1 focus-ring ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 shadow-sm border-l-[3px] border-l-emerald-500"
                            : "hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20"
                        }`
                      >
                        <div className={`flex items-center justify-center transition-all duration-200 ${
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`transition-all duration-200 ${
                          isActive
                            ? "text-emerald-700 dark:text-emerald-300 font-semibold"
                            : ""
                        }`}>
                          {item.label}
                        </span>
                        {/* New feature pulsing badge */}
                        {isNewFeature && !isActive && (
                          <span className="ml-auto mr-1 relative flex h-2 w-2 group-data-[collapsible=icon]:hidden">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                        )}
                      </SidebarMenuButton>
                      {item.badge && item.badge > 0 && (
                        <SidebarMenuBadge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0 text-[10px]">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Gradient divider between nav and footer */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent dark:via-emerald-600/20" />

      {/* Footer with subtle background */}
      <SidebarFooter className="px-2 py-2 bg-muted/30 relative">
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
        <div className="flex items-center gap-3 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="relative">
            <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-800 transition-all duration-200 hover:ring-emerald-400 dark:hover:ring-emerald-600">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
              <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Connection status green dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background breathe" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden transition-opacity duration-200">
            <p className="text-sm font-medium text-foreground truncate leading-tight">
              {currentUser?.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate leading-tight">
              {currentUser?.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 mt-1 transition-all duration-200 rounded-md mx-1"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          <span className="group-data-[collapsible=icon]:hidden">Log out</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
