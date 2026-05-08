"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Clock,
  MapPin,
  GraduationCap,
} from "lucide-react";

// ---- Types ----

type EventType = "Class" | "Exam" | "Holiday" | "Event" | "Deadline";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: Date;
  time: string;
  endTime?: string;
  description: string;
  course?: string;
  location?: string;
}

// ---- Event Type Config ----

const eventConfig: Record<
  EventType,
  { color: string; bg: string; dot: string; label: string }
> = {
  Class: {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    label: "Classes",
  },
  Exam: {
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    dot: "bg-red-500",
    label: "Exams",
  },
  Holiday: {
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    label: "Holidays",
  },
  Event: {
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
    label: "Events",
  },
  Deadline: {
    color: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
    dot: "bg-sky-500",
    label: "Deadlines",
  },
};

// ---- Mock Events ----

function generateMockEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const maxDay = Math.min(now.getDate() + 3, 28);
  const clamp = (d: number) => Math.min(d, 28);

  return [
    { id: "e1", title: "Data Structures Lecture", type: "Class", date: new Date(y, m, 2), time: "09:00", endTime: "10:30", description: "Regular lecture on Trees and Graphs", course: "CS201 - Data Structures", location: "Room 301" },
    { id: "e2", title: "Machine Learning Lab", type: "Class", date: new Date(y, m, 3), time: "14:00", endTime: "16:00", description: "Lab session on Neural Networks", course: "CS305 - Machine Learning", location: "Lab 204" },
    { id: "e3", title: "Database Systems Lecture", type: "Class", date: new Date(y, m, 5), time: "11:00", endTime: "12:30", description: "SQL Joins and Subqueries", course: "CS202 - Database Systems", location: "Room 205" },
    { id: "e4", title: "Operating Systems Lecture", type: "Class", date: new Date(y, m, now.getDate()), time: "10:00", endTime: "11:30", description: "Process Scheduling", course: "CS203 - Operating Systems", location: "Room 102" },
    { id: "e5", title: "Discrete Mathematics", type: "Class", date: new Date(y, m, 7), time: "09:00", endTime: "10:30", description: "Graph Theory fundamentals", course: "MA101 - Discrete Math", location: "Room 401" },
    { id: "e6", title: "Mid-term Exam: Algorithms", type: "Exam", date: new Date(y, m, 8), time: "10:00", endTime: "12:00", description: "Covers Chapters 1-6", course: "CS201 - Data Structures", location: "Hall A" },
    { id: "e7", title: "Quiz: Databases", type: "Exam", date: new Date(y, m, clamp(now.getDate() + 2)), time: "11:00", endTime: "11:30", description: "SQL Quiz - 20 marks", course: "CS202 - Database Systems", location: "Room 205" },
    { id: "e8", title: "Final Exam: ML", type: "Exam", date: new Date(y, m, 25), time: "10:00", endTime: "13:00", description: "Comprehensive final exam", course: "CS305 - Machine Learning", location: "Hall B" },
    { id: "e9", title: "Spring Break", type: "Holiday", date: new Date(y, m, 15), time: "00:00", description: "Spring break — No classes", location: "Campus" },
    { id: "e10", title: "Independence Day", type: "Holiday", date: new Date(y, m, 22), time: "00:00", description: "National holiday", location: "Campus" },
    { id: "e11", title: "Tech Fest 2025", type: "Event", date: new Date(y, m, 20), time: "09:00", endTime: "17:00", description: "Annual technical festival with workshops and competitions", location: "Main Auditorium" },
    { id: "e12", title: "Guest Lecture: AI Ethics", type: "Event", date: new Date(y, m, 12), time: "15:00", endTime: "16:30", description: "Talk by Dr. Smith on AI Ethics in Modern Society", location: "Seminar Hall" },
    { id: "e13", title: "Sports Day", type: "Event", date: new Date(y, m, 28), time: "08:00", endTime: "16:00", description: "Annual sports competition", location: "Sports Ground" },
    { id: "e14", title: "Assignment 3 Due", type: "Deadline", date: new Date(y, m, 10), time: "23:59", description: "ML Project Report submission", course: "CS305 - Machine Learning" },
    { id: "e15", title: "Project Proposal Due", type: "Deadline", date: new Date(y, m, 18), time: "17:00", description: "Submit project proposal to supervisor", course: "CS201 - Data Structures" },
    { id: "e16", title: "Lab Report Due", type: "Deadline", date: new Date(y, m, maxDay), time: "23:59", description: "OS Lab 5 Report submission", course: "CS203 - Operating Systems" },
  ];
}

