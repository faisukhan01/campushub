"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Search, UserPlus, Shield, CheckCircle2, XCircle,
  Loader2, RefreshCw, Eye, EyeOff, AlertCircle,
} from "lucide-react";
import type { UserRole } from "@/types";

// Role colours
const roleColors: Record<string, string> = {
  SuperAdmin:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  InstituteAdmin:"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  BranchAdmin:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Teacher:       "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Student:       "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
};

// Who each role is allowed to create
const CREATABLE_ROLES: Record<string, string[]> = {
  SuperAdmin:    ["InstituteAdmin"],
  InstituteAdmin:["BranchAdmin"],
  BranchAdmin:   ["Teacher", "Student"],
};

// RBAC matrix (display only)
const rbacModules = ["Dashboard","Institutes","Branches","Departments","Batches","Courses","Students","Attendance","Assignments","Grades","Timetable","Fees","Reports","Announcements","Settings","Analytics"];
const rbacRoles: { role: string; access: boolean[] }[] = [
  { role: "SuperAdmin",    access: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true] },
  { role: "InstituteAdmin",access: [true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false] },
  { role: "BranchAdmin",   access: [true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false] },
  { role: "Teacher",       access: [true,false,false,false,false,true,true,true,true,true,true,false,false,true,false,false] },
  { role: "Student",       access: [true,false,false,false,false,true,false,true,true,true,true,true,false,true,false,false] },
];

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  instituteId?: string;
  branchId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const emptyForm = { name: "", email: "", password: "", role: "", phone: "", instituteId: "", branchId: "", employeeId: "", rollNumber: "", classLevel: "" };

