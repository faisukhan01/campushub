"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { mockTimetable } from "@/lib/mock-data";
import { getTimetable } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import type { TimetableSlot } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  List,
  Grid3X3,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const COURSE_COLORS: Record<string, string> = {
  "CS201": "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
  "CS202": "bg-violet-100 dark:bg-violet-900/30 border-violet-200 dark:border-violet-800 text-violet-800 dark:text-violet-200",
  "MATH301": "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
  "BA301": "bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800 text-pink-800 dark:text-pink-200",
  "EE401": "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200",
};

function getSlotStyle(slot: TimetableSlot): string {
  return COURSE_COLORS[slot.courseCode] || "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800";
}

function getSlotBg(slot: TimetableSlot): string {
  const bgMap: Record<string, string> = {
    "CS201": "bg-emerald-50 dark:bg-emerald-950/50",
    "CS202": "bg-violet-50 dark:bg-violet-950/50",
    "MATH301": "bg-amber-50 dark:bg-amber-950/50",
    "BA301": "bg-pink-50 dark:bg-pink-950/50",
    "EE401": "bg-cyan-50 dark:bg-cyan-950/50",
  };
  return bgMap[slot.courseCode] || "bg-muted/30";
}

export function TimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>(() => mockTimetable.filter(s => s.batchId === "batch-001"));
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("weekly");
  const [courseFilter, setCourseFilter] = useState("all");

  const studentSlots = useMemo(() => {
    return slots.filter((s) => s.batchId === "batch-001");
  }, [slots]);

  const filtered = useMemo(() => {
    if (courseFilter === "all") return studentSlots;
    return studentSlots.filter((s) => s.courseId === courseFilter);
  }, [studentSlots, courseFilter]);

  const todaySlots = useMemo(() => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = dayNames[new Date().getDay()];
    return filtered.filter((s) => s.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filtered]);

  const uniqueCourses = useMemo(() => {
    const set = new Set(studentSlots.map((s) => s.courseId));
    return studentSlots.filter((s) => set.delete(s.courseId));
  }, [studentSlots]);

  const getSlotForCell = (day: string, time: string) => {
    return filtered.find((s) => {
      if (s.day !== day) return false;
      const slotStart = parseInt(s.startTime.split(":")[0]);
      const slotEnd = parseInt(s.endTime.split(":")[0]);
      const hour = parseInt(time.split(":")[0]);
      return hour >= slotStart && hour < slotEnd;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1"><Download className="w-3 h-3" /> Export ICS</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {uniqueCourses.map((c) => (
              <SelectItem key={c.courseId} value={c.courseId}>{c.courseCode} - {c.courseName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="weekly" className="gap-1"><Grid3X3 className="w-3 h-3" /> Weekly</TabsTrigger>
          <TabsTrigger value="daily" className="gap-1"><List className="w-3 h-3" /> Today</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="w-20 p-2 text-xs font-medium text-muted-foreground border-b sticky left-0 bg-background">Time</th>
                      {DAYS.map((day) => (
                        <th key={day} className={cn("p-2 text-xs font-medium text-muted-foreground border-b text-center min-w-[140px]",
                          day === "Saturday" && "hidden sm:table-cell"
                        )}>
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map((time) => (
                      <tr key={time} className="border-b last:border-0">
                        <td className="p-2 text-xs font-medium text-muted-foreground border-r sticky left-0 bg-background">
                          {time}
                        </td>
                        {DAYS.map((day) => {
                          const slot = getSlotForCell(day, time);
                          return (
                            <td key={day} className={cn("p-1 border-b border-r align-top h-20",
                              day === "Saturday" && "hidden sm:table-cell"
                            )}>
                              {slot && (
                                <div className={cn("p-2 rounded-md border text-xs h-full", getSlotStyle(slot))}>
                                  <p className="font-semibold text-[11px] truncate">{slot.courseCode}</p>
                                  <p className="text-[10px] truncate opacity-80">{slot.courseName}</p>
                                  <div className="flex items-center gap-1 mt-1 opacity-70">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>{slot.startTime}-{slot.endTime}</span>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-70">
                                    <MapPin className="w-2.5 h-2.5" />
                                    <span>{slot.roomName}</span>
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          {todaySlots.length === 0 ? (
            <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">No classes today</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot) => (
                <Card key={slot.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-stretch">
                      <div className="w-1 flex-shrink-0" style={{ backgroundColor: slot.color || "#10b981" }} />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs font-mono">{slot.courseCode}</Badge>
                              <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>
                            </div>
                            <h3 className="text-base font-semibold">{slot.courseName}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {slot.startTime} - {slot.endTime}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {slot.roomName}</span>
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {slot.teacherName}</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: slot.color + "20" }}>
                            <Calendar className="w-5 h-5" style={{ color: slot.color }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
