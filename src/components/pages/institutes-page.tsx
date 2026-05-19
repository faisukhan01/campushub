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
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Building2, MapPin, Users, GraduationCap, Phone, Mail, Globe,
  Plus, Pencil, Eye, Loader2, RefreshCw, AlertCircle,
  CheckCircle2, GitBranch, UserCog, EyeOff, Search, Key, Copy, Trash2,
} from "lucide-react";

interface InstituteRecord {
  id: string;
  name: string;
  code: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  createdAt: string;
  branchCount: number;
  studentCount: number;
  teacherCount: number;
  admin: { id: string; name: string; email: string; plainPassword?: string | null } | null;
}

const emptyForm = {
  name: "", code: "", email: "", phone: "", address: "", website: "",
  adminName: "", adminEmail: "", adminPassword: "",
};

export function InstitutesPage() {
  const { data: session } = useSession();
  const [institutes, setInstitutes] = useState<InstituteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [viewInst, setViewInst] = useState<InstituteRecord | null>(null);
  const [editInst, setEditInst] = useState<InstituteRecord | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", address: "", website: "", adminPassword: "" });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [copiedCurrentPassword, setCopiedCurrentPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [deleteInst, setDeleteInst] = useState<InstituteRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const callerRole = session?.user?.role;

  const fetchInstitutes = useCallback(async () => {
    if (callerRole && callerRole !== "SuperAdmin") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/institutes");
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setInstitutes(json.data ?? []);
    } catch {
      setError("Failed to load institutes. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [callerRole]);

  useEffect(() => { fetchInstitutes(); }, [fetchInstitutes]);

  const filtered = institutes.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase()) ||
      (i.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { name, code, email, adminName, adminEmail, adminPassword } = formData;
    if (!name || !code || !email || !adminName || !adminEmail || !adminPassword) {
      setFormError("All required fields must be filled.");
      return;
    }
    if (adminPassword.length < 8) {
      setFormError("Admin password must be at least 8 characters.");
      return;
    }

    // Validate personal email domain
    const personalEmailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'live.com', 'msn.com', 'aol.com'];
    const emailDomain = adminEmail.toLowerCase().split('@')[1];
    if (!emailDomain || !personalEmailDomains.includes(emailDomain)) {
      setFormError("Admin email must be a personal email address (e.g., @gmail.com, @outlook.com, @yahoo.com)");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/institutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) { setFormError(json.error ?? "Failed to create."); return; }
      setFormSuccess(`✓ ${name} created. Admin: ${adminEmail}`);
      setFormData({ ...emptyForm });
      fetchInstitutes();
      setTimeout(() => { setAddOpen(false); setFormSuccess(""); }, 2000);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (inst: InstituteRecord) => {
    setEditInst(inst);
    setEditForm({
      name: inst.name,
      email: inst.email,
      phone: inst.phone || "",
      address: inst.address || "",
      website: inst.website || "",
      adminPassword: "",
    });
    setEditError("");
    setEditSuccess("");
    setShowEditPassword(false);
    setShowCurrentPassword(false);
    setViewInst(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInst) return;
    
    setEditError("");
    setEditSuccess("");

    if (!editForm.name || !editForm.email) {
      setEditError("Institute name and email are required.");
      return;
    }

    if (editForm.adminPassword && editForm.adminPassword.length < 8) {
      setEditError("New password must be at least 8 characters.");
      return;
    }

    setIsUpdating(true);
    try {
      // Update institute details
      const res = await fetch("/api/institutes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editInst.id,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone || null,
          address: editForm.address || null,
          website: editForm.website || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setEditError(json.error ?? "Failed to update institute.");
        return;
      }

      // Update admin password if provided
      if (editForm.adminPassword && editInst.admin) {
        const pwRes = await fetch("/api/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editInst.admin.id,
            password: editForm.adminPassword,
          }),
        });
        if (!pwRes.ok) {
          setEditError("Institute updated but failed to change admin password.");
          return;
        }
      }

      setEditSuccess("✓ Institute updated successfully!");
      fetchInstitutes();
      setTimeout(() => {
        setEditInst(null);
        setEditSuccess("");
      }, 2000);
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const copyPassword = () => {
    if (editForm.adminPassword) {
      navigator.clipboard.writeText(editForm.adminPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const copyCurrentPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedCurrentPassword(true);
    setTimeout(() => setCopiedCurrentPassword(false), 2000);
  };

  const handleDelete = async () => {
    if (!deleteInst) return;
    
    setDeleteError("");
    setIsDeleting(true);
    
    try {
      const res = await fetch("/api/institutes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteInst.id }),
      });
      const json = await res.json();
      
      if (!res.ok) {
        setDeleteError(json.error ?? "Failed to delete institute.");
        return;
      }
      
      fetchInstitutes();
      setDeleteInst(null);
      setViewInst(null);
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Institute Management</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading…" : `${institutes.length} institute${institutes.length !== 1 ? "s" : ""} registered`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchInstitutes} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { setFormData({ ...emptyForm }); setFormError(""); setFormSuccess(""); setAddOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add Institute
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      {!isLoading && institutes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Institutes", value: institutes.length, icon: Building2, color: "text-slate-600", bg: "bg-slate-100" },
            { label: "Total Branches", value: institutes.reduce((s, i) => s + i.branchCount, 0), icon: GitBranch, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Total Students", value: institutes.reduce((s, i) => s + i.studentCount, 0), icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
            { label: "Total Teachers", value: institutes.reduce((s, i) => s + i.teacherCount, 0), icon: GraduationCap, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((kpi) => (
            <Card key={kpi.label} className="rounded-xl">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl font-bold">{kpi.value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search institutes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
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
          <span className="text-sm text-muted-foreground">Loading institutes…</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && institutes.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No institutes yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first institute to start the hierarchy
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Add First Institute
          </Button>
        </div>
      )}

      {/* Table */}
      {!isLoading && filtered.length > 0 && (
        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Institute</TableHead>
                    <TableHead className="text-center">Branches</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Teachers</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="pr-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((inst) => (
                    <TableRow key={inst.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setViewInst(inst)}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{inst.name}</p>
                            <p className="text-xs text-muted-foreground">{inst.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{inst.branchCount}</TableCell>
                      <TableCell className="text-center font-medium">{inst.studentCount.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-medium">{inst.teacherCount}</TableCell>
                      <TableCell>
                        {inst.admin ? (
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[160px]">{inst.admin.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[160px]">{inst.admin.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No admin assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(inst.createdAt)}</TableCell>
                      <TableCell className="pr-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setViewInst(inst); }}>
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Institute Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) { setFormData({ ...emptyForm }); setFormError(""); setFormSuccess(""); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-emerald-600" />
              </div>
              Add New Institute
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-1">
            {/* Institute Info */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Institute Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Institute Name <span className="text-destructive">*</span></Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Beacon House School" disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Code <span className="text-destructive">*</span></Label>
                  <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. BHS" maxLength={10} disabled={isSaving} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label>Email <span className="text-destructive">*</span></Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="info@institute.edu" disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+92-300-0000000" disabled={isSaving} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="City, Pakistan" disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://..." disabled={isSaving} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Admin Account */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Institute Admin Account</p>
              <p className="text-xs text-muted-foreground mb-3">This person will manage the institute and all its branches.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Admin Full Name <span className="text-destructive">*</span></Label>
                  <Input value={formData.adminName} onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} placeholder="e.g. Ahmed Khan" disabled={isSaving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Admin Email (Personal) <span className="text-destructive">*</span></Label>
                  <Input type="email" value={formData.adminEmail} onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} placeholder="admin@gmail.com" disabled={isSaving} />
                  <p className="text-[10px] text-muted-foreground">Use personal email (@gmail.com, @outlook.com, @yahoo.com, etc.)</p>
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
                <p className="text-xs text-muted-foreground">Share these credentials with the admin. They can change the password after login.</p>
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
                {isSaving ? "Creating…" : "Create Institute"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Detail Sheet */}
      <Sheet open={!!viewInst} onOpenChange={() => setViewInst(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {viewInst && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="truncate">{viewInst.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{viewInst.code}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(viewInst)}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setDeleteInst(viewInst); setDeleteError(""); }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Branches", value: viewInst.branchCount, icon: GitBranch, bg: "bg-slate-100", color: "text-slate-600" },
                    { label: "Students", value: viewInst.studentCount, icon: Users, bg: "bg-sky-50", color: "text-sky-600" },
                    { label: "Teachers", value: viewInst.teacherCount, icon: GraduationCap, bg: "bg-amber-50", color: "text-amber-600" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl border bg-white">
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-1.5`}>
                        <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                      </div>
                      <p className="text-lg font-bold">{s.value.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Contact */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</p>
                  {viewInst.email && <p className="text-sm flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{viewInst.email}</p>}
                  {viewInst.phone && <p className="text-sm flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{viewInst.phone}</p>}
                  {viewInst.website && <p className="text-sm flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-muted-foreground" />{viewInst.website}</p>}
                  {viewInst.address && <p className="text-sm flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-muted-foreground" />{viewInst.address}</p>}
                </div>

                <Separator />

                {/* Admin */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Institute Admin</p>
                  {viewInst.admin ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-purple-700">
                          {viewInst.admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{viewInst.admin.name}</p>
                        <p className="text-xs text-muted-foreground">{viewInst.admin.email}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 text-[10px] ml-auto flex-shrink-0">Admin</Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No admin assigned to this institute.</p>
                  )}
                </div>

                <Separator />

                <p className="text-xs text-muted-foreground">Registered on {formatDate(viewInst.createdAt)}</p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Institute Dialog */}
      <Dialog open={!!editInst} onOpenChange={(o) => { if (!o) { setEditInst(null); setEditError(""); setEditSuccess(""); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-emerald-600" />
              </div>
              Edit Institute
            </DialogTitle>
          </DialogHeader>
          {editInst && (
            <form onSubmit={handleUpdate} className="space-y-5 py-1">
              {/* Institute Details */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Institute Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Institute Name <span className="text-destructive">*</span></Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="e.g. Beacon House School"
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Code</Label>
                    <Input
                      value={editInst.code}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-[10px] text-muted-foreground">Code cannot be changed</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1.5">
                    <Label>Email <span className="text-destructive">*</span></Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="info@institute.edu"
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+92-300-0000000"
                      disabled={isUpdating}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1.5">
                    <Label>Address</Label>
                    <Input
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      placeholder="City, Pakistan"
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <Input
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      placeholder="https://..."
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Admin Password Change */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change Admin Password</p>
                </div>
                {editInst.admin ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-purple-700">
                          {editInst.admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{editInst.admin.name}</p>
                        <p className="text-xs text-muted-foreground">{editInst.admin.email}</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 text-[10px] ml-auto flex-shrink-0">Admin</Badge>
                    </div>

                    {/* Current password (read-only) */}
                    <div className="space-y-1.5">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          value={editInst.admin.plainPassword ?? ""}
                          readOnly
                          className="pr-20 bg-muted/50 cursor-default"
                          placeholder="Not available for old accounts"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          {editInst.admin.plainPassword && (
                            <button
                              type="button"
                              onClick={() => copyCurrentPassword(editInst.admin!.plainPassword!)}
                              className="text-muted-foreground hover:text-foreground p-1"
                              title="Copy current password"
                            >
                              {copiedCurrentPassword ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="text-muted-foreground hover:text-foreground p-1"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* New password (optional change) */}
                    <div className="space-y-1.5">
                      <Label>New Password (Optional)</Label>
                      <div className="relative">
                        <Input
                          type={showEditPassword ? "text" : "password"}
                          value={editForm.adminPassword}
                          onChange={(e) => setEditForm({ ...editForm, adminPassword: e.target.value })}
                          placeholder="Leave blank to keep current password"
                          className="pr-20"
                          disabled={isUpdating}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          {editForm.adminPassword && (
                            <button
                              type="button"
                              onClick={copyPassword}
                              className="text-muted-foreground hover:text-foreground p-1"
                              title="Copy new password"
                            >
                              {copiedPassword ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowEditPassword(!showEditPassword)}
                            className="text-muted-foreground hover:text-foreground p-1"
                          >
                            {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {editForm.adminPassword
                          ? "New password will be set. Make sure to share it with the admin."
                          : "Enter a new password only if you want to change it (min. 8 characters)."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No admin assigned to this institute.</p>
                )}
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
                <Button type="button" variant="outline" onClick={() => setEditInst(null)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isUpdating ? "Updating…" : "Update Institute"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteInst} onOpenChange={(o) => { if (!o) { setDeleteInst(null); setDeleteError(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-destructive" />
              </div>
              Delete Institute
            </DialogTitle>
          </DialogHeader>
          {deleteInst && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <span className="font-semibold text-foreground">{deleteInst.name}</span>?
                </p>
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium mb-2">⚠️ This action will:</p>
                  <ul className="text-xs text-destructive space-y-1 ml-4 list-disc">
                    <li>Delete the institute and all its data</li>
                    <li>Remove {deleteInst.branchCount} branch{deleteInst.branchCount !== 1 ? "es" : ""}</li>
                    <li>Remove {deleteInst.studentCount} student{deleteInst.studentCount !== 1 ? "s" : ""}</li>
                    <li>Remove {deleteInst.teacherCount} teacher{deleteInst.teacherCount !== 1 ? "s" : ""}</li>
                    {deleteInst.admin && <li>Delete the admin account ({deleteInst.admin.email})</li>}
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  This action cannot be undone.
                </p>
              </div>

              {deleteError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{deleteError}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteInst(null)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  {isDeleting ? "Deleting…" : "Delete Institute"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
