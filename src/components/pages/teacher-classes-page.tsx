"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap, BookOpen, Loader2, RefreshCw,
  ClipboardCheck, Megaphone, BookText, FileVideo,
  CheckCircle2, XCircle, AlertCircle, Clock, Send, Link,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TeacherCourse {
  id: string;
  code: string;
  title: string;
  subjectType: string;
  classLevel: string | null;
  section: string | null;
  enrollmentCount: number;
}

interface ClassGroup {
  grade: string;
  section: string;
  label: string;
  courses: TeacherCourse[];
  studentCount: number;
}

interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  rollNumber: string | null;
  avatar: string | null;
}

interface AttendanceRecord {
  studentId: string;
  status: "Present" | "Absent" | "Late";
}

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  type: string;
  courseId: string | null;
  createdAt: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GRADE_META: Record<string, { bg: string; color: string }> = {
  "1":  { bg: "bg-rose-50 dark:bg-rose-950/30",      color: "text-rose-700 dark:text-rose-400" },
  "2":  { bg: "bg-orange-50 dark:bg-orange-950/30",  color: "text-orange-700 dark:text-orange-400" },
  "3":  { bg: "bg-amber-50 dark:bg-amber-950/30",    color: "text-amber-700 dark:text-amber-400" },
  "4":  { bg: "bg-yellow-50 dark:bg-yellow-950/30",  color: "text-yellow-700 dark:text-yellow-400" },
  "5":  { bg: "bg-lime-50 dark:bg-lime-950/30",      color: "text-lime-700 dark:text-lime-400" },
  "6":  { bg: "bg-emerald-50 dark:bg-emerald-950/30",color: "text-emerald-700 dark:text-emerald-400" },
  "7":  { bg: "bg-teal-50 dark:bg-teal-950/30",      color: "text-teal-700 dark:text-teal-400" },
  "8":  { bg: "bg-cyan-50 dark:bg-cyan-950/30",      color: "text-cyan-700 dark:text-cyan-400" },
  "9":  { bg: "bg-sky-50 dark:bg-sky-950/30",        color: "text-sky-700 dark:text-sky-400" },
  "10": { bg: "bg-blue-50 dark:bg-blue-950/30",      color: "text-blue-700 dark:text-blue-400" },
  "11": { bg: "bg-violet-50 dark:bg-violet-950/30",  color: "text-violet-700 dark:text-violet-400" },
  "12": { bg: "bg-purple-50 dark:bg-purple-950/30",  color: "text-purple-700 dark:text-purple-400" },
};

function getMeta(grade: string) {
  return GRADE_META[grade] ?? { bg: "bg-slate-50 dark:bg-slate-950/30", color: "text-slate-700 dark:text-slate-400" };
}

