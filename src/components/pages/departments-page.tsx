"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { mockDepartments, mockPrograms } from "@/lib/mock-data";
import {
  FolderTree, Users, GraduationCap, Plus, Pencil, ChevronDown, ChevronRight,
  BookOpen, Search,
} from "lucide-react";
import { useState } from "react";
import type { Department, Program } from "@/types";

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", headOfDepartment: "", description: "" });
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = departments.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase())
  );

  const getPrograms = (deptId: string): Program[] => mockPrograms.filter((p) => p.departmentId === deptId);

  const openCreate = () => {
    setEditingDept(null);
    setFormData({ name: "", code: "", headOfDepartment: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, code: dept.code, headOfDepartment: dept.headOfDepartment || "", description: dept.description || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingDept) {
      setDepartments((prev) => prev.map((d) => d.id === editingDept.id ? { ...d, ...formData } : d));
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`, branchId: "branch-001", branchName: "Greenfield Main Campus",
        ...formData, teacherCount: 0, studentCount: 0, isActive: true,
        createdAt: new Date().toISOString(),
      };
      setDepartments((prev) => [...prev, newDept]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage academic departments and programs</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDept ? "Edit Department" : "Create New Department"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dname">Department Name</Label>
                  <Input id="dname" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dcode">Code</Label>
                  <Input id="dcode" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. CS" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dhod">Head of Department</Label>
                <Input id="dhod" value={formData.headOfDepartment} onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })} placeholder="Prof. John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ddesc">Description</Label>
                <Input id="ddesc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave}>
                {editingDept ? "Save Changes" : "Create Department"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search departments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Department Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead>Department</TableHead>
                <TableHead className="hidden md:table-cell">Code</TableHead>
                <TableHead className="hidden sm:table-cell">Head of Department</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Students</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Teachers</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Programs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((dept) => {
                const programs = getPrograms(dept.id);
                const isExpanded = expandedDept === dept.id;
                return (
                  <>
                    <TableRow key={dept.id} className={isExpanded ? "bg-muted/30" : ""}>
                      <TableCell>
                        <Button
                          variant="ghost" size="icon" className="w-6 h-6"
                          onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                            <FolderTree className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{dept.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{dept.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{dept.code}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{dept.headOfDepartment || "—"}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        <span className="flex items-center justify-end gap-1 text-sm">
                          <Users className="w-3 h-3 text-emerald-600" />{dept.studentCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        <span className="flex items-center justify-end gap-1 text-sm">
                          <GraduationCap className="w-3 h-3 text-amber-600" />{dept.teacherCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <span className="flex items-center justify-end gap-1 text-sm">
                          <BookOpen className="w-3 h-3 text-purple-600" />{programs.length}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(dept)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Expanded: Programs */}
                    {isExpanded && programs.length > 0 && (
                      programs.map((prog) => (
                        <TableRow key={prog.id} className="bg-emerald-50/50 dark:bg-emerald-900/10">
                          <TableCell />
                          <TableCell colSpan={2}>
                            <div className="flex items-center gap-2 ml-4">
                              <BookOpen className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium">{prog.name}</span>
                              <Badge variant="outline" className="text-[10px]">{prog.code}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                            {prog.duration} {prog.durationUnit}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell" />
                          <TableCell className="hidden sm:table-cell" />
                          <TableCell className="text-right hidden lg:table-cell">
                            <span className="text-xs text-muted-foreground">{prog.totalCredits} credits</span>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      ))
                    )}
                    {isExpanded && programs.length === 0 && (
                      <TableRow className="bg-emerald-50/50 dark:bg-emerald-900/10">
                        <TableCell colSpan={8} className="text-center py-4 text-sm text-muted-foreground">
                          No programs found for this department
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards (mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:hidden">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{departments.length}</p>
            <p className="text-xs text-muted-foreground">Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{departments.reduce((a, d) => a + d.studentCount, 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{mockPrograms.length}</p>
            <p className="text-xs text-muted-foreground">Programs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
