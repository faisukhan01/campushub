"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/app-store";
import {
  mockStudents,
  mockEnrollments,
  mockGrades,
  mockAssignments,
  mockAnnouncements,
  mockAttendanceRecords,
} from "@/lib/mock-data";
import {
  Users,
  Award,
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  FileEdit,
  Calendar,
  Mail,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Eye,
} from "lucide-react";

// ---- Helpers ----

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAttendanceColor(rate: number) {
  if (rate >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getGradeColor(gp: number) {
  if (gp >= 3.5) return "default" as const;
  if (gp >= 2.5) return "secondary" as const;
  return "destructive" as const;
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

// ---- Component ----

export function ChildrenPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);

  // Children for the parent (demo: first 2 students)
  const children = mockStudents.slice(0, 2);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const selectedChild = children[selectedChildIndex];

  if (!selectedChild) return null;

  // Child-specific data
  const enrollments = mockEnrollments.filter((e) => e.studentId === selectedChild.id);
  const grades = mockGrades.filter((g) => g.studentId === selectedChild.id);
  const attendanceRecords = mockAttendanceRecords.filter((r) => r.studentId === selectedChild.id);
  const childAssignments = mockAssignments.filter((a) =>
    enrollments.some((e) => e.courseId === a.courseId)
  );
  const upcomingAssignments = childAssignments.filter((a) => new Date(a.dueDate) > new Date());
  const overdueAssignments = childAssignments.filter((a) => new Date(a.dueDate) <= new Date());

  // Attendance calculations per course
  const attendanceByCourse = enrollments.map((enr) => {
    const records = attendanceRecords.filter((r) => r.courseId === enr.courseId);
    const present = records.filter((r) => r.status === "Present" || r.status === "Late").length;
    const total = records.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : enr.attendancePercentage ?? 0;
    return {
      courseId: enr.courseId,
      courseName: enr.courseName,
      present,
      absent: records.filter((r) => r.status === "Absent").length,
      late: records.filter((r) => r.status === "Late").length,
      total,
      rate,
    };
  });

  const overallAttendance = attendanceRecords.length > 0
    ? Math.round(
        (attendanceRecords.filter((r) => r.status === "Present" || r.status === "Late").length /
          attendanceRecords.length) *
          100
      )
    : 0;

  // GPA calculation
  const avgGPA = grades.length > 0
    ? grades.reduce((sum, g) => sum + g.gradePoint, 0) / grades.length
    : 0;

  // Announcements relevant to child's courses
  const childAnnouncements = mockAnnouncements.filter(
    (a) => a.targetAudience.includes("Student") || a.targetAudience.includes("Parent")
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Children</h1>
        <p className="text-muted-foreground">Monitor your children&apos;s academic progress and activities</p>
      </div>

      {/* Child Selector Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {children.map((child, idx) => (
          <button
            key={child.id}
            onClick={() => setSelectedChildIndex(idx)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all min-w-[220px] flex-shrink-0 ${
              selectedChildIndex === idx
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm"
                : "border-transparent bg-card hover:bg-muted/50"
            }`}
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback
                className={`text-xs font-semibold ${
                  selectedChildIndex === idx
                    ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {getInitials(child.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-semibold">{child.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {child.programName} &middot; Sem {child.semester}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Child Profile Card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-lg font-bold">
                {getInitials(selectedChild.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold">{selectedChild.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedChild.departmentName} &middot; {selectedChild.programName}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{selectedChild.rollNumber}</Badge>
                <Badge variant="outline">{selectedChild.batchName}</Badge>
                <Badge variant="outline">Semester {selectedChild.semester}</Badge>
                <Badge variant="outline">Section A</Badge>
              </div>
            </div>
            <div className="flex gap-6 sm:gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {avgGPA.toFixed(2)}
                </p>
                <p className="text-[11px] text-muted-foreground">GPA</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getAttendanceColor(overallAttendance)}`}>
                  {overallAttendance}%
                </p>
                <p className="text-[11px] text-muted-foreground">Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {upcomingAssignments.length}
                </p>
                <p className="text-[11px] text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attendance</TabsTrigger>
          <TabsTrigger value="grades" className="text-xs sm:text-sm">Grades</TabsTrigger>
          <TabsTrigger value="assignments" className="text-xs sm:text-sm">Assignments</TabsTrigger>
          <TabsTrigger value="announcements" className="text-xs sm:text-sm">Announcements</TabsTrigger>
        </TabsList>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Attendance Summary</CardTitle>
                <Badge variant={overallAttendance >= 85 ? "default" : overallAttendance >= 75 ? "secondary" : "destructive"}>
                  {overallAttendance >= 85 ? "Good" : overallAttendance >= 75 ? "Warning" : "Critical"}: {overallAttendance}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallAttendance} className="mb-4 h-2.5" />
              <div className="space-y-3">
                {attendanceByCourse.map((course) => (
                  <div key={course.courseId} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{course.courseName}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.present} present, {course.absent} absent, {course.late} late &middot; {course.total} total
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <Progress value={course.rate} className="w-20 h-2" />
                      <span className={`text-sm font-semibold min-w-[40px] text-right ${getAttendanceColor(course.rate)}`}>
                        {course.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {overallAttendance < 75 && (
                <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <p className="text-xs text-red-700 dark:text-red-300">
                    {selectedChild.name}&apos;s overall attendance is below the minimum required 75%. Please take action.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Grade Summary</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current GPA:</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {avgGPA.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {grades.length > 0 ? (
                <div className="space-y-3">
                  {grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{grade.courseName}</p>
                        <p className="text-xs text-muted-foreground">
                          {grade.assessmentName} &middot; {grade.marksObtained}/{grade.totalMarks}
                        </p>
                        {grade.comments && (
                          <p className="text-xs text-muted-foreground mt-0.5 italic">{grade.comments}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <Badge variant={getGradeColor(grade.gradePoint)}>
                          {grade.letterGrade}
                        </Badge>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {grade.gradePoint.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No grades available yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAssignments.map((asgn) => {
                    const days = daysUntil(asgn.dueDate);
                    return (
                      <div key={asgn.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{asgn.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {asgn.courseName} &middot; {asgn.type} &middot; {asgn.totalMarks} marks
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <Badge variant={days <= 3 ? "destructive" : days <= 7 ? "secondary" : "outline"}>
                            {days <= 0 ? "Due today!" : days === 1 ? "Due tomorrow" : `${days} days left`}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                  <span className="text-sm">All assignments are up to date!</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {childAnnouncements.map((ann) => (
                  <div key={ann.id} className="flex items-start gap-3 py-3 border-b last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      ann.isImportant
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-emerald-100 dark:bg-emerald-900/30"
                    }`}>
                      <MegaphoneIcon className={`w-3.5 h-3.5 ${
                        ann.isImportant
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{ann.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{ann.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDateShort(ann.createdAt)} &middot; {ann.authorName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple icon component to avoid import conflicts
function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
