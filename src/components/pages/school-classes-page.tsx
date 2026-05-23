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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap, Users, BookOpen, Loader2, RefreshCw,
  UserPlus, BookPlus, UserCheck, AlertCircle, CheckCircle2,
  Search, Layers, Calendar, Clock, Eye, EyeOff,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClassStudent {
  id: string; name: string; email: string; section: string | null;
  rollNumber: string | null; phone: string | null; classLevel: string | null;
  createdAt: string;
}

interface ClassCourse {
  id: string; code: string; title: string; subjectType: string;
  section: string | null; enrollmentCount: number;
  teachers: { id: string; name: string; email: string; employeeId: string | null; isPrimary: boolean }[];
}

interface AllTeacher {
  id: string; name: string; email: string; employeeId: string | null; phone: string | null;
}

interface ClassData {
  grade: string; label: string;
  studentCount: number; courseCount: number; teacherCount: number;
  sections: string[];
  students: ClassStudent[];
  courses: ClassCourse[];
  teachers: AllTeacher[];
}

interface TimetableSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  course: { id: string; code: string; title: string };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const GRADE_META: Record<string, {
  accent: string; bg: string; color: string; badge: string;
}> = {
  "1":  { accent: "bg-rose-400",    bg: "bg-rose-50 dark:bg-rose-950/30",      color: "text-rose-700 dark:text-rose-400",    badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" },
  "2":  { accent: "bg-orange-400",  bg: "bg-orange-50 dark:bg-orange-950/30",  color: "text-orange-700 dark:text-orange-400",badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300" },
  "3":  { accent: "bg-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/30",    color: "text-amber-700 dark:text-amber-400",  badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  "4":  { accent: "bg-yellow-400",  bg: "bg-yellow-50 dark:bg-yellow-950/30",  color: "text-yellow-700 dark:text-yellow-400",badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300" },
  "5":  { accent: "bg-lime-500",    bg: "bg-lime-50 dark:bg-lime-950/30",      color: "text-lime-700 dark:text-lime-400",    badge: "bg-lime-100 text-lime-700 dark:bg-lime-950/50 dark:text-lime-300" },
  "6":  { accent: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30",color: "text-emerald-700 dark:text-emerald-400",badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  "7":  { accent: "bg-teal-500",    bg: "bg-teal-50 dark:bg-teal-950/30",      color: "text-teal-700 dark:text-teal-400",    badge: "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300" },
  "8":  { accent: "bg-cyan-500",    bg: "bg-cyan-50 dark:bg-cyan-950/30",      color: "text-cyan-700 dark:text-cyan-400",    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300" },
  "9":  { accent: "bg-sky-500",     bg: "bg-sky-50 dark:bg-sky-950/30",        color: "text-sky-700 dark:text-sky-400",      badge: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300" },
  "10": { accent: "bg-blue-500",    bg: "bg-blue-50 dark:bg-blue-950/30",      color: "text-blue-700 dark:text-blue-400",    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  "11": { accent: "bg-violet-500",  bg: "bg-violet-50 dark:bg-violet-950/30",  color: "text-violet-700 dark:text-violet-400",badge: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" },
  "12": { accent: "bg-purple-500",  bg: "bg-purple-50 dark:bg-purple-950/30",  color: "text-purple-700 dark:text-purple-400",badge: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300" },
};

function getMeta(grade: string) { return GRADE_META[grade] ?? GRADE_META["1"]; }
function initials(name: string) { return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(); }

// ─── Main Component ───────────────────────────────────────────────────────────

export function SchoolClassesPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [allTeachers, setAllTeachers] = useState<AllTeacher[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Sheet state
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState("students");

  // Add student
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addStudentGrade, setAddStudentGrade] = useState("");
  const [studentForm, setStudentForm] = useState({ name: "", rollNumber: "", password: "", confirmPassword: "" });
  const [showStudentPwd, setShowStudentPwd] = useState(false);
  const [showStudentConfirmPwd, setShowStudentConfirmPwd] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [studentSuccess, setStudentSuccess] = useState("");
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  // Add subject
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [addSubjectGrade, setAddSubjectGrade] = useState("");
  const [subjectForm, setSubjectForm] = useState({ title: "", code: "", subjectType: "Core", section: "all" });
  const [subjectError, setSubjectError] = useState("");
  const [subjectSuccess, setSubjectSuccess] = useState("");
  const [isSavingSubject, setIsSavingSubject] = useState(false);

  // Assign teacher
  const [assignTeacherOpen, setAssignTeacherOpen] = useState(false);
  const [assignTeacherCourse, setAssignTeacherCourse] = useState<ClassCourse | null>(null);
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  const [assignError, setAssignError] = useState("");

  // Schedule
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleCourse, setScheduleCourse] = useState<ClassCourse | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ dayOfWeek: "1", startTime: "", endTime: "", room: "" });
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleSuccess, setScheduleSuccess] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true); setError("");
    try {
      const [classRes, ttRes] = await Promise.all([
        fetch("/api/school-classes"),
        fetch("/api/timetable"),
      ]);
      if (!classRes.ok) throw new Error(await classRes.text());
      const classJson = await classRes.json();
      setClasses(classJson.data ?? []);
      setAllTeachers(classJson.allTeachers ?? []);

      if (ttRes.ok) {
        const ttJson = await ttRes.json();
        const slots: TimetableSlot[] = [];
        (ttJson.data?.days ?? []).forEach((day: any) => {
          (day.slots ?? []).forEach((slot: any) => slots.push(slot));
        });
        setTimetableSlots(slots);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load class data");
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (selectedClass) {
      const updated = classes.find(c => c.grade === selectedClass.grade);
      if (updated) setSelectedClass(updated);
    }
  }, [classes]);

  const openSheet = (cls: ClassData, tab = "students") => {
    setSelectedClass(cls); setSheetTab(tab); setSheetOpen(true);
  };

  const openAddStudent = (grade: string) => {
    setAddStudentGrade(grade);
    setStudentForm({ name: "", rollNumber: "", password: "", confirmPassword: "" });
    setShowStudentPwd(false); setShowStudentConfirmPwd(false);
    setStudentError(""); setStudentSuccess(""); setAddStudentOpen(true);
  };

  const openAddSubject = (grade: string) => {
    setAddSubjectGrade(grade);
    setSubjectForm({ title: "", code: "", subjectType: "Core", section: "all" });
    setSubjectError(""); setSubjectSuccess(""); setAddSubjectOpen(true);
  };

  const openAssignTeacher = (course: ClassCourse) => {
    setAssignTeacherCourse(course); setAssignTeacherId(""); setAssignError(""); setAssignTeacherOpen(true);
  };

  const openScheduleDialog = (course: ClassCourse) => {
    setScheduleCourse(course);
    setScheduleForm({ dayOfWeek: "1", startTime: "", endTime: "", room: "" });
    setScheduleError(""); setScheduleSuccess(""); setScheduleOpen(true);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(""); setStudentSuccess("");
    if (!studentForm.name || !studentForm.rollNumber || !studentForm.password) {
      setStudentError("Name, Roll Number, and Password are required."); return;
    }
    if (studentForm.password.length < 8) { setStudentError("Password must be at least 8 characters."); return; }
    if (studentForm.password !== studentForm.confirmPassword) { setStudentError("Passwords do not match."); return; }
    setIsSavingStudent(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentForm.name,
          rollNumber: studentForm.rollNumber,
          password: studentForm.password,
          role: "Student",
          classLevel: addStudentGrade,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setStudentError(json.error ?? "Failed to add student."); return; }
      setStudentSuccess(`✓ ${studentForm.name} added to Class ${addStudentGrade}`);
      await fetchData();
      setTimeout(() => { setAddStudentOpen(false); setStudentSuccess(""); }, 1800);
    } catch { setStudentError("Network error. Try again."); }
    finally { setIsSavingStudent(false); }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubjectError(""); setSubjectSuccess("");
    if (!subjectForm.title || !subjectForm.code) {
      setSubjectError("Subject name and code are required."); return;
    }
    setIsSavingSubject(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: subjectForm.title, code: subjectForm.code.toUpperCase(),
          subjectType: subjectForm.subjectType,
          classLevel: addSubjectGrade,
          section: subjectForm.section === "all" ? "" : subjectForm.section,
          branchId: currentUser?.branchId, isActive: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setSubjectError(json.error ?? "Failed to add subject."); return; }
      setSubjectSuccess(`✓ ${subjectForm.title} added to Class ${addSubjectGrade}`);
      await fetchData();
      setTimeout(() => { setAddSubjectOpen(false); setSubjectSuccess(""); }, 1800);
    } catch { setSubjectError("Network error. Try again."); }
    finally { setIsSavingSubject(false); }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError("");
    if (!assignTeacherId || !assignTeacherCourse) { setAssignError("Select a teacher."); return; }
    setIsAssigningTeacher(true);
    try {
      const res = await fetch("/api/school-classes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign-teacher", courseId: assignTeacherCourse.id, teacherId: assignTeacherId, isPrimary: true }),
      });
      const json = await res.json();
      if (!res.ok) { setAssignError(json.error ?? "Failed to assign teacher."); return; }
      await fetchData(); setAssignTeacherOpen(false);
    } catch { setAssignError("Network error. Try again."); }
    finally { setIsAssigningTeacher(false); }
  };

  const handleRemoveTeacher = async (courseId: string, teacherId: string) => {
    try {
      await fetch("/api/school-classes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove-teacher", courseId, teacherId }),
      });
      await fetchData();
    } catch { /* silent */ }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError("");
    if (!scheduleCourse || !scheduleForm.startTime || !scheduleForm.endTime || !scheduleForm.room) {
      setScheduleError("All fields are required."); return;
    }
    setSavingSchedule(true);
    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: scheduleCourse.id,
          dayOfWeek: parseInt(scheduleForm.dayOfWeek),
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          room: scheduleForm.room,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setScheduleError(json.error ?? "Failed to add schedule."); return; }
      setScheduleSuccess("✓ Schedule added successfully.");
      await fetchData();
      setTimeout(() => { setScheduleOpen(false); setScheduleSuccess(""); }, 1800);
    } catch { setScheduleError("Network error. Try again."); }
    finally { setSavingSchedule(false); }
  };

  const filtered = search
    ? classes.filter(c =>
        c.label.toLowerCase().includes(search.toLowerCase()) ||
        c.students.some(s => s.name.toLowerCase().includes(search.toLowerCase())) ||
        c.courses.some(s => s.title.toLowerCase().includes(search.toLowerCase()))
      )
    : classes;

  const totalStudents = classes.reduce((s, c) => s + c.studentCount, 0);
  const totalSubjects = classes.reduce((s, c) => s + c.courseCount, 0);
  const activeClasses = classes.filter(c => c.studentCount > 0 || c.courseCount > 0).length;

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Class Management</h1>
            <p className="text-muted-foreground text-sm">Manage students, subjects, teacher assignments and schedules</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading} className="flex-shrink-0">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Active Classes", value: activeClasses, icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Total Students", value: totalStudents.toLocaleString(), icon: GraduationCap, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20" },
          { label: "Total Subjects", value: totalSubjects, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Teachers", value: allTeachers.length, icon: Users, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold">{isLoading ? "—" : kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search class, student, subject…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}

      {/* Class Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading classes…</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map(cls => {
            const meta = getMeta(cls.grade);
            return (
              <Card
                key={cls.grade}
                className="cursor-pointer hover:shadow-lg hover:border-emerald-500 transition-all duration-200 group"
                onClick={() => openSheet(cls)}
              >
                <CardContent className="p-5 text-center">
                  <div className={`w-12 h-12 rounded-xl ${meta.bg} flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500 transition-colors`}>
                    <span className={`text-xl font-bold ${meta.color} group-hover:text-white transition-colors`}>{cls.grade}</span>
                  </div>
                  <p className="text-sm font-semibold mb-2">Class {cls.grade}</p>
                  <div className="flex justify-center gap-2 text-[10px] text-muted-foreground">
                    <span>{cls.studentCount} students</span>
                    <span>·</span>
                    <span>{cls.courseCount} subjects</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── Class Detail Sheet ──────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          {selectedClass && (() => {
            const meta = getMeta(selectedClass.grade);
            const classSlots = timetableSlots.filter(s =>
              selectedClass.courses.some(c => c.id === s.course.id)
            );
            return (
              <>
                <SheetHeader className="px-6 pt-6 pb-4 border-b">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${meta.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                      <span className="text-[9px] font-medium text-muted-foreground">Grade</span>
                      <span className={`text-lg font-black ${meta.color}`}>{selectedClass.grade}</span>
                    </div>
                    <div>
                      <SheetTitle>{selectedClass.label}</SheetTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedClass.studentCount} students · {selectedClass.courseCount} subjects · {selectedClass.teacherCount} teachers
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <Tabs value={sheetTab} onValueChange={setSheetTab} className="flex-1 flex flex-col overflow-hidden">
                  <TabsList className="mx-6 mt-4 w-fit">
                    <TabsTrigger value="students" className="gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />Students ({selectedClass.studentCount})
                    </TabsTrigger>
                    <TabsTrigger value="subjects" className="gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />Subjects ({selectedClass.courseCount})
                    </TabsTrigger>
                    <TabsTrigger value="teachers" className="gap-1.5">
                      <Users className="w-3.5 h-3.5" />Teachers ({selectedClass.teacherCount})
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />Schedule ({classSlots.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Students Tab */}
                  <TabsContent value="students" className="flex-1 overflow-hidden flex flex-col m-0 px-6">
                    <div className="flex items-center justify-between py-3">
                      <p className="text-sm text-muted-foreground">{selectedClass.studentCount} enrolled students</p>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => openAddStudent(selectedClass.grade)}>
                        <UserPlus className="w-3.5 h-3.5 mr-1.5" />Add Student
                      </Button>
                    </div>
                    <ScrollArea className="flex-1 -mx-1 px-1">
                      {selectedClass.students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <GraduationCap className="w-12 h-12 text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground">No students in {selectedClass.label} yet</p>
                          <Button size="sm" variant="outline" className="mt-3" onClick={() => openAddStudent(selectedClass.grade)}>
                            <UserPlus className="w-3.5 h-3.5 mr-1.5" />Add First Student
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 pb-4">
                          {selectedClass.students.map(student => (
                            <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 text-xs font-semibold">
                                  {initials(student.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{student.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {student.rollNumber && <Badge variant="outline" className="text-[10px]">#{student.rollNumber}</Badge>}
                                {student.section && <Badge className={`text-[10px] ${meta.badge}`}>§{student.section}</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  {/* Subjects Tab */}
                  <TabsContent value="subjects" className="flex-1 overflow-hidden flex flex-col m-0 px-6">
                    <div className="flex items-center justify-between py-3">
                      <p className="text-sm text-muted-foreground">{selectedClass.courseCount} subjects assigned</p>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => openAddSubject(selectedClass.grade)}>
                        <BookPlus className="w-3.5 h-3.5 mr-1.5" />Add Subject
                      </Button>
                    </div>
                    <ScrollArea className="flex-1 -mx-1 px-1">
                      {selectedClass.courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground">No subjects in {selectedClass.label} yet</p>
                          <Button size="sm" variant="outline" className="mt-3" onClick={() => openAddSubject(selectedClass.grade)}>
                            <BookPlus className="w-3.5 h-3.5 mr-1.5" />Add First Subject
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 pb-4">
                          {selectedClass.courses.map(course => {
                            const courseSlots = timetableSlots.filter(s => s.course.id === course.id);
                            return (
                              <div key={course.id} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <Badge variant="outline" className="text-[10px]">{course.code}</Badge>
                                      <Badge variant="secondary" className="text-[10px]">{course.subjectType}</Badge>
                                      {course.section && <Badge variant="outline" className="text-[10px]">§{course.section}</Badge>}
                                    </div>
                                    <p className="font-medium text-sm">{course.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {course.enrollmentCount} enrolled · {courseSlots.length} slot{courseSlots.length !== 1 ? "s" : ""}
                                    </p>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <Button size="sm" variant="outline" className="text-xs h-7 px-2"
                                      onClick={() => openAssignTeacher(course)}>
                                      <UserCheck className="w-3 h-3 mr-1" />Teacher
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs h-7 px-2"
                                      onClick={() => openScheduleDialog(course)}>
                                      <Clock className="w-3 h-3 mr-1" />Schedule
                                    </Button>
                                  </div>
                                </div>
                                {course.teachers.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {course.teachers.map(t => (
                                      <div key={t.id} className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full px-2 py-0.5">
                                        <div className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">
                                          <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-300">{initials(t.name)}</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">{t.name}</span>
                                        {t.isPrimary && <span className="text-[8px] text-emerald-500">●</span>}
                                        <button className="text-muted-foreground hover:text-destructive ml-0.5 text-[10px]"
                                          onClick={() => handleRemoveTeacher(course.id, t.id)}>×</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {courseSlots.length > 0 && (
                                  <div className="mt-2 space-y-0.5">
                                    {courseSlots.map(slot => (
                                      <div key={slot.id} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                        <span>{DAYS[slot.dayOfWeek]} · {slot.startTime}–{slot.endTime} · Room {slot.room}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  {/* Teachers Tab */}
                  <TabsContent value="teachers" className="flex-1 overflow-hidden flex flex-col m-0 px-6">
                    <div className="py-3">
                      <p className="text-sm text-muted-foreground">{selectedClass.teacherCount} teachers active in {selectedClass.label}</p>
                    </div>
                    <ScrollArea className="flex-1 -mx-1 px-1">
                      {selectedClass.teachers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground">No teachers assigned yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Assign teachers to subjects from the Subjects tab</p>
                        </div>
                      ) : (
                        <div className="space-y-2 pb-4">
                          {selectedClass.teachers.map(teacher => {
                            const teachingCourses = selectedClass.courses.filter(c =>
                              c.teachers.some(t => t.id === teacher.id)
                            );
                            return (
                              <div key={teacher.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold">
                                    {initials(teacher.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">{teacher.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{teacher.email}</p>
                                  {teachingCourses.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {teachingCourses.map(c => (
                                        <span key={c.id} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{c.title}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {teacher.employeeId && (
                                  <Badge variant="outline" className="text-[10px] flex-shrink-0">{teacher.employeeId}</Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  {/* Schedule Tab */}
                  <TabsContent value="schedule" className="flex-1 overflow-hidden flex flex-col m-0 px-6">
                    <div className="py-3">
                      <p className="text-sm text-muted-foreground">
                        {classSlots.length} scheduled slot{classSlots.length !== 1 ? "s" : ""} across all subjects
                      </p>
                    </div>
                    <ScrollArea className="flex-1 -mx-1 px-1">
                      {classSlots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <Calendar className="w-12 h-12 text-muted-foreground/30 mb-3" />
                          <p className="text-sm text-muted-foreground">No schedule set yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Open the Subjects tab and click Schedule on any subject</p>
                        </div>
                      ) : (
                        <div className="space-y-4 pb-4">
                          {DAYS.map((day, idx) => {
                            const daySlots = classSlots
                              .filter(s => s.dayOfWeek === idx)
                              .sort((a, b) => a.startTime.localeCompare(b.startTime));
                            if (daySlots.length === 0) return null;
                            return (
                              <div key={day}>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{day}</p>
                                <div className="space-y-2">
                                  {daySlots.map(slot => (
                                    <div key={slot.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                                      <div className="w-1 h-10 rounded-full bg-emerald-500 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{slot.course.title}</p>
                                        <p className="text-xs text-muted-foreground">{slot.course.code}</p>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p className="text-xs font-semibold">{slot.startTime}–{slot.endTime}</p>
                                        <p className="text-[10px] text-muted-foreground">Room {slot.room}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ─── Add Student Dialog ──────────────────────────────────────────────── */}
      <Dialog open={addStudentOpen} onOpenChange={o => { setAddStudentOpen(o); if (!o) { setStudentError(""); setStudentSuccess(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Student to Class {addStudentGrade}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="Student full name" disabled={isSavingStudent} />
            </div>
            <div className="space-y-2">
              <Label>Roll Number / College ID <span className="text-destructive">*</span></Label>
              <Input value={studentForm.rollNumber} onChange={e => setStudentForm({ ...studentForm, rollNumber: e.target.value })} placeholder="e.g. 2021-CS-001" disabled={isSavingStudent} />
              <p className="text-xs text-muted-foreground">This will be used as their login identifier.</p>
            </div>
            <div className="space-y-2">
              <Label>Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input
                  type={showStudentPwd ? "text" : "password"}
                  value={studentForm.password}
                  onChange={e => setStudentForm({ ...studentForm, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="pr-10"
                  disabled={isSavingStudent}
                />
                <button type="button" onClick={() => setShowStudentPwd(!showStudentPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showStudentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input
                  type={showStudentConfirmPwd ? "text" : "password"}
                  value={studentForm.confirmPassword}
                  onChange={e => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="pr-10"
                  disabled={isSavingStudent}
                />
                <button type="button" onClick={() => setShowStudentConfirmPwd(!showStudentConfirmPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showStudentConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {studentError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{studentError}
              </div>
            )}
            {studentSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{studentSuccess}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddStudentOpen(false)} disabled={isSavingStudent}>Cancel</Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white" disabled={isSavingStudent}>
                {isSavingStudent && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isSavingStudent ? "Adding…" : "Add Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Add Subject Dialog ──────────────────────────────────────────────── */}
      <Dialog open={addSubjectOpen} onOpenChange={o => { setAddSubjectOpen(o); if (!o) { setSubjectError(""); setSubjectSuccess(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                <BookPlus className="w-4 h-4 text-purple-600" />
              </div>
              Add Subject to Class {addSubjectGrade}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Subject Name <span className="text-destructive">*</span></Label>
                <Input value={subjectForm.title} onChange={e => setSubjectForm({ ...subjectForm, title: e.target.value })} placeholder="e.g. Mathematics" disabled={isSavingSubject} />
              </div>
              <div className="space-y-1.5">
                <Label>Subject Code <span className="text-destructive">*</span></Label>
                <Input value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })} placeholder="e.g. MTH-5" disabled={isSavingSubject} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={subjectForm.subjectType} onValueChange={v => setSubjectForm({ ...subjectForm, subjectType: v })} disabled={isSavingSubject}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Core", "Elective", "Practical", "Co-curricular", "Language"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Section (optional — leave blank for all sections)</Label>
                <Select value={subjectForm.section} onValueChange={v => setSubjectForm({ ...subjectForm, section: v })} disabled={isSavingSubject}>
                  <SelectTrigger><SelectValue placeholder="All sections" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sections</SelectItem>
                    {["A", "B", "C", "D", "E"].map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {subjectError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4" />{subjectError}
              </div>
            )}
            {subjectSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4" />{subjectSuccess}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddSubjectOpen(false)} disabled={isSavingSubject}>Cancel</Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSavingSubject}>
                {isSavingSubject && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isSavingSubject ? "Adding…" : "Add Subject"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Assign Teacher Dialog ───────────────────────────────────────────── */}
      <Dialog open={assignTeacherOpen} onOpenChange={setAssignTeacherOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              Assign Teacher
            </DialogTitle>
          </DialogHeader>
          {assignTeacherCourse && (
            <form onSubmit={handleAssignTeacher} className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs text-muted-foreground">Subject</p>
                <p className="font-semibold">{assignTeacherCourse.title}</p>
                <p className="text-xs text-muted-foreground">{assignTeacherCourse.code}</p>
              </div>
              {assignTeacherCourse.teachers.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Currently assigned:</p>
                  <div className="space-y-1">
                    {assignTeacherCourse.teachers.map(t => (
                      <div key={t.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                        <span>{t.name}</span>
                        <button type="button" className="text-xs text-destructive hover:underline"
                          onClick={() => handleRemoveTeacher(assignTeacherCourse.id, t.id)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Select Teacher</Label>
                <Select value={assignTeacherId} onValueChange={setAssignTeacherId} disabled={isAssigningTeacher}>
                  <SelectTrigger><SelectValue placeholder="Choose a teacher…" /></SelectTrigger>
                  <SelectContent>
                    {allTeachers
                      .filter(t => !assignTeacherCourse.teachers.some(ct => ct.id === t.id))
                      .map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} {t.employeeId ? `(${t.employeeId})` : ""}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              {assignError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4" />{assignError}
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAssignTeacherOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isAssigningTeacher}>
                  {isAssigningTeacher && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {isAssigningTeacher ? "Assigning…" : "Assign Teacher"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Add Schedule Dialog ─────────────────────────────────────────────── */}
      <Dialog open={scheduleOpen} onOpenChange={o => { setScheduleOpen(o); if (!o) { setScheduleError(""); setScheduleSuccess(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-teal-600" />
              </div>
              Add Schedule — {scheduleCourse?.title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSchedule} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Day of Week <span className="text-destructive">*</span></Label>
              <Select value={scheduleForm.dayOfWeek} onValueChange={v => setScheduleForm({ ...scheduleForm, dayOfWeek: v })} disabled={savingSchedule}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, idx) => <SelectItem key={idx} value={idx.toString()}>{day}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Time <span className="text-destructive">*</span></Label>
                <Input type="time" value={scheduleForm.startTime} onChange={e => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} disabled={savingSchedule} />
              </div>
              <div className="space-y-1.5">
                <Label>End Time <span className="text-destructive">*</span></Label>
                <Input type="time" value={scheduleForm.endTime} onChange={e => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} disabled={savingSchedule} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Room / Location <span className="text-destructive">*</span></Label>
              <Input value={scheduleForm.room} onChange={e => setScheduleForm({ ...scheduleForm, room: e.target.value })} placeholder="e.g. Room 101, Lab A" disabled={savingSchedule} />
            </div>
            {scheduleError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4" />{scheduleError}
              </div>
            )}
            {scheduleSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4" />{scheduleSuccess}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setScheduleOpen(false)} disabled={savingSchedule}>Cancel</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white" disabled={savingSchedule}>
                {savingSchedule && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {savingSchedule ? "Adding…" : "Add Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
