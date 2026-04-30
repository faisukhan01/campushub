"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import {
  mockCourses,
  mockGrades,
  mockAssessments,
  mockStudents,
  mockEnrollments,
} from "@/lib/mock-data";
import {
  Award, TrendingUp, Download, FileSpreadsheet, Eye, EyeOff,
  Users, BarChart3, ChevronDown, ChevronUp, GraduationCap, Calculator,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export function GradesPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const isTeacher = currentUser?.role === "Teacher";
  const teacherCourses = isTeacher
    ? mockCourses.filter((c) => c.teacherId === currentUser.id)
    : mockCourses;

  const [selectedCourse, setSelectedCourse] = useState(teacherCourses[0]?.id ?? "");
  const [gradesPosted, setGradesPosted] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const course = mockCourses.find((c) => c.id === selectedCourse);
  const courseGrades = mockGrades.filter((g) => g.courseId === selectedCourse);
  const courseAssessments = mockAssessments.filter((a) => a.courseId === selectedCourse);
  const courseEnrollments = mockEnrollments.filter((e) => e.courseId === selectedCourse);

  // By Student View data
  const studentGradeMap: Record<string, { studentId: string; studentName: string; rollNumber: string; grades: typeof courseGrades; totalMarks: number; totalPossible: number }> = {};
  courseEnrollments.forEach((enr) => {
    const studentGrades = courseGrades.filter((g) => g.studentId === enr.studentId);
    const totalMarks = studentGrades.reduce((s, g) => s + g.marksObtained, 0);
    const totalPossible = studentGrades.reduce((s, g) => s + g.totalMarks, 0);
    studentGradeMap[enr.studentId] = { studentId: enr.studentId, studentName: enr.studentName, rollNumber: mockStudents.find((s) => s.id === enr.studentId)?.rollNumber ?? "", grades: studentGrades, totalMarks, totalPossible };
  });

  // By Assessment View data
  const assessmentStats = courseAssessments.map((a) => {
    const aGrades = courseGrades.filter((g) => g.assessmentId === a.id);
    const avg = aGrades.length > 0 ? (aGrades.reduce((s, g) => s + g.marksObtained, 0) / aGrades.length).toFixed(1) : "—";
    const highest = aGrades.length > 0 ? Math.max(...aGrades.map((g) => g.marksObtained)) : 0;
    const lowest = aGrades.length > 0 ? Math.min(...aGrades.map((g) => g.marksObtained)) : 0;
    const dist = [
      { range: "90-100", count: aGrades.filter((g) => g.marksObtained >= 90).length },
      { range: "80-89", count: aGrades.filter((g) => g.marksObtained >= 80 && g.marksObtained < 90).length },
      { range: "70-79", count: aGrades.filter((g) => g.marksObtained >= 70 && g.marksObtained < 80).length },
      { range: "60-69", count: aGrades.filter((g) => g.marksObtained >= 60 && g.marksObtained < 70).length },
      { range: "<60", count: aGrades.filter((g) => g.marksObtained < 60).length },
    ];
    return { ...a, avg, highest, lowest, dist, studentCount: aGrades.length };
  });

  // Grade distribution chart
  const gradeDistribution = [
    { grade: "A+", count: courseGrades.filter((g) => g.letterGrade === "A+").length, fill: "#10b981" },
    { grade: "A", count: courseGrades.filter((g) => g.letterGrade === "A").length, fill: "#34d399" },
    { grade: "A-", count: courseGrades.filter((g) => g.letterGrade === "A-").length, fill: "#6ee7b7" },
    { grade: "B+", count: courseGrades.filter((g) => g.letterGrade === "B+").length, fill: "#fbbf24" },
    { grade: "B", count: courseGrades.filter((g) => g.letterGrade === "B").length, fill: "#f59e0b" },
    { grade: "C", count: courseGrades.filter((g) => g.letterGrade === "C").length, fill: "#f87171" },
  ];

  const getLetterGrade = (pct: number): string => {
    if (pct >= 95) return "A+";
    if (pct >= 90) return "A";
    if (pct >= 85) return "A-";
    if (pct >= 80) return "B+";
    if (pct >= 75) return "B";
    if (pct >= 70) return "B-";
    if (pct >= 60) return "C";
    return "F";
  };

  const gradeColorMap: Record<string, string> = {
    "A+": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "A": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "A-": "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    "B+": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "B": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "C": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "F": "bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grading</h1>
          <p className="text-muted-foreground">{isTeacher ? "Manage gradebook, view distributions, and export grades" : "View your academic performance and grades"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <FileSpreadsheet className="w-3 h-3 mr-1" />Export Excel
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="w-3 h-3 mr-1" />Export PDF
          </Button>
        </div>
      </div>

      {/* Course selector & grade visibility */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            {teacherCourses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isTeacher && (
          <div className="flex items-center gap-2 ml-auto">
            <Label className="text-sm">Grades {gradesPosted ? "visible" : "hidden"} to students</Label>
            <Switch checked={gradesPosted} onCheckedChange={setGradesPosted} />
            {gradesPosted ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
          </div>
        )}
      </div>

      <Tabs defaultValue="student" className="space-y-4">
        <TabsList>
          <TabsTrigger value="student">By Student</TabsTrigger>
          <TabsTrigger value="assignment">By Assessment</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* By Student View */}
        <TabsContent value="student" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Student Grades — {course?.code ?? ""} ({Object.keys(studentGradeMap).length} students)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-2.5 px-3 text-xs font-semibold">Student</th>
                      {courseAssessments.map((a) => (
                        <th key={a.id} className="text-center py-2.5 px-3 text-xs font-semibold">
                          <div className="truncate max-w-[90px]">{a.title.length > 12 ? a.title.slice(0, 12) + "…" : a.title}</div>
                          <div className="text-[10px] font-normal text-muted-foreground">/{a.totalMarks} ({a.weightage}%)</div>
                        </th>
                      ))}
                      <th className="text-center py-2.5 px-3 text-xs font-semibold">Weighted Total</th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(studentGradeMap).map((sg) => {
                      const pct = sg.totalPossible > 0 ? (sg.totalMarks / sg.totalPossible * 100) : 0;
                      const letter = getLetterGrade(pct);
                      const isExpanded = expandedStudent === sg.studentId;
                      return (
                        <tr key={sg.studentId} className="border-b hover:bg-muted/30">
                          <td className="py-2.5 px-3">
                            <p className="font-medium text-xs">{sg.studentName}</p>
                            <p className="text-[10px] text-muted-foreground">{sg.rollNumber}</p>
                          </td>
                          {courseAssessments.map((a) => {
                            const grade = sg.grades.find((g) => g.assessmentId === a.id);
                            return (
                              <td key={a.id} className="py-2.5 px-3 text-center">
                                {grade ? (
                                  <Input
                                    type="number"
                                    defaultValue={grade.marksObtained}
                                    className="w-14 h-7 text-xs text-center mx-auto"
                                  />
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="py-2.5 px-3 text-center">
                            <span className="text-xs font-bold">{sg.totalMarks}/{sg.totalPossible}</span>
                            <p className="text-[10px] text-muted-foreground">{pct.toFixed(1)}%</p>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <Badge className={`text-[10px] px-2 ${gradeColorMap[letter] ?? ""}`}>{letter}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Assessment View */}
        <TabsContent value="assignment" className="space-y-4">
          {assessmentStats.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{a.type}</Badge>
                        <Badge variant="secondary" className="text-xs">{a.weightage}% weight</Badge>
                      </div>
                      <CardTitle className="text-base">{a.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{a.date} · {a.duration} min · {a.questionsCount} questions</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold">{a.avg}</p>
                      <p className="text-[10px] text-muted-foreground">Class Avg</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{a.highest}</p>
                      <p className="text-[10px] text-muted-foreground">Highest</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-lg font-bold">{a.avg}</p>
                      <p className="text-[10px] text-muted-foreground">Average</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <p className="text-lg font-bold text-red-700 dark:text-red-400">{a.lowest}</p>
                      <p className="text-[10px] text-muted-foreground">Lowest</p>
                    </div>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={a.dist} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                        <YAxis dataKey="range" type="category" tick={{ fontSize: 10 }} width={50} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">{a.studentCount} students assessed</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {assessmentStats.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No assessments found for this course
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Overview View */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600" /> Grade Calculation Formula
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {courseAssessments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm">{a.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">{a.totalMarks} marks</Badge>
                        <Badge variant="secondary" className="text-xs">{a.weightage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-semibold">Grade Scale</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <span>A+ : 95-100</span><span>B+ : 80-84</span>
                    <span>A : 90-94</span><span>B : 75-79</span>
                    <span>A- : 85-89</span><span>C : 60-74</span>
                    <span>B- : 80-84</span><span>F : &lt;60</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  <Award className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Class Average</p>
                    <p className="text-xs text-muted-foreground">
                      {courseGrades.length > 0
                        ? (courseGrades.reduce((s, g) => s + (g.marksObtained / g.totalMarks * 100), 0) / courseGrades.length).toFixed(1)
                        : "—"}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
