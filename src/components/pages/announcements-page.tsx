"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import {
  mockAnnouncements,
  mockCalendarEvents,
  mockStudents,
} from "@/lib/mock-data";
import {
  Megaphone,
  Clock,
  Eye,
  AlertCircle,
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  Users,
  Star,
  CheckCheck,
  Bell,
} from "lucide-react";

// ---- Helpers ----

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date();
}

function getEventIcon(type: string) {
  switch (type) {
    case "Exam":
      return <BookOpen className="w-4 h-4" />;
    case "Event":
      return <Star className="w-4 h-4" />;
    case "Holiday":
      return <Calendar className="w-4 h-4" />;
    case "Academic":
      return <GraduationCap className="w-4 h-4" />;
    case "Meeting":
      return <Users className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
}

// ---- Component ----

export function AnnouncementsPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);

  const children = currentRole === "Parent" ? mockStudents.slice(0, 2) : [];
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? "");
  const [readAnnouncements, setReadAnnouncements] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("school");

  const isParentView = currentRole === "Parent";

  // Filter announcements for parent audience
  const schoolAnnouncements = mockAnnouncements.filter(
    (a) => a.targetAudience.includes("Parent") || a.targetAudience.includes("Student")
  );

  // Class-specific announcements (mock - filter for specific courses)
  const selectedChild = children.find((c) => c.id === selectedChildId) ?? children[0];
  const classAnnouncements = mockAnnouncements.filter(
    (a) => a.targetAudience.includes("Student") && a.targetBranches?.includes("branch-001")
  ).filter((a) => !schoolAnnouncements.some((s) => s.id === a.id)).length > 0
    ? mockAnnouncements.filter((a) => a.targetAudience.includes("Student")).slice(2, 4)
    : [];

  // Calendar events
  const upcomingEvents = mockCalendarEvents
    .filter((e) => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const exams = upcomingEvents.filter((e) => e.type === "Exam");
  const holidays = upcomingEvents.filter((e) => e.type === "Holiday");
  const otherEvents = upcomingEvents.filter(
    (e) => e.type !== "Exam" && e.type !== "Holiday"
  );

  const toggleRead = (id: string) => {
    setReadAnnouncements((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unreadSchoolCount = schoolAnnouncements.filter(
    (a) => !readAnnouncements.has(a.id)
  ).length;

  const unreadClassCount = classAnnouncements.filter(
    (a) => !readAnnouncements.has(a.id)
  ).length;

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            {isParentView
              ? "Stay updated with school news, events, and announcements"
              : "Latest news and announcements from your institution"}
          </p>
        </div>
        {isParentView && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Child:</label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 tabs-smooth">
          <TabsTrigger value="school" className="text-xs sm:text-sm gap-1">
            <Megaphone className="w-3.5 h-3.5 hidden sm:block" />
            School
            {unreadSchoolCount > 0 && (
              <Badge className="h-4 min-w-4 text-[10px] bg-emerald-600 text-white ml-1">
                {unreadSchoolCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="class" className="text-xs sm:text-sm gap-1">
            <BookOpen className="w-3.5 h-3.5 hidden sm:block" />
            Class
            {unreadClassCount > 0 && (
              <Badge className="h-4 min-w-4 text-[10px] bg-emerald-600 text-white ml-1">
                {unreadClassCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs sm:text-sm gap-1">
            <Calendar className="w-3.5 h-3.5 hidden sm:block" />
            Events
          </TabsTrigger>
        </TabsList>

        {/* School Announcements */}
        <TabsContent value="school" className="mt-4">
          <div className="space-y-4">
            {schoolAnnouncements.map((announcement) => {
              const isRead = readAnnouncements.has(announcement.id);
              return (
                <Card
                  key={announcement.id}
                  className={`card-premium cursor-pointer ${
                    !isRead ? "border-l-4 border-l-emerald-500" : ""
                  }`}
                  onClick={() => toggleRead(announcement.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          announcement.isImportant
                            ? "bg-red-100 dark:bg-red-900/30"
                            : isRead
                              ? "bg-muted/50"
                              : "bg-emerald-100 dark:bg-emerald-900/30"
                        }`}
                      >
                        <Megaphone
                          className={`w-5 h-5 ${
                            announcement.isImportant
                              ? "text-red-600 dark:text-red-400"
                              : isRead
                                ? "text-muted-foreground"
                                : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {announcement.isImportant && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-0.5" />
                              Important
                            </Badge>
                          )}
                          {!isRead && (
                            <Badge className="text-xs bg-emerald-600 text-white">
                              New
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {announcement.authorRole}
                          </span>
                        </div>
                        <h3
                          className={`text-base font-semibold ${
                            isRead ? "text-muted-foreground" : ""
                          }`}
                        >
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(announcement.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {announcement.viewsCount} views
                          </span>
                          <span>{announcement.authorName}</span>
                          {isRead && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <CheckCheck className="w-3 h-3" />
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Class-specific Announcements */}
        <TabsContent value="class" className="mt-4">
          {selectedChild && (
            <div className="mb-4">
              <Badge variant="outline" className="text-xs">
                Showing announcements for: {selectedChild.name} ({selectedChild.programName})
              </Badge>
            </div>
          )}
          {classAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {classAnnouncements.map((announcement) => {
                const isRead = readAnnouncements.has(announcement.id);
                return (
                  <Card
                    key={announcement.id}
                    className={`card-premium cursor-pointer ${
                      !isRead ? "border-l-4 border-l-emerald-500" : ""
                    }`}
                    onClick={() => toggleRead(announcement.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            announcement.isImportant
                              ? "bg-red-100 dark:bg-red-900/30"
                              : isRead
                                ? "bg-muted/50"
                                : "bg-emerald-100 dark:bg-emerald-900/30"
                          }`}
                        >
                          <BookOpen
                            className={`w-5 h-5 ${
                              announcement.isImportant
                                ? "text-red-600 dark:text-red-400"
                                : isRead
                                  ? "text-muted-foreground"
                                  : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {!isRead && (
                              <Badge className="text-xs bg-emerald-600 text-white">
                                New
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {selectedChild?.batchName ?? "Class"}
                            </Badge>
                          </div>
                          <h3
                            className={`text-base font-semibold ${
                              isRead ? "text-muted-foreground" : ""
                            }`}
                          >
                            {announcement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {announcement.content}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDateShort(announcement.createdAt)}
                            </span>
                            <span>{announcement.authorName}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BookOpen className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No class-specific announcements</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Event Calendar */}
        <TabsContent value="calendar" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Exams */}
            {exams.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-red-500" />
                    Exam Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exams.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
                      >
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(event.startDate)}
                            {event.startDate !== event.endDate &&
                              ` - ${formatDateShort(event.endDate)}`}
                          </p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {event.description}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Holidays */}
            {holidays.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Holidays & Breaks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {holidays.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(event.startDate)}
                            {event.startDate !== event.endDate &&
                              ` - ${formatDateShort(event.endDate)}`}
                          </p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other Events */}
            {otherEvents.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 text-emerald-500" />
                    Upcoming Events & Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {otherEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: `${event.color}15`,
                          }}
                        >
                          <span style={{ color: event.color }}>
                            {getEventIcon(event.type)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(event.startDate)}
                            {event.allDay ? "" : " (Timed)"}
                          </p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {event.description}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {event.location}
                            </p>
                          )}
                          <Badge variant="outline" className="text-[10px] mt-1">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
