"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/app-store";
import {
  CalendarClock,
  Clock,
  MapPin,
  Timer,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ---- Types ----

type ExamType = "Midterm" | "Final" | "Quiz" | "Practical";
type ExamStatus = "Upcoming" | "In Progress" | "Completed";

interface Exam {
  id: string;
  subject: string;
  subjectCode: string;
  type: ExamType;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  room: string;
  seat: string;
  status: ExamStatus;
  totalMarks: number;
}

interface SeatInfo {
  row: number;
  col: number;
  status: "assigned" | "empty" | "conflict";
  student?: string;
}

// ---- Mock Data ----

const now = new Date();
const getDayOffset = (d: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
};

const getCurrentDayName = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[now.getDay()];
};

const getCurrentDayIndex = () => {
  const day = now.getDay();
  if (day === 0) return 4; // Sunday -> Friday index
  return day - 1; // Mon=0, Tue=1, ... Fri=4
};

const mockExams: Exam[] = [
  {
    id: "e1", subject: "Data Structures & Algorithms", subjectCode: "CS201",
    type: "Midterm", date: getDayOffset(-2), startTime: "09:00 AM", endTime: "11:00 AM",
    duration: "2h", room: "Hall A-101", seat: "R3-C5", status: "Completed", totalMarks: 50,
  },
  {
    id: "e2", subject: "Operating Systems", subjectCode: "CS301",
    type: "Midterm", date: getDayOffset(-1), startTime: "02:00 PM", endTime: "04:00 PM",
    duration: "2h", room: "Hall B-203", seat: "R5-C8", status: "Completed", totalMarks: 50,
  },
  {
    id: "e3", subject: "Machine Learning", subjectCode: "CS401",
    type: "Quiz", date: getDayOffset(0), startTime: "10:00 AM", endTime: "11:00 AM",
    duration: "1h", room: "Room C-105", seat: "R2-C3", status: "In Progress", totalMarks: 20,
  },
  {
    id: "e4", subject: "Database Management", subjectCode: "CS302",
    type: "Practical", date: getDayOffset(1), startTime: "09:00 AM", endTime: "12:00 PM",
    duration: "3h", room: "Lab D-301", seat: "WS-12", status: "Upcoming", totalMarks: 40,
  },
  {
    id: "e5", subject: "Computer Networks", subjectCode: "CS303",
    type: "Final", date: getDayOffset(2), startTime: "09:00 AM", endTime: "12:00 PM",
    duration: "3h", room: "Hall A-101", seat: "R1-C1", status: "Upcoming", totalMarks: 100,
  },
  {
    id: "e6", subject: "Software Engineering", subjectCode: "CS402",
    type: "Midterm", date: getDayOffset(3), startTime: "02:00 PM", endTime: "04:00 PM",
    duration: "2h", room: "Hall B-203", seat: "R4-C6", status: "Upcoming", totalMarks: 50,
  },
  {
    id: "e7", subject: "Data Structures & Algorithms", subjectCode: "CS201",
    type: "Final", date: getDayOffset(5), startTime: "09:00 AM", endTime: "12:00 PM",
    duration: "3h", room: "Hall A-101", seat: "R3-C5", status: "Upcoming", totalMarks: 100,
  },
  {
    id: "e8", subject: "Operating Systems", subjectCode: "CS301",
    type: "Final", date: getDayOffset(7), startTime: "02:00 PM", endTime: "05:00 PM",
    duration: "3h", room: "Hall A-102", seat: "R5-C8", status: "Upcoming", totalMarks: 100,
  },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// Seating mock data
const SEATING_ROWS = 8;
const SEATING_COLS = 10;
const ASSIGNED_SEAT = { row: 2, col: 4 };

const mockSeats: SeatInfo[][] = Array.from({ length: SEATING_ROWS }, (_, r) =>
  Array.from({ length: SEATING_COLS }, (_, c) => {
    if (r === ASSIGNED_SEAT.row && c === ASSIGNED_SEAT.col) {
      return { row: r, col: c, status: "assigned" as const, student: "Ryan Patel (You)" };
    }
    if (r === 1 && c === 6) {
      return { row: r, col: c, status: "conflict" as const, student: "Double Booked" };
    }
    const occupied = Math.random() > 0.35;
    return {
      row: r, col: c,
      status: (occupied ? "assigned" : "empty") as "assigned" | "empty",
      student: occupied ? `Student ${(r * SEATING_COLS) + c}` : undefined,
    };
  })
);

// ---- Helpers ----

function getExamTypeColor(type: ExamType): string {
  switch (type) {
    case "Midterm": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "Final": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    case "Quiz": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "Practical": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
  }
}

function getExamTypeBg(type: ExamType): string {
  switch (type) {
    case "Midterm": return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800";
    case "Final": return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    case "Quiz": return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
    case "Practical": return "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800";
  }
}

function getExamTypeDot(type: ExamType): string {
  switch (type) {
    case "Midterm": return "bg-emerald-500";
    case "Final": return "bg-red-500";
    case "Quiz": return "bg-amber-500";
    case "Practical": return "bg-purple-500";
  }
}

function getStatusBadge(status: ExamStatus) {
  switch (status) {
    case "Upcoming": return <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0 text-[10px]">Upcoming</Badge>;
    case "In Progress": return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px] animate-pulse-slow">In Progress</Badge>;
    case "Completed": return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">Completed</Badge>;
  }
}