export function UsersPage() {
  const { data: session } = useSession();
  const callerRole = session?.user?.role as string | undefined;

  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roleDistribution, setRoleDistribution] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showRBAC, setShowRBAC] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const creatableRoles = callerRole ? (CREATABLE_ROLES[callerRole] ?? []) : [];

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setUsers(json.data.users ?? []);
      setRoleDistribution(json.data.roleDistribution ?? {});
    } catch (e) {
      setError("Failed to load users. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validation based on role
    if (!formData.name || !formData.password || !formData.role) {
      setFormError("Name, password and role are required.");
      return;
    }

    if (formData.role === "Student") {
      if (!formData.rollNumber) {
        setFormError("Roll Number is required for Student.");
        return;
      }
    } else if (formData.role === "Teacher") {
      if (!formData.employeeId) {
        setFormError("Employee ID is required for Teacher.");
        return;
      }
    } else {
      // For InstituteAdmin and BranchAdmin, email is required
      if (!formData.email) {
        setFormError("Email is required for this role.");
        return;
      }

      // Validate personal email for InstituteAdmin
      if (formData.role === "InstituteAdmin") {
        const personalEmailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'live.com', 'msn.com', 'aol.com'];
        const emailDomain = formData.email.toLowerCase().split('@')[1];
        if (!emailDomain || !personalEmailDomains.includes(emailDomain)) {
          setFormError("Institute Admin email must be a personal email address (e.g., @gmail.com, @outlook.com, @yahoo.com)");
          return;
        }
      }
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        name: formData.name,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        instituteId: formData.instituteId || undefined,
        branchId: formData.branchId || undefined,
      };

      // Add role-specific fields
      if (formData.role === "Student") {
        payload.rollNumber = formData.rollNumber;
        payload.classLevel = formData.classLevel || undefined;
      } else if (formData.role === "Teacher") {
        payload.employeeId = formData.employeeId;
      } else {
        payload.email = formData.email;
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error ?? "Failed to create user.");
        return;
      }

      setFormSuccess(`✓ ${formData.role} account created for ${formData.name}`);
      setFormData({ ...emptyForm });
      fetchUsers();
      setTimeout(() => { setDialogOpen(false); setFormSuccess(""); }, 1800);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (user: ApiUser) => {
    try {
      await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      });
      fetchUsers();
    } catch {
      /* silent */
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "—";
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const getRoleBadge = (role: string) => (
    <Badge className={`text-xs ${roleColors[role] ?? "bg-muted text-muted-foreground"}`}>{role}</Badge>
  );

  const totalUsers = users.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading ? "Loading…" : `${totalUsers} users in your scope`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowRBAC(!showRBAC)}>
            <Shield className="w-4 h-4 mr-2" />RBAC
          </Button>

          {creatableRoles.length > 0 && (
            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setFormData({ ...emptyForm }); setFormError(""); setFormSuccess(""); } }}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4 py-2">
                  {/* Role selector — scoped to what this admin can create */}
                  <div className="space-y-2">
                    <Label>Role <span className="text-destructive">*</span></Label>
                    <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role to create" />
                      </SelectTrigger>
                      <SelectContent>
                        {creatableRoles.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Full Name <span className="text-destructive">*</span></Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full name"
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+92-300-0000000"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  {/* Dynamic field based on role */}
                  {formData.role === "Teacher" && (
                    <div className="space-y-2">
                      <Label>Employee ID <span className="text-destructive">*</span></Label>
                      <Input
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder="e.g., EMP-2024-001"
                        disabled={isSaving}
                      />
                      <p className="text-xs text-muted-foreground">This will be used as their login identifier.</p>
                    </div>
                  )}

                  {formData.role === "Student" && (
                    <>
                      <div className="space-y-2">
                        <Label>Roll Number <span className="text-destructive">*</span></Label>
                        <Input
                          value={formData.rollNumber}
                          onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                          placeholder="e.g., 2021-CS-001"
                          disabled={isSaving}
                        />
                        <p className="text-xs text-muted-foreground">This will be used as their login identifier.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Class Level</Label>
                        <Input
                          value={formData.classLevel}
                          onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                          placeholder="e.g., Year 1, Class 10A"
                          disabled={isSaving}
                        />
                      </div>
                    </>
                  )}

                  {(formData.role === "InstituteAdmin" || formData.role === "BranchAdmin") && (
                    <div className="space-y-2">
                      <Label>Email {formData.role === "InstituteAdmin" ? "(Personal)" : ""} <span className="text-destructive">*</span></Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={formData.role === "InstituteAdmin" ? "user@gmail.com" : "user@institution.edu"}
                        disabled={isSaving}
                      />
                      {formData.role === "InstituteAdmin" && (
                        <p className="text-xs text-muted-foreground">Use personal email (@gmail.com, @outlook.com, @yahoo.com, etc.)</p>
                      )}
                    </div>
                  )}

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
                    <p className="text-xs text-muted-foreground">Share this password with the user so they can sign in.</p>
                  </div>

                  {/* SuperAdmin creating InstituteAdmin needs to provide an instituteId */}
                  {callerRole === "SuperAdmin" && formData.role === "InstituteAdmin" && (
                    <div className="space-y-2">
                      <Label>Institute ID</Label>
                      <Input
                        value={formData.instituteId}
                        onChange={(e) => setFormData({ ...formData, instituteId: e.target.value })}
                        placeholder="Institute ID (optional — can be set later)"
                        disabled={isSaving}
                      />
                    </div>
                  )}

                  {/* Error / Success */}
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
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {isSaving ? "Creating…" : "Create User"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats row */}
      {!isLoading && Object.keys(roleDistribution).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(roleDistribution).map(([role, count]) => (
            <Card key={role} className="py-3">
              <CardContent className="px-4 py-0 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{role}</p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
                <Badge className={`text-[10px] ${roleColors[role] ?? "bg-muted"}`}>●</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* RBAC Matrix */}
      {showRBAC && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Role-Based Access Control Matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background min-w-[120px]">Module</TableHead>
                  {rbacRoles.map((r) => (
                    <TableHead key={r.role} className="min-w-[100px] text-center">
                      <Badge className={`text-[10px] ${roleColors[r.role]}`}>{r.role}</Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rbacModules.map((mod, mi) => (
                  <TableRow key={mod}>
                    <TableCell className="font-medium sticky left-0 bg-background">{mod}</TableCell>
                    {rbacRoles.map((r) => (
                      <TableCell key={r.role} className="text-center">
                        {r.access[mi]
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-muted-foreground/30 mx-auto" />}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
          <span className="text-sm text-muted-foreground">Loading users…</span>
        </div>
      )}

      {/* User Table */}
      {!isLoading && (
        <Tabs value={roleFilter} onValueChange={setRoleFilter}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">All ({users.length})</TabsTrigger>
            {Object.keys(roleDistribution).map((r) => (
              <TabsTrigger key={r} value={r}>
                {r} ({roleDistribution[r]})
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={roleFilter} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden lg:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Last Login</TableHead>
                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 md:hidden">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className={user.isActive ? "text-emerald-600 border-emerald-200" : "text-red-500 border-red-200"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            {formatTime(user.lastLogin)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                            {formatTime(user.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            {/* Don't show deactivate button for SuperAdmin or the current user */}
                            {user.role !== "SuperAdmin" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className={user.isActive ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}
                                onClick={() => handleToggleActive(user)}
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            {search ? "No users match your search" : "No users yet. Click \"Add User\" to create the first one."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
