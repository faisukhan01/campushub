"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/store/app-store";
import {
  mockCourses,
  mockEnrollments,
  mockStudents,
  mockAttendanceRecords,
  mockGrades,
} from "@/lib/mock-data";
import {
  BookOpen, Search, Users, Clock, ChevronDown, ChevronUp, Settings,
  Download, Upload, GraduationCap, UserPlus, Award, Calendar,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CoursesPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [search, setSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [rosterSearch, setRosterSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const isTeacher = currentUser?.role === "Teacher";
  const teacherCourses = isTeacher
    ? mockCourses.filter((c) => c.teacherId === currentUser.id)
    : mockCourses;

  const filtered = teacherCourses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const getCourseStats = (courseId: string) => {
    const enrollments = mockEnrollments.filter((e) => e.courseId === courseId);
    const avgAttendance = enrollments.length > 0
      ? Math.round(enrollments.reduce((s, e) => s + (e.attendancePercentage ?? 0), 0) / enrollments.length)
      : 0;
    const grades = mockGrades.filter((g) => g.courseId === courseId);
    const avgGrade = grades.length > 0
      ? (grades.reduce((s, g) => s + g.marksObtained, 0) / grades.reduce((s, g) => s + g.totalMarks, 0) * 100).toFixed(0)
      : "—";
    return { enrollments, avgAttendance, avgGrade, grades };
  };

  const course = selectedCourse ? mockCourses.find((c) => c.id === selectedCourse) : null;

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            {isTeacher ? "Manage your courses, rosters, and course settings" : "Browse and manage all courses"}
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const stats = getCourseStats(c.id);
          const isExpanded = expandedCourse === c.id;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="card-premium overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <Badge variant="outline" className="text-xs mb-2">{c.code}</Badge>
                      <CardTitle className="text-base leading-tight">{c.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{c.departmentName} · {c.credits} credits</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{c.enrolledCount}</p>
                      <p className="text-[10px] text-muted-foreground">Students</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className={`text-lg font-bold ${stats.avgAttendance < 75 ? "text-red-600" : ""}`}>{stats.avgAttendance}%</p>
                      <p className="text-[10px] text-muted-foreground">Attendance</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold">{stats.avgGrade}</p>
                      <p className="text-[10px] text-muted-foreground">Avg Grade</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{c.batchName ?? c.programName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.totalHours}h</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setExpandedCourse(isExpanded ? null : c.id)}
                    >
                      {isExpanded ? "Hide Roster" : "View Roster"}
                      {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                    </Button>
                    {isTeacher && (
                      <Dialog open={settingsOpen && selectedCourse === c.id} onOpenChange={(open) => { setSettingsOpen(open); if (open) setSelectedCourse(c.id); }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => { setSelectedCourse(c.id); setSettingsOpen(true); }}>
                            <Settings className="w-3 h-3 mr-1" />Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Course Settings — {c.code}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label>Course Code</Label>
                              <Input defaultValue={c.code} />
                            </div>
                            <div className="space-y-2">
                              <Label>Course Title</Label>
                              <Input defaultValue={c.name} />
                            </div>
                            <div className="space-y-2">
                              <Label>Syllabus</Label>
                              <Textarea defaultValue={c.description ?? ""} rows={3} />
                            </div>
                            <div className="space-y-2">
                              <Label>Credit Hours</Label>
                              <Input type="number" defaultValue={c.credits} />
                            </div>
                            <div className="space-y-2">
                              <Label>Prerequisites</Label>
                              <Input placeholder="Enter prerequisites" defaultValue="CS101 - Introduction to Programming" />
                            </div>
                            <div className="space-y-2">
                              <Label>Max Capacity</Label>
                              <Input type="number" defaultValue={c.maxCapacity ?? 70} />
                            </div>
                          </div>
                          <DialogFooter className="gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                        <div className="border-t pt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold">Roster ({stats.enrollments.length})</p>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2"><Upload className="w-3 h-3 mr-1" />Import</Button>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2"><Download className="w-3 h-3 mr-1" />Export</Button>
                            </div>
                          </div>
                          <Input
                            placeholder="Search students..."
                            className="h-8 text-xs"
                            value={rosterSearch}
                            onChange={(e) => setRosterSearch(e.target.value)}
                          />
                          <div className="max-h-48 overflow-y-auto space-y-1">
                            {stats.enrollments
                              .filter((e) => e.studentName.toLowerCase().includes(rosterSearch.toLowerCase()))
                              .map((enr) => {
                                const studentGrades = mockGrades.filter((g) => g.studentId === enr.studentId && g.courseId === c.id);
                                const studentAtt = mockAttendanceRecords.filter((a) => a.studentId === enr.studentId && a.courseId === c.id);
                                const presentCount = studentAtt.filter((a) => a.status === "Present").length;
                                const attPct = studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 0;
                                return (
                                  <div key={enr.id} className="flex items-center justify-between py-2 px-2 rounded hover:bg-muted/50 text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                      </div>
                                      <span className="truncate font-medium">{enr.studentName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                      <Badge variant={attPct >= 75 ? "outline" : "destructive"} className="text-[10px] px-1.5 py-0">
                                        {enr.attendancePercentage ?? attPct}%
                                      </Badge>
                                      {studentGrades.length > 0 && (
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                          {studentGrades[studentGrades.length - 1].letterGrade}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button variant="outline" size="sm" className="flex-1 text-[10px] h-7">
                              <UserPlus className="w-3 h-3 mr-1" />Add Co-teacher
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
