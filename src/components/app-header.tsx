"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/app-store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  ClipboardCheck,
  Award,
  CreditCard,
  Megaphone,
  FileEdit,
  MessageSquare,
  Settings as SettingsIcon,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Check,
  X,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Mock Notifications ----
const mockNotifications = [
  { id: "n1", category: "Grades", title: "Grade Published", description: "Your grade for Data Structures midterm has been published", time: "5 min ago", isRead: false },
  { id: "n2", category: "Attendance", title: "Low Attendance Alert", description: "Your attendance in Algorithms is below 75% threshold", time: "1 hour ago", isRead: false },
  { id: "n3", category: "Fees", title: "Fee Payment Due", description: "Tuition fee installment #3 is due in 3 days", time: "2 hours ago", isRead: false },
  { id: "n4", category: "Assignments", title: "New Assignment Posted", description: "Binary Trees assignment due next Friday", time: "3 hours ago", isRead: false },
  { id: "n5", category: "Announcements", title: "Campus Event", description: "Annual Sports Day scheduled for next Saturday", time: "5 hours ago", isRead: false },
  { id: "n6", category: "Messages", title: "Message from Prof. Rodriguez", description: "Please come to office hours regarding your project", time: "Yesterday", isRead: false },
  { id: "n7", category: "Grades", title: "Quiz Results Available", description: "DBMS quiz #4 results are now available", time: "Yesterday", isRead: false },
  { id: "n8", category: "System", title: "System Maintenance", description: "Scheduled maintenance this weekend, 2AM-6AM", time: "2 days ago", isRead: true },
  { id: "n9", category: "Announcements", title: "Library Hours Update", description: "Extended library hours during exam week", time: "3 days ago", isRead: true },
  { id: "n10", category: "Fees", title: "Receipt Generated", description: "Payment receipt for installment #2 is available", time: "4 days ago", isRead: true },
];

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Attendance: { icon: ClipboardCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  Grades: { icon: Award, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  Fees: { icon: CreditCard, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  Announcements: { icon: Megaphone, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40" },
  Assignments: { icon: FileEdit, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40" },
  Messages: { icon: MessageSquare, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-100 dark:bg-teal-900/40" },
  System: { icon: SettingsIcon, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-900/40" },
};

// ---- Mock Search Items ----
const mockSearchItems = [
  { type: "course", title: "Data Structures & Algorithms", subtitle: "CS-201 · Prof. Rodriguez · Section A", icon: BookOpen },
  { type: "course", title: "Database Management Systems", subtitle: "CS-301 · Dr. Ahmed · Section B", icon: BookOpen },
  { type: "course", title: "Web Development", subtitle: "CS-401 · Prof. Khan · Section A", icon: BookOpen },
  { type: "course", title: "Operating Systems", subtitle: "CS-302 · Dr. Ali · Section A", icon: BookOpen },
  { type: "student", title: "Ryan Patel", subtitle: "BS-CS · Semester 4 · Roll #2024-001", icon: GraduationCap },
  { type: "student", title: "Sarah Ahmed", subtitle: "BS-CS · Semester 4 · Roll #2024-003", icon: GraduationCap },
  { type: "student", title: "Ali Hassan", subtitle: "BBA · Semester 2 · Roll #2024-010", icon: GraduationCap },
  { type: "assignment", title: "Binary Trees Implementation", subtitle: "CS-201 · Due: Oct 25 · 100 marks", icon: FileEdit },
  { type: "assignment", title: "ER Diagram Design", subtitle: "CS-301 · Due: Oct 28 · 50 marks", icon: FileEdit },
  { type: "announcement", title: "Midterm Exam Schedule", subtitle: "Published by Admin · Oct 15", icon: Megaphone },
  { type: "announcement", title: "Campus Sports Day", subtitle: "Published by Admin · Oct 20", icon: Megaphone },
];

const categoryTypeConfig: Record<string, { color: string; bg: string }> = {
  course: { color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  student: { color: "text-sky-700 dark:text-sky-300", bg: "bg-sky-100 dark:bg-sky-900/40" },
  assignment: { color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40" },
  announcement: { color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-100 dark:bg-amber-900/40" },
};

// ---- Notification Panel ----
function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="w-80 sm:w-96">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0 text-[10px] px-1.5">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1 transition-colors"
          >
            <Check className="w-3 h-3" />
            Mark all read
          </button>
        )}
      </div>
      <ScrollArea className="max-h-80">
        <div className="divide-y">
          {notifications.slice(0, 8).map((notif) => {
            const config = categoryConfig[notif.category] ?? categoryConfig.System;
            const Icon = config.icon;
            return (
              <button
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-200",
                  notif.isRead 
                    ? "hover:bg-muted/50" 
                    : "bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/15"
                )}
              >
                <div className={cn("flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 transition-transform duration-200", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm leading-tight transition-all duration-200", !notif.isRead && "font-semibold")}>
                      {notif.title}
                    </p>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{notif.time}</p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="border-t px-4 py-2.5">
        <button className="w-full text-center text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  );
}

// ---- Search Panel ----
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return mockSearchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const item of filtered) {
      const label = item.type.charAt(0).toUpperCase() + item.type.slice(1) + "s";
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="w-80 sm:w-[420px]">
      <div className="flex items-center gap-2 px-3 pb-3 border-b">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, students, assignments..."
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/60"
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <ScrollArea className="max-h-72">
        {!query.trim() ? (
          <div className="px-4 py-8 text-center">
            <div className="empty-state-icon mx-auto !mb-3">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">Type to search across the system</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Courses, students, assignments, announcements
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="empty-state-icon mx-auto !mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">No results found for &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <div className="py-1">
            {Object.entries(grouped).map(([groupLabel, items]) => (
              <div key={groupLabel}>
                <div className="px-3 py-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    {groupLabel}
                  </span>
                </div>
                {items.map((item, i) => {
                  const Icon = item.icon;
                  const typeConf = categoryTypeConfig[item.type] ?? categoryTypeConfig.course;
                  return (
                    <button
                      key={`${item.type}-${i}`}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <div className={cn("flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center", typeConf.bg)}>
                        <Icon className={cn("w-4 h-4", typeConf.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ---- Main Header ----
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

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 relative">
      {/* Animated gradient bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className="absolute inset-0 animate-[header-gradient-shift_4s_ease-in-out_infinite]"
          style={{
            background: 'linear-gradient(90deg, #059669, #0d9488, #10b981, #14b8a6, #059669)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
      
      <SidebarTrigger className="-ml-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors rounded-md" />

      {/* Breadcrumb */}
      <Separator orientation="vertical" className="h-5 mx-1 hidden sm:block" />
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium">{currentPageLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Mobile page title */}
      <span className="sm:hidden text-sm font-medium truncate flex-1">
        {currentPageLabel}
      </span>

      <div className="flex-1" />

      {/* Search */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="hidden md:flex relative max-w-xs w-full cursor-pointer group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-hover:text-emerald-500" />
            <div className="w-full pl-9 pr-3 h-9 text-sm bg-muted/50 border border-input rounded-lg flex items-center text-muted-foreground hover:bg-muted/70 hover:border-emerald-500/30 transition-all duration-200 group-hover:shadow-sm group-hover:shadow-emerald-500/5">
              Search...
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 w-auto" sideOffset={8}>
          <SearchPanel onClose={() => {}} />
        </PopoverContent>
      </Popover>

      {/* Mobile search icon */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors rounded-md">
            <Search className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 w-auto" sideOffset={8}>
          <SearchPanel onClose={() => {}} />
        </PopoverContent>
      </Popover>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors rounded-md"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors group rounded-md">
            <Bell className="h-4 w-4 transition-transform duration-300 group-hover:animate-bounce" />
            {unreadNotificationCount > 0 && (
              <Badge className="badge-pulse absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 w-auto" sideOffset={8}>
          <NotificationPanel />
        </PopoverContent>
      </Popover>

      {/* User dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 gap-2 px-2 max-w-[180px] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors rounded-md">
            <div className="relative">
              <Avatar className="h-7 w-7 ring-1 ring-emerald-200 dark:ring-emerald-800 transition-all duration-200 hover:ring-2 hover:ring-emerald-400 dark:hover:ring-emerald-600">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background breathe" />
            </div>
            <span className="hidden lg:block text-sm truncate">{currentUser?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-emerald-50 dark:hover:bg-emerald-950/20 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 cursor-pointer transition-colors">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-emerald-50 dark:hover:bg-emerald-950/20 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 cursor-pointer transition-colors">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="text-destructive focus:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
