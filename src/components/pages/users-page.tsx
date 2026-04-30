"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { mockStudents, mockTeachers, mockAdminUsers, mockParents, mockBranches, mockBatches } from "@/lib/mock-data";
import {
  Users, Search, UserPlus, Upload, Pencil, Shield, UserCog,
  GraduationCap, CheckCircle2, XCircle,
} from "lucide-react";
import { useState } from "react";
import type { UserRole } from "@/types";

type UserItem = { id: string; name: string; email: string; phone?: string; role: UserRole; branch?: string; isActive: boolean; lastLogin?: string };

const allUsers: UserItem[] = [
  ...mockStudents.map((s) => ({ id: s.id, name: s.name, email: s.email, phone: s.phone, role: s.role as UserRole, branch: s.branchName, isActive: s.isActive, lastLogin: s.lastLogin })),
  ...mockTeachers.map((t) => ({ id: t.id, name: t.name, email: t.email, phone: t.phone, role: t.role as UserRole, branch: t.branchName, isActive: t.isActive, lastLogin: t.lastLogin })),
  ...mockParents.map((p) => ({ id: p.id, name: p.name, email: p.email, phone: p.phone, role: p.role as UserRole, branch: p.branchName, isActive: p.isActive, lastLogin: p.lastLogin })),
  ...mockAdminUsers.map((a) => ({ id: a.id, name: a.name, email: a.email, phone: a.phone, role: a.role as UserRole, branch: a.branchName, isActive: a.isActive, lastLogin: a.lastLogin })),
];

const roleColors: Record<string, string> = {
  SuperAdmin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  InstituteAdmin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  BranchAdmin: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Teacher: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Student: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  Parent: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

// RBAC Matrix Data
const rbacModules = ["Dashboard", "Institutes", "Branches", "Departments", "Batches", "Courses", "Students", "Attendance", "Assignments", "Grades", "Timetable", "Fees", "Reports", "Announcements", "Messages", "Settings", "Analytics"];
const rbacRoles: { role: string; access: boolean[] }[] = [
  { role: "SuperAdmin", access: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] },
  { role: "InstituteAdmin", access: [true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false] },
  { role: "BranchAdmin", access: [true, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, false] },
  { role: "Teacher", access: [true, false, false, false, false, true, true, true, true, true, true, false, false, true, true, false, false] },
  { role: "Student", access: [true, false, false, false, false, true, false, true, true, true, true, true, false, true, true, false, false] },
  { role: "Parent", access: [true, false, false, false, false, false, false, true, false, true, true, true, false, true, true, false, false] },
];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" as string, branch: "", phone: "", batch: "" });
  const [showRBAC, setShowRBAC] = useState(false);

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const getRoleBadge = (role: string) => (
    <Badge className={`text-xs ${roleColors[role] || "bg-muted text-muted-foreground"}`}>
      {role}
    </Badge>
  );

  const formatTime = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all users across the institution ({allUsers.length} total)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRBAC(!showRBAC)}>
            <Shield className="w-4 h-4 mr-2" />RBAC Matrix
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />Bulk Import
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@campus.edu" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                      <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="BranchAdmin">Branch Admin</SelectItem>
                        <SelectItem value="InstituteAdmin">Institute Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select value={formData.branch} onValueChange={(v) => setFormData({ ...formData, branch: v })}>
                      <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                      <SelectContent>
                        {mockBranches.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1-555-0000" />
                  </div>
                  {(formData.role === "Student") && (
                    <div className="space-y-2">
                      <Label>Batch/Program</Label>
                      <Select value={formData.batch} onValueChange={(v) => setFormData({ ...formData, batch: v })}>
                        <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                        <SelectContent>
                          {mockBatches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>{b.name} ({b.programName})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* RBAC Matrix */}
      {showRBAC && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Role-Based Access Control Matrix
            </CardTitle>
            <p className="text-xs text-muted-foreground">Shows which modules each role can access</p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background min-w-[100px]">Module</TableHead>
                  {rbacRoles.map((r) => (
                    <TableHead key={r.role} className="min-w-[90px] text-center">
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
                        {r.access[mi] ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Tabs value={roleFilter} onValueChange={setRoleFilter}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All ({allUsers.length})</TabsTrigger>
          <TabsTrigger value="SuperAdmin">Admins</TabsTrigger>
          <TabsTrigger value="Teacher">Teachers</TabsTrigger>
          <TabsTrigger value="Student">Students</TabsTrigger>
          <TabsTrigger value="Parent">Parents</TabsTrigger>
        </TabsList>
        <TabsContent value={roleFilter} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell w-[40px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden lg:table-cell">Branch</TableHead>
                      <TableHead className="hidden lg:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.slice(0, 15).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="hidden sm:table-cell">
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{user.branch || "—"}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className={user.isActive ? "text-emerald-600" : "text-red-500"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{formatTime(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm"><Pencil className="w-3 h-3" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">
                          No users found matching your search
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {filtered.length > 15 && (
                <div className="px-4 py-3 border-t text-center text-xs text-muted-foreground">
                  Showing 15 of {filtered.length} users. Use filters to narrow results.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