// ---- Helpers ----

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(d: Date) {
  return isSameDay(d, new Date());
}

// Build calendar grid: Mon-Sun, up to 6 rows
function buildCalendarGrid(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  // Convert to Mon-based: Mon=0, Tue=1, ..., Sun=6
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const grid: (number | null)[] = [];
  // Leading empty cells
  for (let i = 0; i < startOffset; i++) {
    grid.push(null);
  }
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(d);
  }
  // Pad to 42 (6 rows × 7 cols)
  while (grid.length < 42) {
    grid.push(null);
  }

  return grid;
}

// ---- Main Component ----

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(generateMockEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Add event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "Class" as EventType,
    time: "09:00",
    endTime: "10:00",
    description: "",
    course: "",
    location: "",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar grid (Mon-Sun, 6 rows)
  const calendarGrid = useMemo(
    () => buildCalendarGrid(year, month),
    [year, month]
  );

  // Events for selected date
  const selectedDateEvents = useMemo(
    () => (selectedDate ? events.filter((e) => isSameDay(e.date, selectedDate)) : []),
    [events, selectedDate]
  );

  // Events for current month
  const monthEvents = useMemo(
    () => events.filter((e) => e.date.getMonth() === month && e.date.getFullYear() === year),
    [events, month, year]
  );

  // Week view dates (current week Mon-Sun)
  const weekDates = useMemo(() => {
    const ref = selectedDate ?? new Date();
    const day = ref.getDay();
    // Mon=0 ... Sun=6
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(ref);
    monday.setDate(ref.getDate() + mondayOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const navigateMonth = (dir: number) => {
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !selectedDate) return;
    const event: CalendarEvent = {
      id: `e-${Date.now()}`,
      title: newEvent.title,
      type: newEvent.type,
      date: selectedDate,
      time: newEvent.time,
      endTime: newEvent.endTime,
      description: newEvent.description,
      course: newEvent.course || undefined,
      location: newEvent.location || undefined,
    };
    setEvents((prev) => [...prev, event]);
    setAddDialogOpen(false);
    setNewEvent({ title: "", type: "Class", time: "09:00", endTime: "10:00", description: "", course: "", location: "" });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((e) => isSameDay(e.date, date));
  };

  const formatDateForInput = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-500" />
            Academic Calendar
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage your academic schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(v) => setNewEvent({ ...newEvent, type: v as EventType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(eventConfig).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Course</Label>
                    <Select
                      value={newEvent.course}
                      onValueChange={(v) => setNewEvent({ ...newEvent, course: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS201 - Data Structures">CS201 - Data Structures</SelectItem>
                        <SelectItem value="CS202 - Database Systems">CS202 - Database Systems</SelectItem>
                        <SelectItem value="CS203 - Operating Systems">CS203 - Operating Systems</SelectItem>
                        <SelectItem value="CS305 - Machine Learning">CS305 - Machine Learning</SelectItem>
                        <SelectItem value="MA101 - Discrete Math">MA101 - Discrete Math</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate ? formatDateForInput(selectedDate) : ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        const parts = e.target.value.split("-");
                        setSelectedDate(new Date(+parts[0], +parts[1] - 1, +parts[2]));
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Room or venue..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Event details..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleAddEvent}
                >
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Month Navigation */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[180px] text-center">
                {MONTHS[month]} {year}
              </h2>
              <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="hidden md:flex items-center gap-3">
                {Object.entries(eventConfig).map(([type, config]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <span className="text-[11px] text-muted-foreground">{config.label}</span>
                  </div>
                ))}
              </div>
              <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Mobile Legend */}
          <div className="flex md:hidden flex-wrap items-center gap-2 mt-2">
            {Object.entries(eventConfig).map(([type, config]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className="text-[11px] text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {view === "month" ? (
            /* Month View — 7 columns Mon-Sun, up to 6 rows */
            <div className="overflow-hidden rounded-lg border">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-muted/50">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="px-2 py-2 text-center border-b border-r last:border-r-0"
                  >
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarGrid.map((day, idx) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="min-h-[90px] sm:min-h-[110px] p-1.5 border-b border-r last:border-r-0 bg-muted/20"
                      />
                    );
                  }

                  const date = new Date(year, month, day);
                  const dayEvents = getEventsForDate(date);
                  const today = isToday(date);
                  const selected = selectedDate ? isSameDay(date, selectedDate) : false;
                  const isLastCol = idx % 7 === 6;

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`min-h-[90px] sm:min-h-[110px] p-1.5 text-left transition-colors border-b border-r last:border-r-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${
                        selected
                          ? "bg-emerald-50 dark:bg-emerald-950/20"
                          : "bg-background hover:bg-muted/30"
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {/* Date Number */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            today ? "bg-emerald-500 text-white" : "text-foreground"
                          }`}
                        >
                          {day}
                        </span>
                        {dayEvents.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Colored dots + event previews */}
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((evt) => {
                          const config = eventConfig[evt.type];
                          return (
                            <div
                              key={evt.id}
                              className="flex items-center gap-1.5"
                              title={evt.title}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
                              <span className="text-[10px] truncate text-muted-foreground leading-none">
                                {evt.time} {evt.title}
                              </span>
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Week View */
            <div className="space-y-2">
              {weekDates.map((date, i) => {
                const dayEvents = getEventsForDate(date);
                const today = isToday(date);
                const selected = selectedDate ? isSameDay(date, selectedDate) : false;

                return (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 transition-colors cursor-pointer ${
                      selected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : today
                        ? "border-emerald-300 dark:border-emerald-700"
                        : "hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-center min-w-[52px]">
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {WEEKDAYS[i]}
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            today ? "text-emerald-600 dark:text-emerald-400" : ""
                          }`}
                        >
                          {date.getDate()}
                        </p>
                      </div>
                      {today && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
                          Today
                        </Badge>
                      )}
                    </div>
                    {dayEvents.length > 0 ? (
                      <div className="space-y-1.5 ml-[52px]">
                        {dayEvents.map((evt) => {
                          const config = eventConfig[evt.type];
                          return (
                            <div
                              key={evt.id}
                              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                            >
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{evt.title}</p>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {evt.time}
                                    {evt.endTime ? ` - ${evt.endTime}` : ""}
                                  </span>
                                  {evt.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {evt.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-[10px]">
                                {evt.type}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground ml-[52px]">No events</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day Detail Panel — Below the Calendar */}
      {selectedDate && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-500" />
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {isToday(selectedDate) && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
                  Today
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedDateEvents.map((evt) => {
                  const config = eventConfig[evt.type];
                  return (
                    <div
                      key={evt.id}
                      className={`p-4 rounded-lg border ${config.bg} transition-colors`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold">{evt.title}</h3>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0">
                          {evt.type}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>
                            {evt.time}
                            {evt.endTime ? ` — ${evt.endTime}` : ""}
                          </span>
                        </div>
                        {evt.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span>{evt.location}</span>
                          </div>
                        )}
                        {evt.course && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <GraduationCap className="w-3 h-3 flex-shrink-0" />
                            <span>{evt.course}</span>
                          </div>
                        )}
                      </div>
                      {evt.description && (
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50 line-clamp-2">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No events scheduled for this date</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2"
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add an event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Monthly Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">This Month&apos;s Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(eventConfig).map(([type, config]) => {
              const count = monthEvents.filter((e) => e.type === type).length;
              return (
                <div
                  key={type}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${config.dot}`} />
                  <div>
                    <p className="text-lg font-bold">{count}</p>
                    <p className="text-[11px] text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
