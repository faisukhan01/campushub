"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  Loader2, 
  GraduationCap,
  FileText,
  Bell,
  Calendar,
  ChevronRight,
  BookMarked,
  BarChart3,
  Upload
} from "lucide-react";

interface ClassSection {
  classLevel: string;
  section: string;
  courses: Course[];
  totalStudents: number;
}

interface Course {
  id: string;
  code: string;
  title: string;
  classLevel: string;
  section: string;
  enrolledStudentsCount: number;
  icon?: string;
  color?: string;
}

export function TeacherDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const setPage = useAppStore((s) => s.setCurrentPage);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassSection | null>(null);

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

  // Group courses by class and section
  const classSections: ClassSection[] = courses.reduce((acc, course) => {
    const key = `${course.classLevel}-${course.section || 'A'}`;
    const existing = acc.find(c => `${c.classLevel}-${c.section}` === key);
    
    if (existing) {
      existing.courses.push(course);
      existing.totalStudents += course.enrolledStudentsCount;
    } else {
      acc.push({
        classLevel: course.classLevel,
        section: course.section || 'A',
        courses: [course],
        totalStudents: course.enrolledStudentsCount
      });
    }
    return acc;
  }, [] as ClassSection[]);

  // Sort by class level
  classSections.sort((a, b) => {
    const aNum = parseInt(a.classLevel) || 0;
    const bNum = parseInt(b.classLevel) || 0;
    if (aNum !== bNum) return bNum - aNum;
    return a.section.localeCompare(b.section);
  });

  const totalStudents = courses.reduce((sum, c) => sum + c.enrolledStudentsCount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If a class is selected, show course details
  if (selectedClass) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedClass(null)}
          className="mb-2"
        >
          ← Back to Classes
        </Button>

        {/* Class Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Class {selectedClass.classLevel} - Section {selectedClass.section}
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedClass.courses.length} Course{selectedClass.courses.length !== 1 ? 's' : ''} • {selectedClass.totalStudents} Students
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedClass.courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${course.color || 'bg-gradient-to-br from-emerald-500 to-teal-600'} flex items-center justify-center`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{course.code}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-semibold">{course.enrolledStudentsCount}</span>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button size="sm" variant="outline" className="h-auto py-2 flex flex-col gap-1">
                    <ClipboardCheck className="w-4 h-4" />
                    <span className="text-xs">Attendance</span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-auto py-2 flex flex-col gap-1">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs">Assignments</span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-auto py-2 flex flex-col gap-1">
                    <Upload className="w-4 h-4" />
                    <span className="text-xs">Materials</span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-auto py-2 flex flex-col gap-1">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs">Announce</span>
                  </Button>
                </div>

                <Button className="w-full" size="sm" onClick={() => setPage("courses")}>
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
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
        <p className="text-muted-foreground mt-1">Manage your classes and courses</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Classes</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">{classSections.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Courses</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{courses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Students</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Attendance</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">—</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {classSections.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Classes Assigned</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              You haven't been assigned to any classes yet. Contact your Branch Admin to get assigned to courses.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Class Cards Grid */}
      {classSections.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Classes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {classSections.map((classSection) => (
              <Card 
                key={`${classSection.classLevel}-${classSection.section}`}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                onClick={() => setSelectedClass(classSection)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {classSection.courses.length} Course{classSection.courses.length !== 1 ? 's' : ''}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-2xl">
                    Class {classSection.classLevel}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold">
                    Section {classSection.section}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{classSection.totalStudents} Students</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Courses:</p>
                    <div className="space-y-1">
                      {classSection.courses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span className="text-xs truncate">{course.title}</span>
                        </div>
                      ))}
                      {classSection.courses.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-3.5">
                          +{classSection.courses.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {classSections.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950"
              onClick={() => setPage("attendance")}
            >
              <ClipboardCheck className="w-6 h-6 text-emerald-600" />
              <span className="font-medium">Mark Attendance</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950"
              onClick={() => setPage("assignments")}
            >
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Assignments</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950"
              onClick={() => setPage("grades")}
            >
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="font-medium">Grades</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300 dark:hover:bg-amber-950"
              onClick={() => setPage("announcements")}
            >
              <Bell className="w-6 h-6 text-amber-600" />
              <span className="font-medium">Announcements</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
