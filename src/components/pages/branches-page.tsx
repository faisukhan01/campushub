"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockBranches, mockInstitutes } from "@/lib/mock-data";
import {
  MapPin, Users, GraduationCap, Building2, Phone, Mail, Plus, Pencil,
  ChevronDown, ChevronRight, FolderTree, Globe, UserCircle,
} from "lucide-react";
import { useState } from "react";
import type { Branch } from "@/types";

export function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", address: "", city: "", state: "", phone: "", email: "", principal: "" });
  const [expandedInstitute, setExpandedInstitute] = useState<string | null>("inst-001");

  const openCreate = () => {
    setEditingBranch(null);
    setFormData({ name: "", code: "", address: "", city: "", state: "", phone: "", email: "", principal: "" });
    setDialogOpen(true);
  };

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({ name: branch.name, code: branch.code, address: branch.address, city: branch.city, state: branch.state, phone: branch.phone, email: branch.email, principal: branch.principal || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingBranch) {
      setBranches((prev) => prev.map((b) => b.id === editingBranch.id ? { ...b, ...formData } : b));
    } else {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`, instituteId: "inst-001", instituteName: "Greenfield Education Group",
        ...formData, country: "United States", zipCode: "00000",
        studentCount: 0, teacherCount: 0, departmentCount: 0,
        isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      setBranches((prev) => [...prev, newBranch]);
    }
    setDialogOpen(false);
  };

  // Group branches by institute
  const branchesByInstitute = mockInstitutes.map((inst) => ({
    institute: inst,
    branches: branches.filter((b) => b.instituteId === inst.id),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">Manage campus branches and locations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-2" />Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingBranch ? "Edit Branch" : "Create New Branch"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bname">Branch Name</Label>
                  <Input id="bname" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Main Campus" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bcode">Branch Code</Label>
                  <Input id="bcode" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. GEG-MC" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baddress">Address</Label>
                <Textarea id="baddress" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Full address" rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bcity">City</Label>
                  <Input id="bcity" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bstate">State</Label>
                  <Input id="bstate" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bphone">Phone</Label>
                  <Input id="bphone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bemail">Email</Label>
                  <Input id="bemail" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bprincipal">Principal</Label>
                  <Input id="bprincipal" value={formData.principal} onChange={(e) => setFormData({ ...formData, principal: e.target.value })} placeholder="Dr. John Doe" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave}>
                {editingBranch ? "Save Changes" : "Create Branch"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branch Hierarchy */}
      <div className="space-y-4">
        {branchesByInstitute.map(({ institute, branches: instBranches }) => (
          <Collapsible
            key={institute.id}
            open={expandedInstitute === institute.id}
            onOpenChange={(open) => setExpandedInstitute(open ? institute.id : null)}
          >
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{institute.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {institute.city}, {institute.state} &middot; {instBranches.length} branches
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{(institute.studentCount).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" />{institute.teacherCount}</span>
                    </div>
                    {expandedInstitute === institute.id ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4 sm:ml-8 mt-2 space-y-3 border-l-2 border-emerald-200 dark:border-emerald-800 pl-4">
                {instBranches.map((branch) => (
                  <Card key={branch.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{branch.code}</Badge>
                            <Badge variant={branch.isActive ? "default" : "secondary"} className={`text-xs ${branch.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}`}>
                              {branch.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <h3 className="text-base font-semibold">{branch.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" /> {branch.address}, {branch.city}, {branch.state}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => openEdit(branch)}>
                          <Pencil className="w-3 h-3 mr-1" />Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                          <Users className="w-4 h-4 text-emerald-600" />
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
                          <FolderTree className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="font-bold">{branch.departmentCount}</p>
                            <p className="text-[10px] text-muted-foreground">Departments</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {branch.principal && (
                          <span className="flex items-center gap-1"><UserCircle className="w-3 h-3" /> Principal: {branch.principal}</span>
                        )}
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {branch.phone}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {branch.email}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
