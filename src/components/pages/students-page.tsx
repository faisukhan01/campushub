"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  GraduationCap, Search, Loader2, RefreshCw, AlertCircle, Users, UserPlus, Eye, EyeOff, CheckCircle2, Plus, MoreVertical, Pencil,
} from "lucide-react";
import { onDataChange, notifyStudentChange } from "@/lib/data-sync";

const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rollNumber?: string;
  classLevel?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export function StudentsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const callerRole = currentUser?.role as string | undefined;

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Add Student Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Edit Student Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    rollNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [editShowPassword, setEditShowPassword] = useState(false);
  const [editShowConfirmPassword, setEditShowConfirmPassword] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!selectedClass && callerRole === "BranchAdmin") return;
    
    setIsLoading(true);
    setError("");
    try {
      console.log('[STUDENTS] Fetching students for class:', selectedClass);
      // Add cache-busting parameter
      const timestamp = Date.now();
      const res = await fetch(`/api/users?role=Student&_t=${timestamp}`);
      console.log('[STUDENTS] API response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('[STUDENTS] API error:', errorText);
        throw new Error(errorText);
      }
      
      const json = await res.json();
      console.log('[STUDENTS] API response:', json);
      
      let allStudents = json.data?.users ?? [];
      console.log('[STUDENTS] Total students from API:', allStudents.length);
      
      // Filter by selected class for branch admin
      if (selectedClass && callerRole === "BranchAdmin") {
        console.log('[STUDENTS] Filtering for class:', selectedClass);
        allStudents = allStudents.filter(
          (s: StudentUser) => {
            const matches = s.classLevel === selectedClass || s.classLevel === `Class ${selectedClass}`;
            console.log(`[STUDENTS] Student ${s.name} (class: ${s.classLevel}) matches: ${matches}`);
            return matches;
          }
        );
        console.log('[STUDENTS] Filtered students:', allStudents.length);
      }
      
      setStudents(allStudents);
      console.log('[STUDENTS] Students state updated with', allStudents.length, 'students');
    } catch (err) {
      console.error('[STUDENTS] Error fetching students:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load students. Please refresh.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, callerRole]);

  useEffect(() => {
    if (callerRole !== "BranchAdmin" || selectedClass) {
      fetchStudents();
    }
  }, [fetchStudents, callerRole, selectedClass]);

  // Listen for data changes from other tabs
  useEffect(() => {
    const cleanup = onDataChange((event) => {
      if (event.type === 'student_added' || event.type === 'student_updated' || event.type === 'student_deleted' || event.type === 'data_refresh') {
        console.log('[STUDENTS] Data change detected from another tab, refreshing...', event.type);
        fetchStudents();
      }
    });

    return cleanup;
  }, [fetchStudents]);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNumber ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validation
    if (!formData.name || !formData.rollNumber || !formData.password) {
      setFormError("Name, Roll Number, and Password are required.");
      return;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          rollNumber: formData.rollNumber,
          classLevel: selectedClass,
          password: formData.password,
          role: "Student",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error ?? "Failed to create student.");
        return;
      }

      setFormSuccess(`✓ Student account created for ${formData.name}`);
      setFormData({ name: "", rollNumber: "", password: "", confirmPassword: "" });
      
      // Notify other tabs about the new student
      notifyStudentChange('added', json.data);
      
      fetchStudents();
      setTimeout(() => {
        setDialogOpen(false);
        setFormSuccess("");
      }, 1800);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditStudent = (student: StudentUser) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      rollNumber: student.rollNumber || "",
      password: "",
      confirmPassword: "",
    });
    setFormError("");
    setFormSuccess("");
    setEditDialogOpen(true);
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setFormError("");
    setFormSuccess("");

    // Validation
    if (!editFormData.name || !editFormData.rollNumber) {
      setFormError("Name and Roll Number are required.");
      return;
    }
    
    // Only validate password if it's being changed
    if (editFormData.password) {
      if (editFormData.password.length < 8) {
        setFormError("Password must be at least 8 characters.");
        return;
      }
      if (editFormData.password !== editFormData.confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const updateData: any = {
        id: editingStudent.id,
        name: editFormData.name,
        rollNumber: editFormData.rollNumber,
      };

      // Only include password if it's being changed
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error ?? "Failed to update student.");
        return;
      }

      setFormSuccess(`✓ Student updated successfully`);
      
      // Notify other tabs about the update
      notifyStudentChange('updated', json.data);
      
      fetchStudents();
      setTimeout(() => {
        setEditDialogOpen(false);
        setFormSuccess("");
        setEditingStudent(null);
      }, 1800);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading…" : selectedClass ? `${students.length} student(s) in Class ${selectedClass}` : `${students.length} student${students.length !== 1 ? "s" : ""} in your scope`}
          </p>
        </div>
        {selectedClass && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchStudents} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {callerRole === "BranchAdmin" && (
              <Dialog open={dialogOpen} onOpenChange={(o) => {
                setDialogOpen(o);
                if (!o) {
                  setFormData({ name: "", rollNumber: "", password: "", confirmPassword: "" });
                  setFormError("");
                  setFormSuccess("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Student to Class {selectedClass}</DialogTitle>
                  </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Full Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Student full name"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Roll Number / College ID <span className="text-destructive">*</span></Label>
                    <Input
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="e.g., 2021-CS-001"
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">This will be used as their login identifier.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Password <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min. 8 characters"
                        className="pr-10"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="pr-10"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      {formSuccess}
                    </div>
                  )}

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white" disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {isSaving ? "Creating…" : "Add Student"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          </div>
        )}
      </div>

      {/* Class Selection for Branch Admin */}
      {callerRole === "BranchAdmin" && !selectedClass ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a Class</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Choose a class level to view and manage its students
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {CLASSES.map((classNum) => (
              <Card
                key={classNum}
                className="cursor-pointer hover:shadow-lg hover:border-sky-500 transition-all duration-200 group"
                onClick={() => setSelectedClass(classNum)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <span className="text-xl font-bold text-sky-600 dark:text-sky-400 group-hover:text-white">
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
          {/* Selected Class Header for Branch Admin */}
          {callerRole === "BranchAdmin" && selectedClass && (
            <Card className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 border-sky-200 dark:border-sky-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{selectedClass}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Class {selectedClass}</h3>
                      <p className="text-sm text-muted-foreground">
                        {students.length} student(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-sky-600 hover:bg-sky-700 text-white"
                      onClick={() => setDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClass("");
                        setStudents([]);
                      }}
                    >
                      Change Class
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or roll no…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading students…</span>
        </div>
      )}

      {(selectedClass || callerRole !== "BranchAdmin") && !isLoading && students.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-sky-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No students yet</h3>
          <p className="text-sm text-muted-foreground">
            {callerRole === "BranchAdmin"
              ? `Add students to Class ${selectedClass} to get started.`
              : "Students will appear here once added by a Branch Admin."}
          </p>
        </div>
      )}

      {(selectedClass || callerRole !== "BranchAdmin") && !isLoading && filtered.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Roll No.</TableHead>
                    <TableHead className="hidden lg:table-cell">Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Last Login</TableHead>
                    {callerRole === "BranchAdmin" && <TableHead className="w-[50px]"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                              {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{student.email}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{student.rollNumber ?? "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{student.classLevel ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={student.isActive ? "text-emerald-600 border-emerald-200" : "text-red-500 border-red-200"}>
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatDate(student.lastLogin)}</TableCell>
                      {callerRole === "BranchAdmin" && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Student
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
        </>
      )}

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(o) => {
        setEditDialogOpen(o);
        if (!o) {
          setEditingStudent(null);
          setEditFormData({ name: "", rollNumber: "", password: "", confirmPassword: "" });
          setFormError("");
          setFormSuccess("");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateStudent} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Student full name"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label>Roll Number / College ID <span className="text-destructive">*</span></Label>
              <Input
                value={editFormData.rollNumber}
                onChange={(e) => setEditFormData({ ...editFormData, rollNumber: e.target.value })}
                placeholder="e.g., 2021-CS-001"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label>New Password <span className="text-muted-foreground text-xs">(leave blank to keep current)</span></Label>
              <div className="relative">
                <Input
                  type={editShowPassword ? "text" : "password"}
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="pr-10"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => setEditShowPassword(!editShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {editShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {editFormData.password && (
              <div className="space-y-2">
                <Label>Confirm New Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    type={editShowConfirmPassword ? "text" : "password"}
                    value={editFormData.confirmPassword}
                    onChange={(e) => setEditFormData({ ...editFormData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="pr-10"
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    onClick={() => setEditShowConfirmPassword(!editShowConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {editShowConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {formSuccess}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSaving ? "Updating…" : "Update Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
