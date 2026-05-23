"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
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
  BookOpen, Search, Users, Plus, Loader2, RefreshCw,
  AlertCircle, CheckCircle2, GraduationCap, Clock,
} from "lucide-react";

interface CourseRecord {
  id: string;
  code: string;
  title: string;
  description?: string;
  classLevel: string;
  subjectType: string;
  isActive: boolean;
  createdAt: string;
  branch?: { id: string; name: string; code: string };
  teachers: { id: string; name: string; email: string; isPrimary: boolean }[];
  enrolledStudentsCount: number;
  assignmentsCount: number;
}

const SUBJECT_TYPES = ["Core", "Elective", "Lab", "Project", "Extra-Curricular"];
const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const subjectTypeColors: Record<string, string> = {
  Core: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Elective: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Lab: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Project: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Extra-Curricular": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const emptyForm = { title: "", code: "", description: "", subjectType: "Core" };

export function CoursesPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const callerRole = currentUser?.role as string | undefined;

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const canManage = callerRole === "BranchAdmin" || callerRole === "InstituteAdmin" || callerRole === "SuperAdmin";

  const fetchCourses = useCallback(async () => {
    if (!selectedClass && canManage) return;
    
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      
      let allCourses = json.data ?? [];
      
      // Filter by selected class for admins
      if (selectedClass && canManage) {
        allCourses = allCourses.filter(
          (c: CourseRecord) => c.classLevel === selectedClass || c.classLevel === `Class ${selectedClass}`
        );
      }
      
      setCourses(allCourses);
    } catch {
      setError("Failed to load courses. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, canManage]);

  useEffect(() => {
    // For non-admins (students/teachers), fetch courses immediately
    // For admins, only fetch after a class is selected
    if (!canManage) {
      fetchCourses();
    } else if (selectedClass) {
      fetchCourses();
    }
  }, [fetchCourses, canManage, selectedClass]);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.classLevel.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.title || !formData.code) {
      setFormError("Title and code are required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          classLevel: selectedClass || formData.classLevel,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error ?? "Failed to create course."); return; }
      setFormSuccess(`✓ Course "${formData.title}" created successfully.`);
      setFormData({ ...emptyForm });
      fetchCourses();
      setTimeout(() => { setAddOpen(false); setFormSuccess(""); }, 1800);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const pageTitle =
    callerRole === "Teacher" ? "My Classes" :
    callerRole === "Student" ? "My Subjects" :
    "Courses";

  const pageDesc =
    callerRole === "Teacher" ? "Classes you are assigned to teach" :
    callerRole === "Student" ? "Subjects you are enrolled in" :
    "Manage all courses for your branch";

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading…" : selectedClass ? `${courses.length} course${courses.length !== 1 ? "s" : ""} for Class ${selectedClass}` : `${courses.length} course${courses.length !== 1 ? "s" : ""} · ${pageDesc}`}
          </p>
        </div>
        {selectedClass && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchCourses} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {canManage && (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setFormData({ ...emptyForm }); setFormError(""); setFormSuccess(""); setAddOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />Add Course
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Class Selection for Admins */}
      {canManage && !selectedClass ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a Class</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Choose a class level to view and manage its courses
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
          {/* Selected Class Header for Admins */}
          {canManage && selectedClass && (
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
                        {courses.length} course(s)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClass("");
                      setCourses([]);
                    }}
                  >
                    Change Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

      {/* Search */}
      {(selectedClass || !canManage) && (
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, code or class…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4" />{error}
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
      {(selectedClass || !canManage) && !isLoading && courses.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No courses yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {canManage
              ? `Add your first course for Class ${selectedClass} to get started`
              : "No courses have been added to your branch yet"}
          </p>
          {canManage && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Add First Course
            </Button>
          )}
        </div>
      )}

      {/* Course grid */}
      {(selectedClass || !canManage) && !isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <Card key={course.id} className="card-premium hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant="outline" className="text-[10px] font-mono">{course.code}</Badge>
                    <Badge className={`text-[10px] border-0 ${subjectTypeColors[course.subjectType] ?? "bg-muted text-muted-foreground"}`}>
                      {course.subjectType}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Class / Grade: <span className="font-medium text-foreground">{course.classLevel}</span>
                  {course.branch && <span> · {course.branch.name}</span>}
                </p>

                {course.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.enrolledStudentsCount} students
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {course.teachers.length > 0 ? course.teachers[0].name : "No teacher"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Course Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) { setFormData({ ...emptyForm }); setFormError(""); setFormSuccess(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              Add Course for Class {selectedClass}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label>Course Title <span className="text-destructive">*</span></Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Mathematics" disabled={isSaving} />
            </div>

            <div className="space-y-1.5">
              <Label>Code <span className="text-destructive">*</span></Label>
              <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. MATH-101" disabled={isSaving} />
            </div>

            <div className="space-y-1.5">
              <Label>Subject Type</Label>
              <Select value={formData.subjectType} onValueChange={(v) => setFormData({ ...formData, subjectType: v })} disabled={isSaving}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the course…" rows={3} disabled={isSaving} />
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{formSuccess}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={isSaving}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSaving ? "Creating…" : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  );
}
