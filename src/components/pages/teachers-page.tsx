"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  GraduationCap, Search, UserPlus, BookOpen, MoreVertical,
  Loader2, RefreshCw, Eye, EyeOff, AlertCircle, Pencil, Trash2,
  Key, Copy, CheckCircle2, XCircle, Star, Users, Clock,
  Phone, BadgeCheck, BookMarked, ListChecks,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  employeeId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  plainPassword?: string | null;
  taughtCoursesCount: number;
}

interface Course {
  id: string;
  code: string;
  title: string;
  classLevel: string;
  section?: string;
}

interface Assignment {
  id: string;
  courseId: string;
  teacherId: string;
  isPrimary: boolean;
  course: {
    id: string;
    code: string;
    title: string;
    classLevel: string;
    section?: string;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(iso?: string) {
  if (!iso) return "Never";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeachersPage() {
  // ── State: data ──
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ── State: add teacher dialog ──
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", employeeId: "", phone: "", password: "" });
  const [showAddPw, setShowAddPw] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // ── State: edit teacher dialog ──
  const [editOpen, setEditOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [editForm, setEditForm] = useState({ name: "", employeeId: "", phone: "", password: "" });
  const [showEditPw, setShowEditPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [copiedPw, setCopiedPw] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ── State: credentials dialog ──
  const [credOpen, setCredOpen] = useState(false);
  const [credTeacher, setCredTeacher] = useState<Teacher | null>(null);
  const [showCredPw, setShowCredPw] = useState(false);
  const [copiedCredPw, setCopiedCredPw] = useState(false);

  // ── State: delete dialog ──
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ── State: course assignment sheet ──
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTeacher, setAssignTeacher] = useState<Teacher | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ─── Data Fetching ─────────────────────────────────────────────────────────

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users?role=Teacher");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setTeachers(json.data?.users ?? []);
    } catch {
      setError("Failed to load teachers. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) return;
      const json = await res.json();
      setCourses(json.data ?? []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, [fetchTeachers, fetchCourses]);

  // ─── Add Teacher ───────────────────────────────────────────────────────────

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");

    if (!addForm.name.trim()) { setAddError("Full name is required."); return; }
    if (!addForm.employeeId.trim()) { setAddError("Employee ID is required."); return; }
    if (addForm.password.length < 8) { setAddError("Password must be at least 8 characters."); return; }

    setIsAdding(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name.trim(),
          employeeId: addForm.employeeId.trim(),
          phone: addForm.phone.trim() || undefined,
          password: addForm.password,
          role: "Teacher",
        }),
      });
      const json = await res.json();
      if (!res.ok) { setAddError(json.error ?? "Failed to create teacher."); return; }
      setAddSuccess(`✓ ${addForm.name} added successfully.`);
      setAddForm({ name: "", employeeId: "", phone: "", password: "" });
      fetchTeachers();
      setTimeout(() => { setAddOpen(false); setAddSuccess(""); }, 1800);
    } catch {
      setAddError("Network error. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // ─── Edit Teacher ──────────────────────────────────────────────────────────

  const openEdit = (t: Teacher) => {
    setEditTeacher(t);
    setEditForm({ name: t.name, employeeId: t.employeeId ?? "", phone: t.phone ?? "", password: "" });
    setEditError("");
    setEditSuccess("");
    setShowEditPw(false);
    setShowCurrentPw(false);
    setCopiedPw(false);
    setEditOpen(true);
  };

  const handleEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeacher) return;
    setEditError("");
    setEditSuccess("");

    if (!editForm.name.trim()) { setEditError("Full name is required."); return; }
    if (editForm.password && editForm.password.length < 8) { setEditError("New password must be at least 8 characters."); return; }

    setIsEditing(true);
    try {
      const payload: Record<string, unknown> = {
        id: editTeacher.id,
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || undefined,
        employeeId: editForm.employeeId.trim() || undefined,
      };
      if (editForm.password) payload.password = editForm.password;

      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { setEditError(json.error ?? "Failed to update."); return; }
      setEditSuccess("✓ Updated successfully.");
      fetchTeachers();
      setTimeout(() => { setEditOpen(false); setEditTeacher(null); setEditSuccess(""); }, 1800);
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  // ─── Delete Teacher ────────────────────────────────────────────────────────

  const openDelete = (t: Teacher) => {
    setDeleteTeacher(t);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTeacher) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTeacher.id }),
      });
      const json = await res.json();
      if (!res.ok) { setDeleteError(json.error ?? "Failed to delete."); return; }
      fetchTeachers();
      setDeleteOpen(false);
      setDeleteTeacher(null);
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Toggle Active ─────────────────────────────────────────────────────────

  const toggleActive = async (t: Teacher) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, isActive: !t.isActive }),
    });
    fetchTeachers();
  };

  // ─── Course Assignment Sheet ───────────────────────────────────────────────

  const openAssign = async (t: Teacher) => {
    setAssignTeacher(t);
    setAssignOpen(true);
    setAssignLoading(true);
    try {
      const res = await fetch(`/api/course-teachers?teacherId=${t.id}`);
      if (res.ok) {
        const json = await res.json();
        setAssignments(json.data ?? []);
      }
    } catch { /* silent */ }
    finally { setAssignLoading(false); }
  };

  const toggleCourse = async (course: Course) => {
    if (!assignTeacher) return;
    const existing = assignments.find(
      (a) => a.courseId === course.id && a.teacherId === assignTeacher.id
    );
    setTogglingId(course.id);
    try {
      if (existing) {
        await fetch(`/api/course-teachers?id=${existing.id}`, { method: "DELETE" });
        setAssignments((prev) => prev.filter((a) => a.id !== existing.id));
      } else {
        const res = await fetch("/api/course-teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course.id, teacherId: assignTeacher.id, isPrimary: false }),
        });
        if (res.ok) {
          const json = await res.json();
          setAssignments((prev) => [...prev, json.data]);
        }
      }
      // Refresh teacher card counts
      fetchTeachers();
    } catch { /* silent */ }
    finally { setTogglingId(null); }
  };

  const togglePrimary = async (assignment: Assignment) => {
    setTogglingId(assignment.courseId + "-primary");
    try {
      await fetch("/api/course-teachers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: assignment.id, isPrimary: !assignment.isPrimary }),
      });
      setAssignments((prev) =>
        prev.map((a) => {
          if (a.courseId === assignment.courseId) {
            return { ...a, isPrimary: a.id === assignment.id ? !assignment.isPrimary : false };
          }
          return a;
        })
      );
    } catch { /* silent */ }
    finally { setTogglingId(null); }
  };

  // ─── Derived State ─────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.employeeId ?? "").toLowerCase().includes(q) ||
        (t.phone ?? "").includes(q)
    );
  }, [teachers, search]);

  const stats = useMemo(() => ({
    total: teachers.length,
    active: teachers.filter((t) => t.isActive).length,
    inactive: teachers.filter((t) => !t.isActive).length,
    coursesAssigned: teachers.reduce((s, t) => s + (t.taughtCoursesCount ?? 0), 0),
  }), [teachers]);

  // Group courses by classLevel for the assignment sheet
  const groupedCourses = useMemo(() => {
    const map: Record<string, Course[]> = {};
    courses.forEach((c) => {
      const key = c.classLevel || "General";
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [courses]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading ? "Loading…" : `${stats.total} teacher${stats.total !== 1 ? "s" : ""} in your branch`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { fetchTeachers(); fetchCourses(); }} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
            onClick={() => { setAddForm({ name: "", employeeId: "", phone: "", password: "" }); setAddError(""); setAddSuccess(""); setAddOpen(true); }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Teachers", value: stats.total, icon: Users, color: "text-slate-600", bg: "bg-slate-100" },
          { label: "Active", value: stats.active, icon: BadgeCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Inactive", value: stats.inactive, icon: XCircle, color: "text-red-500", bg: "bg-red-100" },
          { label: "Course Assignments", value: stats.coursesAssigned, icon: BookOpen, color: "text-sky-600", bg: "bg-sky-100" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, employee ID, or phone…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading teachers…</span>
        </div>
      )}

      {/* ── Teacher Cards Grid ── */}
      {!isLoading && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-muted-foreground">
                {search ? "No teachers match your search" : "No teachers yet"}
              </p>
              {!search && (
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Click "Add Teacher" to add your first teacher.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onAssign={() => openAssign(teacher)}
                  onEdit={() => openEdit(teacher)}
                  onCredentials={() => { setCredTeacher(teacher); setShowCredPw(false); setCopiedCredPw(false); setCredOpen(true); }}
                  onToggleActive={() => toggleActive(teacher)}
                  onDelete={() => openDelete(teacher)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          Add Teacher Dialog
          ══════════════════════════════════════════════════════════ */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) { setAddError(""); setAddSuccess(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-emerald-600" />
              </div>
              Add New Teacher
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTeacher} className="space-y-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g., Mr. Ahmed Khan"
                  disabled={isAdding}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Employee ID <span className="text-destructive">*</span></Label>
                <Input
                  value={addForm.employeeId}
                  onChange={(e) => setAddForm({ ...addForm, employeeId: e.target.value })}
                  placeholder="EMP-2024-001"
                  disabled={isAdding}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="+92-300-0000000"
                  disabled={isAdding}
                />
              </div>
            </div>

            <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
              <p className="text-xs text-sky-700 dark:text-sky-300">
                <strong>Login:</strong> Teacher will sign in using their Employee ID and the password below.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input
                  type={showAddPw ? "text" : "password"}
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="pr-10"
                  disabled={isAdding}
                />
                <button type="button" onClick={() => setShowAddPw(!showAddPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showAddPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Share this password with the teacher so they can sign in.</p>
            </div>

            {addError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{addError}
              </div>
            )}
            {addSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{addSuccess}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={isAdding}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isAdding}>
                {isAdding ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Adding…</> : <><UserPlus className="w-4 h-4 mr-2" />Add Teacher</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Edit Teacher Dialog
          ══════════════════════════════════════════════════════════ */}
      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { setEditTeacher(null); setEditError(""); setEditSuccess(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-blue-600" />
              </div>
              Edit Teacher
            </DialogTitle>
          </DialogHeader>
          {editTeacher && (
            <form onSubmit={handleEditTeacher} className="space-y-4 py-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label>Full Name <span className="text-destructive">*</span></Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Full name"
                    disabled={isEditing}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Employee ID</Label>
                  <Input
                    value={editForm.employeeId}
                    onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                    placeholder="EMP-2024-001"
                    disabled={isEditing}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+92-300-0000000"
                    disabled={isEditing}
                  />
                </div>
              </div>

              <Separator />

              {/* Current password (read-only) */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={editTeacher.plainPassword ?? ""}
                    readOnly
                    className="pr-20 bg-muted/50 cursor-default font-mono text-sm"
                    placeholder="Not available for old accounts"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {editTeacher.plainPassword && (
                      <button type="button"
                        onClick={() => { navigator.clipboard.writeText(editTeacher.plainPassword!); setCopiedPw(true); setTimeout(() => setCopiedPw(false), 2000); }}
                        className="text-muted-foreground hover:text-foreground p-1">
                        {copiedPw ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="text-muted-foreground hover:text-foreground p-1">
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>New Password <span className="text-xs text-muted-foreground">(leave blank to keep current)</span></Label>
                <div className="relative">
                  <Input
                    type={showEditPw ? "text" : "password"}
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="pr-10"
                    disabled={isEditing}
                  />
                  <button type="button" onClick={() => setShowEditPw(!showEditPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showEditPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {editError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{editError}
                </div>
              )}
              {editSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{editSuccess}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={isEditing}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isEditing}>
                  {isEditing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : <><Pencil className="w-4 h-4 mr-2" />Save Changes</>}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Credentials Dialog
          ══════════════════════════════════════════════════════════ */}
      <Dialog open={credOpen} onOpenChange={(o) => { setCredOpen(o); if (!o) { setCredTeacher(null); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Key className="w-4 h-4 text-amber-600" />
              </div>
              Login Credentials
            </DialogTitle>
          </DialogHeader>
          {credTeacher && (
            <div className="space-y-4 py-1">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Teacher Name</p>
                <div className="p-3 bg-muted rounded-lg text-sm font-medium">{credTeacher.name}</div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Employee ID (Login)</p>
                <div className="p-3 bg-muted rounded-lg text-sm font-mono font-medium">
                  {credTeacher.employeeId ?? "—"}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Password</p>
                {credTeacher.plainPassword ? (
                  <div className="relative">
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm pr-20">
                      {showCredPw ? credTeacher.plainPassword : "••••••••"}
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button type="button"
                        onClick={() => { navigator.clipboard.writeText(credTeacher.plainPassword!); setCopiedCredPw(true); setTimeout(() => setCopiedCredPw(false), 2000); }}
                        className="text-muted-foreground hover:text-foreground p-1">
                        {copiedCredPw ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button type="button" onClick={() => setShowCredPw(!showCredPw)}
                        className="text-muted-foreground hover:text-foreground p-1">
                        {showCredPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 text-xs text-amber-700 dark:text-amber-300">
                    Password not available. Use Edit to reset it.
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setCredOpen(false)} className="w-full">Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          Delete Confirmation
          ══════════════════════════════════════════════════════════ */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTeacher?.name}</strong>?
              This cannot be undone. Teachers with assigned courses must have their course assignments removed first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{deleteError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting…</> : "Delete Teacher"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ══════════════════════════════════════════════════════════
          Course Assignment Sheet
          ══════════════════════════════════════════════════════════ */}
      <Sheet open={assignOpen} onOpenChange={(o) => { setAssignOpen(o); if (!o) { setAssignTeacher(null); setAssignments([]); } }}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col" side="right">
          <SheetHeader className="pb-4 border-b">
            {assignTeacher && (
              <>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor(assignTeacher.id)}`}>
                    {initials(assignTeacher.name)}
                  </div>
                  <div>
                    <SheetTitle className="text-base">{assignTeacher.name}</SheetTitle>
                    <SheetDescription className="text-xs">
                      {assignTeacher.employeeId} · Assign or remove courses
                    </SheetDescription>
                  </div>
                </div>
              </>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-5">
            {assignLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-500 mr-2" />
                <span className="text-sm text-muted-foreground">Loading courses…</span>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No courses available</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Create courses first from the Courses page, then assign them here.
                </p>
              </div>
            ) : (
              <>
                {/* Legend */}
                <div className="flex gap-4 text-xs text-muted-foreground px-1">
                  <span className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                    Assigned
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    Primary Teacher
                  </span>
                </div>

                {/* Grouped by class level */}
                {groupedCourses.map(([classLevel, levelCourses]) => (
                  <div key={classLevel}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <BookMarked className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {classLevel}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">{levelCourses.length} course{levelCourses.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="space-y-2">
                      {levelCourses.map((course) => {
                        const assignment = assignTeacher
                          ? assignments.find((a) => a.courseId === course.id && a.teacherId === assignTeacher.id)
                          : undefined;
                        const isAssigned = !!assignment;
                        const isPrimary = assignment?.isPrimary ?? false;
                        const isToggling = togglingId === course.id;
                        const isPrimaryToggling = togglingId === course.id + "-primary";

                        return (
                          <div
                            key={course.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                              isAssigned
                                ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                                : "border-border bg-card hover:bg-muted/30"
                            }`}
                          >
                            {/* Assign toggle */}
                            <button
                              type="button"
                              onClick={() => toggleCourse(course)}
                              disabled={isToggling || isPrimaryToggling}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isAssigned
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-muted-foreground/40 hover:border-emerald-400"
                              }`}
                            >
                              {isToggling ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : isAssigned ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : null}
                            </button>

                            {/* Course info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{course.title}</p>
                              <p className="text-xs text-muted-foreground font-mono">{course.code}</p>
                            </div>

                            {/* Primary star — only visible when assigned */}
                            {isAssigned && (
                              <button
                                type="button"
                                onClick={() => assignment && togglePrimary(assignment)}
                                disabled={isPrimaryToggling}
                                title={isPrimary ? "Remove as primary teacher" : "Set as primary teacher"}
                                className="flex-shrink-0 p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                              >
                                {isPrimaryToggling ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                                ) : (
                                  <Star
                                    className={`w-4 h-4 transition-colors ${
                                      isPrimary
                                        ? "text-amber-500 fill-amber-400"
                                        : "text-muted-foreground/40 hover:text-amber-400"
                                    }`}
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer summary */}
          {!assignLoading && assignTeacher && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4" />
                  {assignments.filter((a) => a.teacherId === assignTeacher.id).length} course{assignments.filter((a) => a.teacherId === assignTeacher.id).length !== 1 ? "s" : ""} assigned
                </span>
                <Button variant="outline" size="sm" onClick={() => setAssignOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Teacher Card ─────────────────────────────────────────────────────────────

interface TeacherCardProps {
  teacher: Teacher;
  onAssign: () => void;
  onEdit: () => void;
  onCredentials: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

function TeacherCard({ teacher, onAssign, onEdit, onCredentials, onToggleActive, onDelete }: TeacherCardProps) {
  const color = avatarColor(teacher.id);

  return (
    <Card className="rounded-xl hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Top row: avatar + name + status badge */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${color}`}>
            {initials(teacher.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">{teacher.name}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{teacher.employeeId ?? "—"}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] flex-shrink-0 ${
              teacher.isActive
                ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                : "text-red-500 border-red-200 bg-red-50"
            }`}
          >
            {teacher.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{teacher.taughtCoursesCount ?? 0} course{(teacher.taughtCoursesCount ?? 0) !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{timeAgo(teacher.lastLogin)}</span>
          </div>
          {teacher.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{teacher.phone}</span>
            </div>
          )}
        </div>

        <Separator className="mb-3" />

        {/* Action row */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8"
            onClick={onAssign}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Manage Courses
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onCredentials}>
                <Key className="w-4 h-4 mr-2" />View Credentials
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-2" />Edit Teacher
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleActive}>
                {teacher.isActive ? (
                  <><XCircle className="w-4 h-4 mr-2" />Deactivate</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4 mr-2" />Activate</>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />Delete Teacher
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
