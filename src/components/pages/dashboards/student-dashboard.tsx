"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  ClipboardCheck, 
  Award, 
  Loader2,
  FileText,
  Calendar,
  ChevronRight,
  User,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  classLevel: string;
  section: string;
  teachers: { name: string }[];
  icon?: string;
  color?: string;
}

export function StudentDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const setPage = useAppStore((s) => s.setCurrentPage);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) { 
        const json = await res.json(); 
        setCourses(json.data ?? []); 
      }
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If a course is selected, show course details
  if (selectedCourse) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedCourse(null)}
          className="mb-2"
        >
          ← Back to My Courses
        </Button>

        {/* Course Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{selectedCourse.title}</h1>
            <p className="text-muted-foreground mt-1">
              {selectedCourse.code} • Class {selectedCourse.classLevel} - Section {selectedCourse.section}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Teacher: {selectedCourse.teachers[0]?.name || "Not assigned"}
            </p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-bold mt-1">—</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                  <p className="text-2xl font-bold mt-1">—</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="text-2xl font-bold mt-1">—</p>
                </div>
                <Award className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <p className="text-2xl font-bold mt-1">—</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Sections */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setPage("assignments")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Assignments
              </CardTitle>
              <CardDescription>View and submit your assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <Badge variant="secondary">—</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <Badge variant="secondary">—</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setPage("attendance")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                Attendance
              </CardTitle>
              <CardDescription>Track your attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Present</span>
                  <Badge variant="secondary">—</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Percentage</span>
                  <Badge variant="secondary">—%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setPage("grades")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Grades
              </CardTitle>
              <CardDescription>View your grades and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Grade</span>
                  <Badge variant="secondary">—</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Class Average</span>
                  <Badge variant="secondary">—</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setPage("courses")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Course Materials
              </CardTitle>
              <CardDescription>Access study materials and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Documents</span>
                  <Badge variant="secondary">—</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Videos</span>
                  <Badge variant="secondary">—</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {currentUser?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1">
          Class {currentUser?.classLevel || "—"} - Section {currentUser?.section || "—"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">My Subjects</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">{courses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Attendance</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">—%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Average Grade</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">—</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Assignments</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">—</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {courses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Subjects Enrolled</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              You haven't been enrolled in any subjects yet. Your enrolled subjects will appear here once added by the Branch Admin.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Course Cards Grid */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Subjects</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <Card 
                key={course.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                onClick={() => setSelectedCourse(course)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl ${course.color || 'bg-gradient-to-br from-emerald-500 to-teal-600'} flex items-center justify-center`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {course.code}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="truncate">{course.teachers[0]?.name || "No teacher"}</span>
                  </div>
                  
                  <div className="pt-2 border-t space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Attendance</span>
                      <Badge variant="secondary" className="text-xs">—%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Grade</span>
                      <Badge variant="secondary" className="text-xs">—</Badge>
                    </div>
                  </div>

                  <Button className="w-full mt-2" size="sm" variant="outline">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950"
              onClick={() => setPage("assignments")}
            >
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="font-medium">My Assignments</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950"
              onClick={() => setPage("attendance")}
            >
              <ClipboardCheck className="w-6 h-6 text-emerald-600" />
              <span className="font-medium">Attendance</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950"
              onClick={() => setPage("grades")}
            >
              <Award className="w-6 h-6 text-amber-600" />
              <span className="font-medium">My Grades</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950"
              onClick={() => setPage("timetable")}
            >
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="font-medium">Timetable</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
