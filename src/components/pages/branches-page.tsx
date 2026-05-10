"use client";

import { useEffect, useState, useCallback } from "react";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  MapPin, Users, GraduationCap, Building2, Phone, Mail, Plus,
  Loader2, RefreshCw, AlertCircle, CheckCircle2, BookOpen,
  Eye, EyeOff, UserCog, Pencil, Trash2, MoreVertical,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BranchRecord {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  instituteId: string;
  isActive: boolean;
  createdAt: string;
  institute: { id: string; name: string; code: string };
  courseCount: number;
  studentCount: number;
  teacherCount: number;
  admin: { id: string; name: string; email: string } | null;
}

interface InstituteOption {
  id: string;
  name: string;
  code: string;
}

const emptyForm = {
  name: "", code: "", phone: "", email: "", address: "",
  instituteId: "",
  adminName: "", adminEmail: "", adminPassword: "",
};

interface EditFormData {
  id: string;
  name: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  adminEmail: string;
  adminPassword: string;
}

export function BranchesPage() {
  const { data: session } = useSession();
  const callerRole = session?.user?.role as string | undefined;

  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [institutes, setInstitutes] = useState<InstituteOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchRecord | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchBranches = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/branches");
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setBranches(json.data ?? []);
    } catch {
      setError("Failed to load branches. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInstitutes = useCallback(async () => {
    if (callerRole !== "SuperAdmin") return;
    try {
      const res = await fetch("/api/institutes");
      if (!res.ok) return;
      const json = await res.json();
      setInstitutes((json.data ?? []).map((i: InstituteOption) => ({ id: i.id, name: i.name, code: i.code })));
    } catch { /* silent */ }
  }, [callerRole]);

  useEffect(() => { fetchBranches(); }, [fetchBranches]);
  useEffect(() => { fetchInstitutes(); }, [fetchInstitutes]);

  // Group branches by institute
  const grouped = branches.reduce<Record<string, { institute: BranchRecord["institute"]; items: BranchRecord[] }>>((acc, b) => {
    if (!acc[b.instituteId]) acc[b.instituteId] = { institute: b.institute, items: [] };
    acc[b.instituteId].items.push(b);
    return acc;
  }, {});

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { name, code, adminName, adminEmail, adminPassword, instituteId } = formData;
    if (!name || !code || !adminName || !adminEmail || !adminPassword) {
      setFormError("All required fields must be filled.");
      return;
    }
    if (callerRole === "SuperAdmin" && !instituteId) {
      setFormError("Please select an institute.");
      return;
    }
    if (adminPassword.length < 8) {
      setFormError("Admin password must be at least 8 characters.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error ?? "Failed to create."); return; }
      setFormSuccess(`✓ ${name} branch created. Admin: ${adminEmail}`);
      setFormData({ ...emptyForm });
      fetchBranches();
      setTimeout(() => { setAddOpen(false); setFormSuccess(""); }, 2000);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (branch: BranchRecord) => {
    setSelectedBranch(branch);
    setEditFormData({
      id: branch.id,
      name: branch.name,
      code: branch.code,
      phone: branch.phone || "",
      email: branch.email || "",
      address: branch.address || "",
      adminEmail: branch.admin?.email || "",
      adminPassword: "",
    });
    setFormError("");
    setFormSuccess("");
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    setFormError("");
    setFormSuccess("");

    if (!editFormData.name || !editFormData.code) {
      setFormError("Name and code are required.");
      return;
    }

    if (editFormData.adminPassword && editFormData.adminPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/branches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error ?? "Failed to update."); return; }
      setFormSuccess(`✓ Branch updated successfully`);
      fetchBranches();
      setTimeout(() => { setEditOpen(false); setFormSuccess(""); setEditFormData(null); }, 2000);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (branch: BranchRecord) => {
    setSelectedBranch(branch);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBranch) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/branches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedBranch.id }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to delete branch.");
        setDeleteOpen(false);
        return;
      }
      fetchBranches();
      setDeleteOpen(false);
      setSelectedBranch(null);
    } catch {
      setError("Network error. Please try again.");
      setDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const canAddBranch = callerRole === "SuperAdmin" || callerRole === "InstituteAdmin";

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading…" : `${branches.length} branch${branches.length !== 1 ? "es" : ""}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchBranches} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {canAddBranch && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setFormData({ ...emptyForm }); setFormError(""); setFormSuccess(""); setAddOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />Add Branch
            </Button>
          )}
        </div>
      </div>

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
          <span className="text-sm text-muted-foreground">Loading branches…</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && branches.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No branches yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {canAddBranch ? "Add your first branch to get started" : "No branches have been added to your institute yet"}
          </p>
          {canAddBranch && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Add First Branch
            </Button>
          )}
        </div>
      )}

      {/* Branches grouped by institute */}
      {!isLoading && branches.length > 0 && (
        <div className="space-y-6">
          {Object.values(grouped).map(({ institute, items }) => (
            <div key={institute.id}>
              {/* Institute header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold">{institute.name}</h2>
                  <p className="text-xs text-muted-foreground">{institute.code} · {items.length} branch{items.length !== 1 ? "es" : ""}</p>
                </div>
              </div>

              {/* Branch cards */}
              <div className="ml-4 sm:ml-8 border-l-2 border-emerald-200 dark:border-emerald-800 pl-4 space-y-3">
                {items.map((branch) => (
                  <Card key={branch.id} className="card-premium">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{branch.code}</Badge>
                            <Badge variant={branch.isActive ? "default" : "secondary"} className={`text-xs ${branch.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0" : ""}`}>
                              {branch.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <h3 className="text-base font-semibold">{branch.name}</h3>
                          {branch.address && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" /> {branch.address}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className="text-xs text-muted-foreground">{formatDate(branch.createdAt)}</p>
                          {canAddBranch && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(branch)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit Branch
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteClick(branch)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Branch
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                          <Users className="w-4 h-4 text-sky-600" />
                          <div>
                            <p className="font-bold">{branch.studentCount.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">Students</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                          <GraduationCap className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="font-bold">{branch.teacherCount}</p>
                            <p className="text-[10px] text-muted-foreground">Teachers</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="font-bold">{branch.courseCount}</p>
                            <p className="text-[10px] text-muted-foreground">Courses</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact + Admin */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                        {branch.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{branch.phone}</span>}
                        {branch.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{branch.email}</span>}
                      </div>

                      {branch.admin && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <UserCog className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>Admin: <span className="font-medium text-foreground">{branch.admin.name}</span> · {branch.admin.email}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Branch Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) { setFormData({ ...emptyForm }); setFormError(""); setFormSuccess(""); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-emerald-600" />
              </div>
              Add New Branch
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-1">
            {/* Branch Info */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Branch Details</p>

              {callerRole === "SuperAdmin" && (
                <div className="space-y-1.5 mb-3">
                  <Label>Institute <span className="text-destructive">*</span></Label>
                  <Select value={formData.instituteId} onValueChange={(v) => setFormData({ ...formData, instituteId: v })} disabled={isSaving}>
                    <SelectTrigger><SelectValue placeholder="Select institute" /></SelectTrigger>
                    <SelectContent>
                      {institutes.map((i) => (
                        <SelectItem key={i.id} value={i.id}>{i.name} ({i.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Branch Name <span className="text-destructive">*</span></Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Main Campus" disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Code <span className="text-destructive">*</span></Label>
                  <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. MC" maxLength={10} disabled={isSaving} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="branch@institute.edu" disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+92-300-0000000" disabled={isSaving} />
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                <Label>Address</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Street, City" disabled={isSaving} />
              </div>
            </div>

            <Separator />

            {/* Admin Account */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Branch Admin Account</p>
              <p className="text-xs text-muted-foreground mb-3">This person will manage teachers and students in this branch.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Admin Full Name <span className="text-destructive">*</span></Label>
                  <Input value={formData.adminName} onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} placeholder="e.g. Ali Hassan" disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Admin Email <span className="text-destructive">*</span></Label>
                  <Input type="email" value={formData.adminEmail} onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} placeholder="admin@branch.edu" disabled={isSaving} />
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                <Label>Admin Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="pr-10"
                    disabled={isSaving}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Share these credentials. They can change the password after login.</p>
              </div>
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
                {isSaving ? "Creating…" : "Create Branch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { setEditFormData(null); setFormError(""); setFormSuccess(""); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-blue-600" />
              </div>
              Edit Branch
            </DialogTitle>
          </DialogHeader>
          {editFormData && (
            <form onSubmit={handleUpdate} className="space-y-4 py-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Branch Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Branch Name <span className="text-destructive">*</span></Label>
                    <Input 
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
                      placeholder="e.g. Main Campus" 
                      disabled={isSaving} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Code <span className="text-destructive">*</span></Label>
                    <Input 
                      value={editFormData.code} 
                      onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value.toUpperCase() })} 
                      placeholder="e.g. MC" 
                      maxLength={10} 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      value={editFormData.email} 
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} 
                      placeholder="branch@institute.edu" 
                      disabled={isSaving} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input 
                      value={editFormData.phone} 
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} 
                      placeholder="+92-300-0000000" 
                      disabled={isSaving} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5 mt-3">
                  <Label>Address</Label>
                  <Input 
                    value={editFormData.address} 
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} 
                    placeholder="Street, City" 
                    disabled={isSaving} 
                  />
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Branch Admin Credentials</p>
                <p className="text-xs text-muted-foreground mb-3">Update admin email or reset password</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Admin Email</Label>
                    <Input 
                      type="email" 
                      value={editFormData.adminEmail} 
                      onChange={(e) => setEditFormData({ ...editFormData, adminEmail: e.target.value })} 
                      placeholder="admin@branch.edu" 
                      disabled={isSaving} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>New Password (leave empty to keep current)</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={editFormData.adminPassword}
                        onChange={(e) => setEditFormData({ ...editFormData, adminPassword: e.target.value })}
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
                    <p className="text-xs text-muted-foreground">Only fill this if you want to change the admin password</p>
                  </div>
                </div>
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
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={isSaving}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isSaving ? "Updating…" : "Update Branch"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedBranch?.name}</strong>? This action cannot be undone.
              All associated data including students, teachers, and courses will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isDeleting ? "Deleting…" : "Delete Branch"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
