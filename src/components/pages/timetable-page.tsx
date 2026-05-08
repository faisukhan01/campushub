"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Plus,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  MapPin,
  Trash2,
} from "lucide-react";

interface TimetableSlot {
  id: string;
  courseId: string;
  course: {
    id: string;
    code: string;
    title: string;
    classLevel: string;
    section: string;
  };
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  createdAt: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  classLevel: string;
  section: string;
}

const DAYS = [
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

const emptyForm = {
  courseId: "",
  dayOfWeek: "",
  startTime: "",
  endTime: "",
  room: "",
};

export function TimetablePage() {
  const { data: session } = useSession();
  const callerRole = session?.user?.role as string | undefined;

  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const canManage = callerRole === "BranchAdmin" || callerRole === "InstituteAdmin" || callerRole === "SuperAdmin";

  const fetchTimetable = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [slotsRes, coursesRes] = await Promise.all([
        fetch("/api/timetable"),
        fetch("/api/courses"),
      ]);

      if (slotsRes.ok) {
        const slotsJson = await slotsRes.json();
        setSlots(slotsJson.data ?? []);
      }

      if (coursesRes.ok) {
        const coursesJson = await coursesRes.json();
        setCourses(coursesJson.data ?? []);
      }
    } catch {
      setError("Failed to load timetable. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.courseId || !formData.dayOfWeek || !formData.startTime || !formData.endTime) {
      setFormError("Course, day, start time and end time are required.");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setFormError("End time must be after start time.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dayOfWeek: parseInt(formData.dayOfWeek),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error ?? "Failed to create slot.");
        return;
      }
      setFormSuccess("✓ Timetable slot created successfully.");
      setFormData({ ...emptyForm });
      fetchTimetable();
      setTimeout(() => {
        setAddOpen(false);
        setFormSuccess("");
      }, 1800);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this timetable slot?")) return;
    try {
      const res = await fetch(`/api/timetable?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTimetable();
      }
    } catch {
      alert("Failed to delete slot.");
    }
  };

  // Group slots by day
  const slotsByDay = DAYS.map((day) => ({
    ...day,
    slots: Array.isArray(slots) 
      ? slots
          .filter((s) => s.dayOfWeek === day.value)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
      : [],
  }));

  // Get unique time range
  const allTimes = Array.isArray(slots) ? slots.map((s) => s.startTime) : [];
  const minTime = allTimes.length > 0 ? Math.min(...allTimes.map((t) => parseInt(t.split(":")[0]))) : 8;
  const maxTime = allTimes.length > 0 ? Math.max(...allTimes.map((t) => parseInt(t.split(":")[0]))) + 2 : 17;

  const timeRange = Array.from({ length: maxTime - minTime }, (_, i) => {
    const hour = minTime + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">
            {callerRole === "Teacher"
              ? "Your teaching schedule"
              : callerRole === "Student"
              ? "Your class schedule"
              : "Manage class timetable"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchTimetable} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {canManage && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                setFormData({ ...emptyForm });
                setFormError("");
                setFormSuccess("");
                setAddOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Slot
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && slots.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No timetable set</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            {canManage
              ? "Create your first timetable slot to get started"
              : "The class timetable will be displayed here once configured by the Branch Admin"}
          </p>
          {canManage && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Slot
            </Button>
          )}
        </div>
      )}

      {/* Timetable Grid - Desktop View */}
      {!isLoading && slots.length > 0 && (
        <>
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left text-sm font-semibold min-w-[100px] sticky left-0 bg-muted/50 z-10">
                          Time
                        </th>
                        {DAYS.map((day) => (
                          <th key={day.value} className="p-3 text-center text-sm font-semibold min-w-[150px]">
                            {day.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeRange.map((time) => (
                        <tr key={time} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3 text-sm font-medium text-muted-foreground sticky left-0 bg-background z-10">
                            {time}
                          </td>
                          {DAYS.map((day) => {
                            const daySlots = Array.isArray(slots)
                              ? slots.filter(
                                  (s) =>
                                    s.dayOfWeek === day.value &&
                                    s.startTime <= time &&
                                    s.endTime > time
                                )
                              : [];
                            return (
                              <td key={day.value} className="p-2 align-top">
                                {daySlots.map((slot) => {
                                  if (slot.startTime === time) {
                                    const duration =
                                      (parseInt(slot.endTime.split(":")[0]) * 60 +
                                        parseInt(slot.endTime.split(":")[1])) -
                                      (parseInt(slot.startTime.split(":")[0]) * 60 +
                                        parseInt(slot.startTime.split(":")[1]));
                                    const rows = Math.ceil(duration / 60);

                                    return (
                                      <div
                                        key={slot.id}
                                        className="relative group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-3 hover:shadow-md transition-all"
                                        style={{ minHeight: `${rows * 60}px` }}
                                      >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                          <div className="flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-100 line-clamp-1">
                                              {slot.course.title}
                                            </span>
                                          </div>
                                          {canManage && (
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                              onClick={() => handleDelete(slot.id)}
                                            >
                                              <Trash2 className="w-3 h-3 text-destructive" />
                                            </Button>
                                          )}
                                        </div>
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                              {slot.startTime} - {slot.endTime}
                                            </span>
                                          </div>
                                          {slot.room && (
                                            <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300">
                                              <MapPin className="w-3 h-3" />
                                              <span>{slot.room}</span>
                                            </div>
                                          )}
                                          <Badge variant="secondary" className="text-[9px] mt-1">
                                            {slot.course.code}
                                          </Badge>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
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
          </div>

          {/* Timetable List - Mobile View */}
          <div className="lg:hidden space-y-4">
            {slotsByDay.map((day) => (
              <Card key={day.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {day.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {day.slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {day.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="relative group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">
                                {slot.course.title}
                              </h4>
                              <Badge variant="secondary" className="text-[10px] mt-1">
                                {slot.course.code}
                              </Badge>
                            </div>
                            {canManage && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleDelete(slot.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            {slot.room && (
                              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{slot.room}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Add Slot Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          setAddOpen(o);
          if (!o) {
            setFormData({ ...emptyForm });
            setFormError("");
            setFormSuccess("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Add Timetable Slot
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label>
                Course <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.courseId}
                onValueChange={(v) => setFormData({ ...formData, courseId: v })}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} ({course.code}) - Class {course.classLevel}
                      {course.section && ` - ${course.section}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>
                Day <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={(v) => setFormData({ ...formData, dayOfWeek: v })}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>
                  Start Time <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(v) => setFormData({ ...formData, startTime: v })}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>
                  End Time <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.endTime}
                  onValueChange={(v) => setFormData({ ...formData, endTime: v })}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Room / Location</Label>
              <Input
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g. Room 101, Lab A"
                disabled={isSaving}
              />
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {formSuccess}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSaving ? "Creating…" : "Create Slot"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