const STATUS_CYCLE: Record<string, "Present" | "Absent" | "Late"> = {
  Present: "Absent",
  Absent: "Late",
  Late: "Present",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeacherClassesPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sheet state
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("attendance");

  // Attendance tab state
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, "Present" | "Absent" | "Late">>({});
  const [submittingAttendance, setSubmittingAttendance] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Announcements/Diary/Materials shared state
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loadingAnn, setLoadingAnn] = useState(false);

  // Post form state
  const [annForm, setAnnForm] = useState({ title: "", content: "", courseId: "all" });
  const [diaryForm, setDiaryForm] = useState({ title: "", content: "", courseId: "all" });
  const [materialForm, setMaterialForm] = useState({ title: "", content: "", link: "", courseId: "all" });
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  // ── Fetch teacher's courses & group by class ──────────────────────────────

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      const courses: TeacherCourse[] = (data.data ?? data) as TeacherCourse[];

      // Group by classLevel + section
      const map = new Map<string, ClassGroup>();
      for (const c of courses) {
        const grade = c.classLevel ?? "?";
        const section = c.section ?? "";
        const key = `${grade}__${section}`;
        if (!map.has(key)) {
          const label = section ? `Class ${grade} — ${section}` : `Class ${grade}`;
          map.set(key, { grade, section, label, courses: [], studentCount: 0 });
        }
        const grp = map.get(key)!;
        grp.courses.push(c);
        grp.studentCount += c.enrollmentCount ?? 0;
      }

      const sorted = Array.from(map.values()).sort((a, b) => {
        const na = parseInt(a.grade) || 0;
        const nb = parseInt(b.grade) || 0;
        return na !== nb ? na - nb : a.section.localeCompare(b.section);
      });

      setClasses(sorted);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  // ── Open class sheet ──────────────────────────────────────────────────────

  const openSheet = useCallback((cls: ClassGroup) => {
    setSelectedClass(cls);
    setSheetOpen(true);
    setActiveTab("attendance");
    setSelectedCourseId(cls.courses[0]?.id ?? "");
    setEnrolledStudents([]);
    setAttendance({});
    setAttendanceSuccess(false);
    setAnnouncements([]);
    setAnnForm({ title: "", content: "", courseId: "all" });
    setDiaryForm({ title: "", content: "", courseId: "all" });
    setMaterialForm({ title: "", content: "", link: "", courseId: "all" });
    setPostSuccess(null);
  }, []);

  // ── Load students when course selected ───────────────────────────────────

  const loadStudents = useCallback(async (courseId: string) => {
    if (!courseId) return;
    setLoadingStudents(true);
    setEnrolledStudents([]);
    setAttendance({});
    try {
      const res = await fetch(`/api/enrollments?courseId=${courseId}`);
      const data = await res.json();
      const enrollments = data.data ?? [];
      const students: EnrolledStudent[] = enrollments.map((e: { student: EnrolledStudent }) => e.student);
      setEnrolledStudents(students);
      // Default everyone to Present
      const defaultAtt: Record<string, "Present" | "Absent" | "Late"> = {};
      for (const s of students) defaultAtt[s.id] = "Present";
      setAttendance(defaultAtt);
    } catch {
      // silent
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseId) loadStudents(selectedCourseId);
  }, [selectedCourseId, loadStudents]);

  // ── Load announcements when sheet opens or tab changes ────────────────────

  const loadAnnouncements = useCallback(async (cls: ClassGroup) => {
    setLoadingAnn(true);
    try {
      const courseIds = cls.courses.map(c => c.id);
      // Fetch per first course (or could fetch all and merge)
      const results: AnnouncementItem[] = [];
      for (const cid of courseIds) {
        const res = await fetch(`/api/announcements?courseId=${cid}`);
        const data = await res.json();
        if (data.success) results.push(...(data.data ?? []));
      }
      // Deduplicate
      const seen = new Set<string>();
      setAnnouncements(results.filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      // silent
    } finally {
      setLoadingAnn(false);
    }
  }, []);

  useEffect(() => {
    if (selectedClass && (activeTab === "announcements" || activeTab === "diary" || activeTab === "materials")) {
      loadAnnouncements(selectedClass);
    }
  }, [activeTab, selectedClass, loadAnnouncements]);

  // ── Submit attendance ─────────────────────────────────────────────────────

  const submitAttendance = async () => {
    if (!selectedCourseId || enrolledStudents.length === 0) return;
    setSubmittingAttendance(true);
    try {
      const records = enrolledStudents.map(s => ({
        studentId: s.id,
        status: attendance[s.id] ?? "Present",
      }));
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourseId, date: attendanceDate, records }),
      });
      if (!res.ok) throw new Error("Failed");
      setAttendanceSuccess(true);
      setTimeout(() => setAttendanceSuccess(false), 3000);
    } catch {
      // silent
    } finally {
      setSubmittingAttendance(false);
    }
  };

  // ── Submit announcement/diary/material ────────────────────────────────────

  const submitPost = async (type: "General" | "Diary" | "Material") => {
    const form = type === "General" ? annForm : type === "Diary" ? diaryForm : materialForm;
    if (!form.title.trim() || !form.content.trim()) return;

    setSubmitting(type);
    try {
      const courseId = form.courseId !== "all" ? form.courseId : (selectedClass?.courses[0]?.id ?? null);
      const body: Record<string, unknown> = {
        title: form.title,
        content: form.content,
        type,
        courseId,
      };
      if (type === "Material" && (form as typeof materialForm).link) {
        body.link = (form as typeof materialForm).link;
      }

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");

      setPostSuccess(type);
      setTimeout(() => setPostSuccess(null), 3000);

      // Reset form
      if (type === "General") setAnnForm({ title: "", content: "", courseId: "all" });
      else if (type === "Diary") setDiaryForm({ title: "", content: "", courseId: "all" });
      else setMaterialForm({ title: "", content: "", link: "", courseId: "all" });

      // Reload
      if (selectedClass) loadAnnouncements(selectedClass);
    } catch {
      // silent
    } finally {
      setSubmitting(null);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const toggleStatus = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: STATUS_CYCLE[prev[studentId]] ?? "Present",
    }));
  };

  const statusIcon = (status: "Present" | "Absent" | "Late") => {
    if (status === "Present") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === "Absent") return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  const statusBadge = (status: "Present" | "Absent" | "Late") => {
    if (status === "Present") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
    if (status === "Absent") return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });

  const filterByType = (type: string) => announcements.filter(a => a.type === type);

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchClasses}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Classes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {currentUser?.name} · {classes.length} {classes.length === 1 ? "class" : "classes"} assigned
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchClasses}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Class Grid */}
      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-muted-foreground">
          <BookOpen className="w-12 h-12 opacity-30" />
          <p className="text-sm">No classes assigned yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {classes.map(cls => {
            const meta = getMeta(cls.grade);
            return (
              <Card
                key={`${cls.grade}__${cls.section}`}
                className="cursor-pointer hover:shadow-lg hover:border-emerald-500 transition-all duration-200 group"
                onClick={() => openSheet(cls)}
              >
                <CardContent className="p-5 text-center">
                  <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500 transition-colors`}>
                    <span className={`text-xl font-bold ${meta.color} group-hover:text-white transition-colors`}>
                      {cls.grade}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-1">Class {cls.grade}{cls.section ? ` — ${cls.section}` : ""}</p>
                  <div className="flex justify-center gap-2 text-[10px] text-muted-foreground">
                    <span>{cls.studentCount} students</span>
                    <span>·</span>
                    <span>{cls.courses.length} subjects</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          {selectedClass && (
            <>
              <SheetHeader className="px-6 py-5 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${getMeta(selectedClass.grade).bg} flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${getMeta(selectedClass.grade).color}`}>{selectedClass.grade}</span>
                  </div>
                  <div>
                    <SheetTitle className="text-base">{selectedClass.label}</SheetTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedClass.studentCount} students · {selectedClass.courses.length} subjects
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
                <TabsList className="mx-6 mt-4 grid grid-cols-4 w-auto">
                  <TabsTrigger value="attendance" className="text-xs gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5" />Attendance
                  </TabsTrigger>
                  <TabsTrigger value="announcements" className="text-xs gap-1.5">
                    <Megaphone className="w-3.5 h-3.5" />Announcements
                  </TabsTrigger>
                  <TabsTrigger value="diary" className="text-xs gap-1.5">
                    <BookText className="w-3.5 h-3.5" />Diary
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="text-xs gap-1.5">
                    <FileVideo className="w-3.5 h-3.5" />Materials
                  </TabsTrigger>
                </TabsList>

                {/* ── Attendance Tab ── */}
                <TabsContent value="attendance" className="flex-1 min-h-0 mt-4">
                  <ScrollArea className="h-full px-6 pb-6">
                    <div className="space-y-4">
                      {/* Controls */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Subject</Label>
                          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedClass.courses.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Date</Label>
                          <Input
                            type="date"
                            value={attendanceDate}
                            onChange={e => setAttendanceDate(e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Legend */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Present</span>
                        <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-500" />Absent</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" />Late</span>
                        <span className="ml-auto italic">Tap a row to cycle status</span>
                      </div>

                      {/* Student list */}
                      {loadingStudents ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                      ) : enrolledStudents.length === 0 ? (
                        <div className="flex flex-col items-center py-8 gap-2 text-muted-foreground">
                          <GraduationCap className="w-8 h-8 opacity-30" />
                          <p className="text-sm">No students enrolled in this subject.</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {enrolledStudents.map((student, idx) => {
                            const status = attendance[student.id] ?? "Present";
                            return (
                              <div
                                key={student.id}
                                onClick={() => toggleStatus(student.id)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                              >
                                <span className="text-xs text-muted-foreground w-5 text-right">{idx + 1}</span>
                                <Avatar className="w-7 h-7">
                                  <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700">
                                    {student.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{student.name}</p>
                                  {student.rollNumber && (
                                    <p className="text-[10px] text-muted-foreground">{student.rollNumber}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {statusIcon(status)}
                                  <Badge className={`text-[10px] px-2 py-0 ${statusBadge(status)}`}>{status}</Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Summary + submit */}
                      {enrolledStudents.length > 0 && (
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span className="text-emerald-600 font-medium">
                              {Object.values(attendance).filter(s => s === "Present").length} P
                            </span>
                            <span className="text-red-600 font-medium">
                              {Object.values(attendance).filter(s => s === "Absent").length} A
                            </span>
                            <span className="text-amber-600 font-medium">
                              {Object.values(attendance).filter(s => s === "Late").length} L
                            </span>
                          </div>
                          {attendanceSuccess ? (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Saved!
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={submitAttendance}
                              disabled={submittingAttendance}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {submittingAttendance ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-1.5" />Submit</>}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* ── Announcements Tab ── */}
                <TabsContent value="announcements" className="flex-1 min-h-0 mt-4">
                  <ScrollArea className="h-full px-6 pb-6">
                    <div className="space-y-4">
                      {/* Post form */}
                      <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
                        <p className="text-sm font-medium">New Announcement</p>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Subject (optional)</Label>
                          <Select value={annForm.courseId} onValueChange={v => setAnnForm(p => ({ ...p, courseId: v }))}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="All subjects" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All subjects</SelectItem>
                              {selectedClass.courses.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title</Label>
                          <Input
                            value={annForm.title}
                            onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))}
                            placeholder="Announcement title"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Message</Label>
                          <Textarea
                            value={annForm.content}
                            onChange={e => setAnnForm(p => ({ ...p, content: e.target.value }))}
                            placeholder="Write your announcement..."
                            rows={3}
                            className="text-sm resize-none"
                          />
                        </div>
                        <div className="flex justify-end">
                          {postSuccess === "General" ? (
                            <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Posted!
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => submitPost("General")}
                              disabled={submitting === "General"}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {submitting === "General" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-1.5" />Post</>}
                            </Button>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* List */}
                      {loadingAnn ? (
                        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                      ) : filterByType("General").length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">No announcements yet.</div>
                      ) : filterByType("General").map(ann => (
                        <div key={ann.id} className="border rounded-lg p-3 space-y-1">
                          <p className="text-sm font-medium">{ann.title}</p>
                          <p className="text-xs text-muted-foreground">{ann.content}</p>
                          <p className="text-[10px] text-muted-foreground/60">{formatDate(ann.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* ── Diary Tab ── */}
                <TabsContent value="diary" className="flex-1 min-h-0 mt-4">
                  <ScrollArea className="h-full px-6 pb-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
                        <p className="text-sm font-medium">Add Diary Entry</p>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Subject (optional)</Label>
                          <Select value={diaryForm.courseId} onValueChange={v => setDiaryForm(p => ({ ...p, courseId: v }))}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="All subjects" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All subjects</SelectItem>
                              {selectedClass.courses.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title / Topic</Label>
                          <Input
                            value={diaryForm.title}
                            onChange={e => setDiaryForm(p => ({ ...p, title: e.target.value }))}
                            placeholder="e.g. Homework — Chapter 5"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Details</Label>
                          <Textarea
                            value={diaryForm.content}
                            onChange={e => setDiaryForm(p => ({ ...p, content: e.target.value }))}
                            placeholder="Write diary notes, homework instructions..."
                            rows={3}
                            className="text-sm resize-none"
                          />
                        </div>
                        <div className="flex justify-end">
                          {postSuccess === "Diary" ? (
                            <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Saved!
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => submitPost("Diary")}
                              disabled={submitting === "Diary"}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {submitting === "Diary" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-1.5" />Save</>}
                            </Button>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {loadingAnn ? (
                        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                      ) : filterByType("Diary").length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">No diary entries yet.</div>
                      ) : filterByType("Diary").map(ann => (
                        <div key={ann.id} className="border rounded-lg p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{ann.title}</p>
                            <Badge variant="outline" className="text-[10px]">Diary</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{ann.content}</p>
                          <p className="text-[10px] text-muted-foreground/60">{formatDate(ann.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* ── Materials Tab ── */}
                <TabsContent value="materials" className="flex-1 min-h-0 mt-4">
                  <ScrollArea className="h-full px-6 pb-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 space-y-3 bg-muted/20">
                        <p className="text-sm font-medium">Add Course Material</p>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Subject (optional)</Label>
                          <Select value={materialForm.courseId} onValueChange={v => setMaterialForm(p => ({ ...p, courseId: v }))}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="All subjects" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All subjects</SelectItem>
                              {selectedClass.courses.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title</Label>
                          <Input
                            value={materialForm.title}
                            onChange={e => setMaterialForm(p => ({ ...p, title: e.target.value }))}
                            placeholder="e.g. Chapter 3 Notes"
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            value={materialForm.content}
                            onChange={e => setMaterialForm(p => ({ ...p, content: e.target.value }))}
                            placeholder="Describe what this material covers..."
                            rows={2}
                            className="text-sm resize-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs flex items-center gap-1.5">
                            <Link className="w-3 h-3" />Resource Link (optional)
                          </Label>
                          <Input
                            value={materialForm.link}
                            onChange={e => setMaterialForm(p => ({ ...p, link: e.target.value }))}
                            placeholder="https://drive.google.com/..."
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="flex justify-end">
                          {postSuccess === "Material" ? (
                            <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Uploaded!
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => submitPost("Material")}
                              disabled={submitting === "Material"}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {submitting === "Material" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-1.5" />Upload</>}
                            </Button>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {loadingAnn ? (
                        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                      ) : filterByType("Material").length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">No materials shared yet.</div>
                      ) : filterByType("Material").map(ann => (
                        <div key={ann.id} className="border rounded-lg p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{ann.title}</p>
                            <Badge variant="outline" className="text-[10px]">Material</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap">{ann.content}</p>
                          <p className="text-[10px] text-muted-foreground/60">{formatDate(ann.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
