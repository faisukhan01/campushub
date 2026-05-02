"use client";

import React from "react";
import { useAppStore } from "@/store/app-store";
import { getIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: { id: string; label: string; icon: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const iconElement = React.createElement(getIcon(item.icon), {
    className: "w-4 h-4",
  });

  return (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton
        isActive={isActive}
        onClick={onClick}
        className={cn(
          "border-l-2",
          isActive
            ? "border-primary bg-accent text-foreground font-medium"
            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <span className={cn(isActive ? "text-foreground" : "text-muted-foreground")}>
          {iconElement}
        </span>
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

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
      <SidebarHeader className="border-b px-3 py-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="text-sm font-semibold tracking-tight text-foreground truncate">
              CampusHub
            </h2>
            <p className="text-xs text-muted-foreground truncate leading-tight">
              {currentUser?.instituteName ?? "Management System"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] text-muted-foreground font-medium tracking-wider group-data-[collapsible=icon]:hidden">
            Menu
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
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] text-muted-foreground font-medium tracking-wider group-data-[collapsible=icon]:hidden">
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

      <SidebarSeparator />

      <SidebarFooter className="px-2 py-2">
        <div className="flex items-center gap-3 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
            <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-foreground truncate leading-tight">
              {currentUser?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate leading-tight">
              {currentUser?.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 mt-1 rounded-md mx-1"
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
