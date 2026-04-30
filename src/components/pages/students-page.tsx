"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import {
  mockStudents,
  mockEnrollments,
  mockCourses,
  mockAttendanceRecords,
  mockGrades,
} from "@/lib/mock-data";
import {
  GraduationCap, Search, AlertTriangle, ChevronDown, ChevronUp,
  Mail, BookOpen, Calendar, BarChart3, TrendingDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function StudentsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const isTeacher = currentUser?.role === "Teacher";
  const teacherCourses = isTeacher
    ? mockCourses.filter((c) => c.teacherId === currentUser.id)
    : mockCourses;

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Get all students enrolled in teacher's courses
  const teacherStudentIds = new Set(
    mockEnrollments
      .filter((e) => teacherCourses.some((c) => c.id === e.courseId))
      .map((e) => e.studentId)
  );
  const teacherStudents = mockStudents.filter((s) => teacherStudentIds.has(s.id));

  const filtered = useMemo(() => {
    let result = teacherStudents;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (st) =>
          st.name.toLowerCase().includes(s) ||
          st.rollNumber.toLowerCase().includes(s) ||
          st.email.toLowerCase().includes(s)
      );
    }
    if (courseFilter !== "all") {
      const enrolledIds = new Set(
        mockEnrollments.filter((e) => e.courseId === courseFilter).map((e) => e.studentId)
      );
      result = result.filter((st) => enrolledIds.has(st.id));
    }
    return result;
  }, [teacherStudents, search, courseFilter]);

  const getStudentStats = (studentId: string) => {
    const enrollments = mockEnrollments.filter(
      (e) => e.studentId === studentId && teacherCourses.some((c) => c.id === e.courseId)
    );
    const attendanceRecords = mockAttendanceRecords.filter(
      (a) => a.studentId === studentId && teacherCourses.some((c) => c.id === a.courseId)
    );
    const presentCount = attendanceRecords.filter((a) => a.status === "Present").length;
    const attRate = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;
    const grades = mockGrades.filter(
      (g) => g.studentId === studentId && teacherCourses.some((c) => c.id === g.courseId)
    );
    const avgMarks = grades.length > 0
      ? (grades.reduce((s, g) => s + (g.marksObtained / g.totalMarks * 100), 0) / grades.length).toFixed(1)
      : "—";

    const isAtRisk = attRate < 75 || (avgMarks !== "—" && parseFloat(avgMarks) < 60);

    return { enrollments, attendanceRecords, attRate, grades, avgMarks, isAtRisk };
  };

  // Count at-risk students
  const atRiskCount = teacherStudents.filter((s) => getStudentStats(s.id).isAtRisk).length;

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            {isTeacher ? "View student profiles, attendance, and performance" : "Manage student records and information"}
          </p>
        </div>
        {isTeacher && atRiskCount > 0 && (
          <Badge variant="destructive" className="text-xs py-1.5 px-3 flex items-center gap-1.5 self-start">
            <AlertTriangle className="w-3.5 h-3.5" />
            {atRiskCount} at-risk students
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, roll number, email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {teacherCourses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{filtered.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">At-Risk</p>
              <p className="text-lg font-bold text-red-600">{atRiskCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Attendance</p>
              <p className="text-lg font-bold">
                {teacherStudents.length > 0
                  ? Math.round(teacherStudents.reduce((s, st) => s + getStudentStats(st.id).attRate, 0) / teacherStudents.length)
                  : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Low Attendance</p>
              <p className="text-lg font-bold text-amber-600">
                {teacherStudents.filter((s) => getStudentStats(s.id).attRate < 75).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Student List ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto space-y-1">
            {filtered.map((student, idx) => {
              const stats = getStudentStats(student.id);
              const isExpanded = expandedStudent === student.id;

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border ${isExpanded ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-transparent"} ${stats.isAtRisk ? "border-l-2 border-l-red-400" : ""}`}
                    onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        {stats.isAtRisk && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{student.rollNumber} · {student.email}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">{student.departmentName}</Badge>
                      <Badge variant="outline" className="text-xs">Sem {student.semester}</Badge>
                      <div className="text-center min-w-[50px]">
                        <p className={`text-xs font-bold ${stats.attRate < 75 ? "text-red-600" : "text-emerald-600"}`}>{stats.attRate}%</p>
                        <p className="text-[10px] text-muted-foreground">Attendance</p>
                      </div>
                      <div className="text-center min-w-[40px]">
                        <p className="text-xs font-bold">{stats.avgMarks !== "—" ? `${stats.avgMarks}%` : "—"}</p>
                        <p className="text-[10px] text-muted-foreground">Avg</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1 space-y-3 border-b mx-1">
                          {/* Courses Enrolled */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> Courses ({stats.enrollments.length})
                            </p>
                            <div className="space-y-1">
                              {stats.enrollments.map((enr) => (
                                <div key={enr.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-muted/50">
                                  <span className="font-medium">{enr.courseName}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={(enr.attendancePercentage ?? 0) >= 75 ? "outline" : "destructive"}
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {(enr.attendancePercentage ?? 0)}%
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Attendance History */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Attendance Summary
                            </p>
                            <div className="flex gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span>Present: {stats.attendanceRecords.filter((r) => r.status === "Present").length}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span>Absent: {stats.attendanceRecords.filter((r) => r.status === "Absent").length}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <span>Late: {stats.attendanceRecords.filter((r) => r.status === "Late").length}</span>
                              </div>
                            </div>
                            <Progress value={stats.attRate} className="mt-2 h-1.5" />
                          </div>

                          {/* Grade Summary */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" /> Grade Summary
                            </p>
                            {stats.grades.length > 0 ? (
                              <div className="space-y-1">
                                {stats.grades.map((grade) => (
                                  <div key={grade.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-muted/50">
                                    <div className="min-w-0">
                                      <p className="font-medium truncate">{grade.assessmentName ?? "Assessment"}</p>
                                      <p className="text-[10px] text-muted-foreground">{grade.courseName}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span className="font-medium">{grade.marksObtained}/{grade.totalMarks}</span>
                                      <Badge
                                        variant={grade.gradePoint >= 3.0 ? "default" : grade.gradePoint >= 2.0 ? "secondary" : "destructive"}
                                        className={`text-[10px] px-1.5 py-0 ${grade.gradePoint >= 3.0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}`}
                                      >
                                        {grade.letterGrade}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">No grades recorded yet</p>
                            )}
                          </div>

                          {/* At-risk indicators */}
                          {stats.isAtRisk && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                              <p className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> At-Risk Indicators
                              </p>
                              <div className="mt-1 space-y-0.5 text-xs text-red-600 dark:text-red-400">
                                {stats.attRate < 75 && <p>• Attendance below 75% ({stats.attRate}%)</p>}
                                {stats.avgMarks !== "—" && parseFloat(stats.avgMarks) < 60 && <p>• Average marks below 60% ({stats.avgMarks}%)</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No students found matching your criteria</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
