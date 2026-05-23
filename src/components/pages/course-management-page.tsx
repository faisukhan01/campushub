"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BookOpen, Users, Clock, UserPlus, Loader2, RefreshCw,
  AlertCircle, CheckCircle2, Search, X, Calendar, Plus, GraduationCap,
} from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  classLevel: string;
  section?: string;
  enrolledStudentsCount: number;
  teachers: { id: string; name: string; isPrimary: boolean }[];
}

interface Student {
  id: string;
  name: string;
  rollNumber?: string;
  classLevel?: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  employeeId?: string;
}

interface TimetableSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  course: {
    id: string;
    code: string;
    title: string;
  };
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const SUBJECT_TYPES = ["Core", "Elective", "Lab", "Project", "Extra-Curricular"];

export function CourseManagementPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const callerRole = currentUser?.role as string | undefined;

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Add Course Dialog
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    code: "",
    description: "",
    subjectType: "Core",
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [courseSuccess, setCourseSuccess] = useState("");

  // Enrollment Dialog
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");

  // Teacher Assignment Dialog
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [selectedCourseForTeacher, setSelectedCourseForTeacher] = useState<Course | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [teacherError, setTeacherError] = useState("");
  const [teacherSuccess, setTeacherSuccess] = useState("");

  // Timetable Dialog
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false);
  const [selectedCourseForTimetable, setSelectedCourseForTimetable] = useState<Course | null>(null);
  const [timetableForm, setTimetableForm] = useState({
    dayOfWeek: "1",
    startTime: "",
    endTime: "",
    room: "",
  });
  const [savingTimetable, setSavingTimetable] = useState(false);
  const [timetableError, setTimetableError] = useState("");
  const [timetableSuccess, setTimetableSuccess] = useState("");

  const canManage = callerRole === "BranchAdmin" || callerRole === "InstituteAdmin" || callerRole === "SuperAdmin";

  // Debug logging
  useEffect(() => {
    console.log('[CourseManagement] Session:', { role: callerRole, canManage, status });
  }, [callerRole, canManage, status]);

  const fetchData = useCallback(async () => {
    if (!selectedClass) return;
    
    setIsLoading(true);
    setError("");
    try {
      const [coursesRes, studentsRes, teachersRes, timetableRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/users?role=Student"),
        fetch("/api/users?role=Teacher"),
        fetch("/api/timetable"),
      ]);

      if (!coursesRes.ok || !studentsRes.ok || !teachersRes.ok || !timetableRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [coursesData, studentsData, teachersData, timetableData] = await Promise.all([
        coursesRes.json(),
        studentsRes.json(),
        teachersRes.json(),
        timetableRes.json(),
      ]);

      // Filter courses by selected class
      const filteredCourses = (coursesData.data ?? []).filter(
        (c: Course) => c.classLevel === selectedClass || c.classLevel === `Class ${selectedClass}`
      );
      setCourses(filteredCourses);

      // Filter students by selected class
      const filteredStudents = (studentsData.data?.users ?? []).filter(
        (s: Student) => s.classLevel === selectedClass || s.classLevel === `Class ${selectedClass}`
      );
      setStudents(filteredStudents);

      setTeachers(teachersData.data?.users ?? []);
      
      // Flatten timetable slots
      const allSlots: TimetableSlot[] = [];
      if (timetableData.data?.days) {
        timetableData.data.days.forEach((day: any) => {
          day.slots.forEach((slot: any) => {
            allSlots.push(slot);
          });
        });
      }
      setTimetableSlots(allSlots);
    } catch {
      setError("Failed to load data. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      fetchData();
    }
  }, [selectedClass, fetchData]);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  // Add Course Handler
  const handleAddCourse = async () => {
    if (!courseForm.title || !courseForm.code) {
      setCourseError("Course title and code are required.");
      return;
    }

    setSavingCourse(true);
    setCourseError("");
    setCourseSuccess("");

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: courseForm.title,
          code: courseForm.code,
          description: courseForm.description,
          classLevel: selectedClass,
          subjectType: courseForm.subjectType,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setCourseError(json.error ?? "Failed to create course.");
        return;
      }

      setCourseSuccess(`✓ Course "${courseForm.title}" created successfully.`);
      setCourseForm({ title: "", code: "", description: "", subjectType: "Core" });
      fetchData();
      setTimeout(() => {
        setAddCourseDialogOpen(false);
        setCourseSuccess("");
      }, 1800);
    } catch {
      setCourseError("Network error. Please try again.");
    } finally {
      setSavingCourse(false);
    }
  };

  // Enroll Students
  const handleEnrollStudents = async () => {
    if (!selectedCourseForEnroll || selectedStudents.length === 0) {
      setEnrollError("Please select at least one student.");
      return;
    }

    setEnrolling(true);
    setEnrollError("");
    setEnrollSuccess("");

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseForEnroll.id,
          studentIds: selectedStudents,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setEnrollError(json.error ?? "Failed to enroll students.");
        return;
      }

      setEnrollSuccess(`✓ ${selectedStudents.length} student(s) enrolled successfully.`);
      setSelectedStudents([]);
      fetchData();
      setTimeout(() => {
        setEnrollDialogOpen(false);
        setEnrollSuccess("");
      }, 1800);
    } catch {
      setEnrollError("Network error. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  // Assign Teacher
  const handleAssignTeacher = async () => {
    if (!selectedCourseForTeacher || !selectedTeacher) {
      setTeacherError("Please select a teacher.");
      return;
    }

    setAssigning(true);
    setTeacherError("");
    setTeacherSuccess("");

    try {
      const res = await fetch("/api/course-teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseForTeacher.id,
          teacherId: selectedTeacher,
          isPrimary,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setTeacherError(json.error ?? "Failed to assign teacher.");
        return;
      }

      setTeacherSuccess("✓ Teacher assigned successfully.");
      setSelectedTeacher("");
      setIsPrimary(false);
      fetchData();
      setTimeout(() => {
        setTeacherDialogOpen(false);
        setTeacherSuccess("");
      }, 1800);
    } catch {
      setTeacherError("Network error. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  // Add Timetable Slot
  const handleAddTimetableSlot = async () => {
    if (!selectedCourseForTimetable || !timetableForm.startTime || !timetableForm.endTime || !timetableForm.room) {
      setTimetableError("All fields are required.");
      return;
    }

    setSavingTimetable(true);
    setTimetableError("");
    setTimetableSuccess("");

    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseForTimetable.id,
          dayOfWeek: parseInt(timetableForm.dayOfWeek),
          startTime: timetableForm.startTime,
          endTime: timetableForm.endTime,
          room: timetableForm.room,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setTimetableError(json.error ?? "Failed to add timetable slot.");
        return;
      }

      setTimetableSuccess("✓ Timetable slot added successfully.");
      setTimetableForm({ dayOfWeek: "1", startTime: "", endTime: "", room: "" });
      fetchData();
      setTimeout(() => {
        setTimetableDialogOpen(false);
        setTimetableSuccess("");
      }, 1800);
    } catch {
      setTimetableError("Network error. Please try again.");
    } finally {
      setSavingTimetable(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Access Denied</h3>
        <p className="text-sm text-muted-foreground">You don't have permission to access this page.</p>
        {callerRole && (
          <p className="text-xs text-muted-foreground mt-2">
            Current role: <span className="font-mono font-semibold">{callerRole}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Required roles: BranchAdmin, InstituteAdmin, or SuperAdmin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">
            Manage courses, students, teachers, and timetables by class
          </p>
        </div>
        {selectedClass && (
          <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Class Selection */}
      {!selectedClass ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a Class to Manage</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Choose a class level to view and manage its courses, students, and schedules
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {CLASSES.map((classNum) => (
              <Card
                key={classNum}
                className="cursor-pointer hover:shadow-lg hover:border-emerald-500 transition-all duration-200 group"
                onClick={() => setSelectedClass(classNum)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-white">
                      {classNum}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Class {classNum}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Selected Class Header */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{selectedClass}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Class {selectedClass}</h3>
                    <p className="text-sm text-muted-foreground">
                      {courses.length} course(s) • {students.length} student(s)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      setCourseForm({ title: "", code: "", description: "", subjectType: "Core" });
                      setCourseError("");
                      setCourseSuccess("");
                      setAddCourseDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClass("");
                      setCourses([]);
                      setStudents([]);
                    }}
                  >
                    Change Class
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading courses…</span>
        </div>
      )}

      {/* Empty state */}
      {selectedClass && !isLoading && courses.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No courses for Class {selectedClass}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first course to get started
          </p>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setAddCourseDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      )}

      {/* Course Cards */}
      {selectedClass && !isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((course) => {
            const courseSlots = timetableSlots.filter((s) => s.course.id === course.id);
            return (
              <Card key={course.id} className="card-premium">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{course.title}</span>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.code} • Class {course.classLevel}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.enrolledStudentsCount} students
                    </span>
                    <span className="flex items-center gap-1">
                      <UserPlus className="w-3.5 h-3.5" />
                      {course.teachers.length} teacher(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {courseSlots.length} slot(s)
                    </span>
                  </div>

                  {/* Teachers */}
                  {course.teachers.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Assigned Teachers:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.teachers.map((t) => (
                          <Badge key={t.id} variant="outline" className="text-xs">
                            {t.name}
                            {t.isPrimary && " (Primary)"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timetable */}
                  {courseSlots.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Schedule:</p>
                      <div className="space-y-1">
                        {courseSlots.map((slot) => (
                          <div key={slot.id} className="text-xs flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span>
                              {DAYS[slot.dayOfWeek]} • {slot.startTime} - {slot.endTime} • Room {slot.room}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourseForEnroll(course);
                        setSelectedStudents([]);
                        setEnrollError("");
                        setEnrollSuccess("");
                        setEnrollDialogOpen(true);
                      }}
                    >
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      Enroll Students
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourseForTeacher(course);
                        setSelectedTeacher("");
                        setIsPrimary(false);
                        setTeacherError("");
                        setTeacherSuccess("");
                        setTeacherDialogOpen(true);
                      }}
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Assign Teacher
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourseForTimetable(course);
                        setTimetableForm({ dayOfWeek: "1", startTime: "", endTime: "", room: "" });
                        setTimetableError("");
                        setTimetableSuccess("");
                        setTimetableDialogOpen(true);
                      }}
                    >
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      Add Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Enroll Students Dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Enroll Students to {selectedCourseForEnroll?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students…" className="pl-9" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allStudentIds = students.map(s => s.id);
                  setSelectedStudents(allStudentIds);
                }}
                disabled={enrolling}
              >
                <Users className="w-4 h-4 mr-2" />
                Select All ({students.length})
              </Button>
            </div>

            <div className="border rounded-lg max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.rollNumber ?? "—"}</TableCell>
                      <TableCell>{student.classLevel ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedStudents.length} student(s) selected
              </span>
              {selectedStudents.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudents([])}
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {enrollError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {enrollError}
              </div>
            )}
            {enrollSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {enrollSuccess}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollDialogOpen(false)} disabled={enrolling}>
              Cancel
            </Button>
            <Button
              onClick={handleEnrollStudents}
              disabled={enrolling || selectedStudents.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {enrolling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {enrolling ? "Enrolling…" : `Enroll ${selectedStudents.length} Student(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Teacher Dialog */}
      <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Teacher to {selectedCourseForTeacher?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Teacher <span className="text-destructive">*</span></Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher} disabled={assigning}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.employeeId ?? teacher.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4"
                disabled={assigning}
              />
              <Label htmlFor="isPrimary" className="cursor-pointer">
                Set as primary teacher
              </Label>
            </div>

            {teacherError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {teacherError}
              </div>
            )}
            {teacherSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {teacherSuccess}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeacherDialogOpen(false)} disabled={assigning}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignTeacher}
              disabled={assigning || !selectedTeacher}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {assigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {assigning ? "Assigning…" : "Assign Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Timetable Slot Dialog */}
      <Dialog open={timetableDialogOpen} onOpenChange={setTimetableDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Add Schedule for {selectedCourseForTimetable?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Day of Week <span className="text-destructive">*</span></Label>
              <Select
                value={timetableForm.dayOfWeek}
                onValueChange={(v) => setTimetableForm({ ...timetableForm, dayOfWeek: v })}
                disabled={savingTimetable}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Time <span className="text-destructive">*</span></Label>
                <Input
                  type="time"
                  value={timetableForm.startTime}
                  onChange={(e) => setTimetableForm({ ...timetableForm, startTime: e.target.value })}
                  disabled={savingTimetable}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time <span className="text-destructive">*</span></Label>
                <Input
                  type="time"
                  value={timetableForm.endTime}
                  onChange={(e) => setTimetableForm({ ...timetableForm, endTime: e.target.value })}
                  disabled={savingTimetable}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Room / Location <span className="text-destructive">*</span></Label>
              <Input
                value={timetableForm.room}
                onChange={(e) => setTimetableForm({ ...timetableForm, room: e.target.value })}
                placeholder="e.g., Room 101, Lab A"
                disabled={savingTimetable}
              />
            </div>

            {timetableError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {timetableError}
              </div>
            )}
            {timetableSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {timetableSuccess}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTimetableDialogOpen(false)} disabled={savingTimetable}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTimetableSlot}
              disabled={savingTimetable}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {savingTimetable ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {savingTimetable ? "Adding…" : "Add Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Course Dialog */}
      <Dialog open={addCourseDialogOpen} onOpenChange={setAddCourseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Course for Class {selectedClass}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Course Title <span className="text-destructive">*</span></Label>
              <Input
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="e.g., Mathematics, English"
                disabled={savingCourse}
              />
            </div>

            <div className="space-y-2">
              <Label>Course Code <span className="text-destructive">*</span></Label>
              <Input
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                placeholder="e.g., MATH-101"
                disabled={savingCourse}
              />
            </div>

            <div className="space-y-2">
              <Label>Subject Type</Label>
              <Select
                value={courseForm.subjectType}
                onValueChange={(v) => setCourseForm({ ...courseForm, subjectType: v })}
                disabled={savingCourse}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Brief description of the course…"
                rows={3}
                disabled={savingCourse}
              />
            </div>

            {courseError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {courseError}
              </div>
            )}
            {courseSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {courseSuccess}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCourseDialogOpen(false)} disabled={savingCourse}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCourse}
              disabled={savingCourse}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {savingCourse ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {savingCourse ? "Creating…" : "Add Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