function getCountdown(dateStr: string, timeStr: string): string {
  const target = new Date(`${dateStr}T${timeStr.replace(/ (AM|PM)/, "")}`);
  if (timeStr.includes("PM") && !timeStr.startsWith("12")) {
    target.setHours(target.getHours() + 12);
  }
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "Started";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDayFromDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
}

// ---- Countdown Timer Component ----

function CountdownTimer({ dateStr, timeStr }: { dateStr: string; timeStr: string }) {
  const [countdown, setCountdown] = useState(getCountdown(dateStr, timeStr));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(dateStr, timeStr));
    }, 60000);
    return () => clearInterval(interval);
  }, [dateStr, timeStr]);

  const isStarted = countdown === "Started";

  return (
    <span className={`text-xs font-medium ${isStarted ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`}>
      {isStarted ? <><AlertCircle className="w-3 h-3 inline mr-1" />{countdown}</> : <><Timer className="w-3 h-3 inline mr-1" />{countdown}</>}
    </span>
  );
}

// ---- Main Component ----

export function ExamSchedulePage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const [activeTab, setActiveTab] = useState("schedule");

  const upcomingExams = mockExams.filter((e) => e.status !== "Completed");
  const completedExams = mockExams.filter((e) => e.status === "Completed");
  const thisWeekExams = mockExams.filter((e) => {
    const examDate = new Date(e.date);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 5);
    return examDate >= weekStart && examDate <= weekEnd;
  });
  const uniqueSubjects = new Set(mockExams.map((e) => e.subjectCode)).size;
  const avgScore = 78;

  const isAdmin = currentRole === "InstituteAdmin" || currentRole === "SuperAdmin" || currentRole === "BranchAdmin";
  const isTeacher = currentRole === "Teacher";
  const isStudent = currentRole === "Student";
  const isParent = currentRole === "Parent";

  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Exam Schedule</h1>
            <p className="text-sm text-muted-foreground">
              {isStudent || isParent ? "View your upcoming exams and seating arrangements" : "Manage exam schedules and duties"}
            </p>
          </div>
        </div>
        {(isAdmin || isTeacher) && (
          <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-fit">
            <Plus className="w-4 h-4" /> Create Exam
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Upcoming Exams", value: upcomingExams.length, icon: CalendarClock, color: "bg-emerald-500" },
          { label: "This Week", value: thisWeekExams.length, icon: Clock, color: "bg-teal-500" },
          { label: "Total Subjects", value: uniqueSubjects, icon: BookOpen, color: "bg-amber-500" },
          { label: "Average Score", value: `${avgScore}%`, icon: TrendingUp, color: "bg-sky-500" },
        ].map((stat) => (
          <Card key={stat.label} className="stat-card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="seating">Seating</TabsTrigger>
        </TabsList>

        {/* Schedule View Tab */}
        <TabsContent value="schedule" className="mt-4">
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-emerald-500" />
                  Weekly Exam Timetable
                </CardTitle>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />Midterm</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-500" />Final</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />Quiz</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />Practical</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[640px]">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground w-20">Time</th>
                      {DAYS.map((day) => {
                        const currentDay = getCurrentDayName();
                        const isToday = day === currentDay;
                        return (
                          <th key={day} className={`text-center py-2 px-1 font-medium ${isToday ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                            <div className={`${isToday ? "bg-emerald-100 dark:bg-emerald-900/30 rounded-lg px-2 py-1" : ""}`}>
                              {day.slice(0, 3)}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((slot, slotIdx) => {
                      const examsInSlot = mockExams.filter((e) => {
                        const examDay = getDayFromDate(e.date);
                        return e.startTime === slot && DAYS.some((d) => d.startsWith(examDay));
                      });

                      return (
                        <tr key={slot} className="border-t border-border/50">
                          <td className="py-1 px-2 text-muted-foreground font-medium align-top pt-2">{slot}</td>
                          {DAYS.map((day) => {
                            const currentDay = getCurrentDayName();
                            const isToday = day === currentDay;
                            const examDayAbbr = day.slice(0, 3);
                            const exam = examsInSlot.find((e) => getDayFromDate(e.date) === examDayAbbr);

                            return (
                              <td key={day} className={`py-1 px-1 align-top ${isToday ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}>
                                {exam ? (
                                  <div className={`p-2 rounded-lg border ${exam.status === "Completed" ? "opacity-50" : ""} ${getExamTypeBg(exam.type)}`}>
                                    <p className="font-semibold text-[11px] truncate">{exam.subject.split(" ").slice(0, 2).join(" ")}</p>
                                    <p className="text-[10px] text-muted-foreground">{exam.room} · {exam.duration}</p>
                                    <Badge className={`text-[9px] mt-1 border ${getExamTypeColor(exam.type)}`}>{exam.type}</Badge>
                                  </div>
                                ) : (
                                  <div className="h-16" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View Tab */}
        <TabsContent value="list" className="mt-4 space-y-3">
          {/* Upcoming Exams */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-sky-500" />
              Upcoming Exams ({upcomingExams.length})
            </h3>
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className={`w-1.5 h-full min-h-[60px] rounded-full flex-shrink-0 sm:self-stretch ${getExamTypeDot(exam.type)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm">{exam.subject}</p>
                            <p className="text-xs text-muted-foreground">{exam.subjectCode} · {exam.totalMarks} marks</p>
                          </div>
                          <Badge className={`border text-[10px] flex-shrink-0 ${getExamTypeColor(exam.type)}`}>{exam.type}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarClock className="w-3 h-3" />{formatDate(exam.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.startTime} - {exam.endTime}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{exam.room}</span>
                          {(isStudent || isParent) && <span className="flex items-center gap-1"><Users className="w-3 h-3" />Seat: {exam.seat}</span>}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          {getStatusBadge(exam.status)}
                          {exam.status === "Upcoming" && <CountdownTimer dateStr={exam.date} timeStr={exam.startTime} />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="section-divider" />

          {/* Completed Exams */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Completed Exams ({completedExams.length})
            </h3>
            <div className="space-y-2">
              {completedExams.map((exam) => (
                <div key={exam.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 opacity-70">
                  <div className={`w-2 h-2 rounded-full ${getExamTypeDot(exam.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{exam.subject}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(exam.date)} · {exam.room}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">{exam.type}</Badge>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Seating Tab */}
        <TabsContent value="seating" className="mt-4">
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                Exam Hall Seating - {upcomingExams[0]?.subject ?? "Machine Learning"}
              </CardTitle>
              <p className="text-xs text-muted-foreground">Room: {upcomingExams[0]?.room ?? "Room C-105"} · {formatDate(upcomingExams[0]?.date ?? getDayOffset(1))}</p>
            </CardHeader>
            <CardContent>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-emerald-500" />Your Seat</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-emerald-300 dark:bg-emerald-700" />Assigned</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-muted" />Empty</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-red-500" />Conflict</div>
              </div>

              {/* Seating Grid */}
              <div className="flex flex-col items-center">
                {/* Podium */}
                <div className="mb-4 px-8 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  🏫 Front / Podium
                </div>

                <div className="space-y-1.5">
                  {mockSeats.map((row, r) => (
                    <div key={r} className="flex items-center gap-1.5">
                      <span className="w-6 text-[10px] text-muted-foreground text-right font-medium">R{r + 1}</span>
                      {row.map((seat, c) => {
                        const isYou = r === ASSIGNED_SEAT.row && c === ASSIGNED_SEAT.col;
                        let bgClass = "bg-muted";
                        if (seat.status === "assigned" && isYou) bgClass = "bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-700";
                        else if (seat.status === "assigned") bgClass = "bg-emerald-300 dark:bg-emerald-700";
                        else if (seat.status === "conflict") bgClass = "bg-red-500";

                        return (
                          <button
                            key={c}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center text-[8px] font-medium transition-colors ${bgClass} ${isYou ? "text-white font-bold" : seat.status === "conflict" ? "text-white" : "text-muted-foreground"}`}
                            title={seat.student ?? `R${r + 1}-C${c + 1}`}
                          >
                            {c + 1}
                          </button>
                        );
                      })}
                      <span className="w-6 text-[10px] text-muted-foreground text-right font-medium">R{r + 1}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    🪑 Your Assigned Seat: <span className="font-bold">R{ASSIGNED_SEAT.row + 1}-C{ASSIGNED_SEAT.col + 1}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Teacher/Admin: Exam Duty Info */}
      {(isTeacher || isAdmin) && (
        <>
          <div className="section-divider" />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                Exam Duties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { exam: "Machine Learning Quiz", date: getDayOffset(0), role: "Invigilator", hall: "Room C-105" },
                  { exam: "Database Management Practical", date: getDayOffset(1), role: "Lab Supervisor", hall: "Lab D-301" },
                  { exam: "Computer Networks Final", date: getDayOffset(2), role: "Invigilator", hall: "Hall A-101" },
                ].map((duty, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{duty.exam}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(duty.date)} · {duty.hall}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{duty.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
