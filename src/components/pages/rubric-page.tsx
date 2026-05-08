"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/app-store";
import {
  ClipboardList,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Share2,
  Eye,
  FileText,
  Sparkles,
  BookOpen,
  LayoutTemplate,
  Save,
  ChevronDown,
  X,
  CheckCircle2,
  GripVertical,
  Presentation,
  FlaskConical,
  Users,
  MessageSquare,
} from "lucide-react";

// ---- Types ----

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface PerformanceLevel {
  id: string;
  name: string;
  points: number;
  descriptors: Record<string, string>; // criterionId -> descriptor
}

interface Rubric {
  id: string;
  title: string;
  subject: string;
  description: string;
  criteria: Criterion[];
  levels: PerformanceLevel[];
  lastModified: string;
  createdBy: string;
}

interface RubricTemplate {
  id: string;
  title: string;
  subject: string;
  description: string;
  icon: React.ElementType;
  criteria: string[];
  levels: string[];
}

// ---- Mock Data ----

const defaultLevels: PerformanceLevel[] = [
  { id: "l1", name: "Excellent", points: 4, descriptors: {} },
  { id: "l2", name: "Good", points: 3, descriptors: {} },
  { id: "l3", name: "Satisfactory", points: 2, descriptors: {} },
  { id: "l4", name: "Needs Improvement", points: 1, descriptors: {} },
];

const mockRubrics: Rubric[] = [
  {
    id: "r1", title: "Essay Writing Rubric", subject: "English Literature",
    description: "Assessment rubric for analytical essay writing assignments.",
    criteria: [
      { id: "c1", name: "Thesis & Argument", description: "Clarity and strength of thesis statement", weight: 25 },
      { id: "c2", name: "Content & Evidence", description: "Quality of supporting evidence and analysis", weight: 30 },
      { id: "c3", name: "Organization", description: "Logical structure and flow of ideas", weight: 20 },
      { id: "c4", name: "Language & Grammar", description: "Writing quality and grammatical accuracy", weight: 15 },
      { id: "c5", name: "Citations & Format", description: "Proper citation and formatting style", weight: 10 },
    ],
    levels: defaultLevels,
    lastModified: "2025-01-15",
    createdBy: "Prof. Emily Rodriguez",
  },
  {
    id: "r2", title: "Lab Report Assessment", subject: "Physics",
    description: "Standard rubric for evaluating laboratory experiment reports.",
    criteria: [
      { id: "c1", name: "Hypothesis", description: "Clear formulation of testable hypothesis", weight: 15 },
      { id: "c2", name: "Methodology", description: "Appropriate experimental design and procedure", weight: 25 },
      { id: "c3", name: "Data Analysis", description: "Accurate data collection and analysis", weight: 25 },
      { id: "c4", name: "Conclusion", description: "Interpretation of results and implications", weight: 20 },
      { id: "c5", name: "Presentation", description: "Clarity of report format and visuals", weight: 15 },
    ],
    levels: defaultLevels,
    lastModified: "2025-01-12",
    createdBy: "Dr. Sarah Chen",
  },
  {
    id: "r3", title: "Group Project Evaluation", subject: "Software Engineering",
    description: "Team-based project assessment covering technical and collaboration skills.",
    criteria: [
      { id: "c1", name: "Technical Quality", description: "Code quality, architecture, and functionality", weight: 30 },
      { id: "c2", name: "Teamwork", description: "Collaboration, communication, and participation", weight: 20 },
      { id: "c3", name: "Documentation", description: "Technical documentation and user guides", weight: 15 },
      { id: "c4", name: "Presentation", description: "Demo quality and Q&A handling", weight: 15 },
      { id: "c5", name: "Innovation", description: "Creativity and original approach to the problem", weight: 20 },
    ],
    levels: defaultLevels,
    lastModified: "2025-01-10",
    createdBy: "Prof. Emily Rodriguez",
  },
];

const mockTemplates: RubricTemplate[] = [
  {
    id: "t1", title: "Essay Writing", subject: "English / Humanities",
    description: "Comprehensive rubric for analytical and argumentative essays",
    icon: FileText, criteria: ["Thesis & Argument", "Content & Evidence", "Organization", "Language & Grammar", "Citations"], levels: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
  },
  {
    id: "t2", title: "Presentation", subject: "General / Communication",
    description: "Assessment for oral presentations and slide decks",
    icon: Presentation, criteria: ["Content Knowledge", "Delivery & Presence", "Visual Aids", "Engagement", "Time Management"], levels: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
  },
  {
    id: "t3", title: "Lab Report", subject: "Sciences / Engineering",
    description: "Standard rubric for science and engineering lab reports",
    icon: FlaskConical, criteria: ["Hypothesis", "Methodology", "Data Analysis", "Conclusion", "Presentation"], levels: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
  },
  {
    id: "t4", title: "Group Project", subject: "Any / Interdisciplinary",
    description: "Team-based project evaluation with collaboration metrics",
    icon: Users, criteria: ["Technical Quality", "Teamwork", "Documentation", "Presentation", "Innovation"], levels: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
  },
  {
    id: "t5", title: "Debate / Discussion", subject: "Social Sciences / Language",
    description: "Assessment for structured debates and class discussions",
    icon: MessageSquare, criteria: ["Argument Strength", "Evidence & Support", "Counter-arguments", "Communication Skills", "Respect & Etiquette"], levels: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
  },
];

// ---- Helpers ----

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function generateId() {
  return Math.random().toString(36).substring(2, 8);
}

// ---- Main Component ----

export function RubricPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const [activeTab, setActiveTab] = useState("list");
  const [rubrics, setRubrics] = useState<Rubric[]>(mockRubrics);
  const [editingRubric, setEditingRubric] = useState<Rubric | null>(null);
  const [previewRubric, setPreviewRubric] = useState<Rubric | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Builder state
  const [builderTitle, setBuilderTitle] = useState("");
  const [builderSubject, setBuilderSubject] = useState("");
  const [builderDescription, setBuilderDescription] = useState("");
  const [builderCriteria, setBuilderCriteria] = useState<Criterion[]>([]);
  const [builderLevels, setBuilderLevels] = useState<PerformanceLevel[]>(defaultLevels);
  const [builderDescriptors, setBuilderDescriptors] = useState<Record<string, Record<string, string>>>({});

  const isAdmin = currentRole === "InstituteAdmin" || currentRole === "SuperAdmin" || currentRole === "BranchAdmin";
  const isTeacher = currentRole === "Teacher";

  const startNewRubric = useCallback(() => {
    setBuilderTitle("");
    setBuilderSubject("");
    setBuilderDescription("");
    setBuilderCriteria([
      { id: generateId(), name: "", description: "", weight: 20 },
      { id: generateId(), name: "", description: "", weight: 20 },
      { id: generateId(), name: "", description: "", weight: 20 },
    ]);
    setBuilderLevels(defaultLevels.map((l) => ({ ...l, id: generateId(), descriptors: {} })));
    setBuilderDescriptors({});
    setEditingRubric(null);
    setActiveTab("builder");
  }, []);

  const startEditRubric = useCallback((rubric: Rubric) => {
    setBuilderTitle(rubric.title);
    setBuilderSubject(rubric.subject);
    setBuilderDescription(rubric.description);
    setBuilderCriteria([...rubric.criteria]);
    setBuilderLevels([...rubric.levels]);
    setEditingRubric(rubric);
    setActiveTab("builder");
  }, []);

  const startFromTemplate = useCallback((template: RubricTemplate) => {
    const criteria: Criterion[] = template.criteria.map((name) => ({
      id: generateId(), name, description: "", weight: Math.round(100 / template.criteria.length),
    }));
    setBuilderTitle(template.title);
    setBuilderSubject(template.subject);
    setBuilderDescription(template.description);
    setBuilderCriteria(criteria);
    setBuilderLevels(defaultLevels.map((l) => ({ ...l, id: generateId(), descriptors: {} })));
    setBuilderDescriptors({});
    setEditingRubric(null);
    setActiveTab("builder");
  }, []);

  const addCriterion = useCallback(() => {
    setBuilderCriteria((prev) => [...prev, { id: generateId(), name: "", description: "", weight: 10 }]);
  }, []);

  const removeCriterion = useCallback((id: string) => {
    setBuilderCriteria((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCriterion = useCallback((id: string, field: keyof Criterion, value: string | number) => {
    setBuilderCriteria((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const updateDescriptor = useCallback((criterionId: string, levelId: string, value: string) => {
    setBuilderDescriptors((prev) => ({
      ...prev,
      [criterionId]: { ...prev[criterionId], [levelId]: value },
    }));
  }, []);

  const handleSaveRubric = useCallback(() => {
    const newRubric: Rubric = {
      id: editingRubric?.id ?? generateId(),
      title: builderTitle,
      subject: builderSubject,
      description: builderDescription,
      criteria: builderCriteria,
      levels: builderLevels,
      lastModified: new Date().toISOString().split("T")[0],
      createdBy: "Prof. Emily Rodriguez",
    };

    if (editingRubric) {
      setRubrics((prev) => prev.map((r) => r.id === editingRubric.id ? newRubric : r));
    } else {
      setRubrics((prev) => [newRubric, ...prev]);
    }
    setActiveTab("list");
  }, [builderTitle, builderSubject, builderDescription, builderCriteria, builderLevels, editingRubric]);

  const handleDelete = useCallback(() => {
    if (deleteTarget) {
      setRubrics((prev) => prev.filter((r) => r.id !== deleteTarget));
      setDeleteTarget(null);
      setDeleteDialogOpen(false);
    }
  }, [deleteTarget]);

  const handleDuplicate = useCallback((rubric: Rubric) => {
    const newRubric: Rubric = {
      ...rubric,
      id: generateId(),
      title: `${rubric.title} (Copy)`,
      lastModified: new Date().toISOString().split("T")[0],
    };
    setRubrics((prev) => [newRubric, ...prev]);
  }, []);

  const totalWeight = builderCriteria.reduce((sum, c) => sum + c.weight, 0);
  const totalPoints = builderLevels.length > 0 ? builderCriteria.length * Math.max(...builderLevels.map((l) => l.points)) : 0;

  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Rubric Builder</h1>
            <p className="text-sm text-muted-foreground">Create, manage, and share grading rubrics for assessments</p>
          </div>
        </div>
        {(isAdmin || isTeacher) && activeTab === "list" && (
          <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-fit" onClick={startNewRubric}>
            <Plus className="w-4 h-4" /> Create Rubric
          </Button>
        )}
        {activeTab === "builder" && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setActiveTab("list")} className="gap-2">
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSaveRubric} disabled={!builderTitle.trim()}>
              <Save className="w-4 h-4" /> Save Rubric
            </Button>
          </div>
        )}
      </div>

      {/* Rubric List Tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${activeTab === "list" ? "grid-cols-3" : activeTab === "builder" ? "grid-cols-2" : "grid-cols-3"}`}>
          {(isAdmin || isTeacher) && <TabsTrigger value="list">My Rubrics</TabsTrigger>}
          {(isAdmin || isTeacher) && <TabsTrigger value="builder" disabled={activeTab === "list" && !editingRubric}>Builder</TabsTrigger>}
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview" disabled={!previewRubric}>Preview</TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rubrics.map((rubric) => (
              <Card key={rubric.id} className="hover:shadow-md transition-shadow card-hover">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">{rubric.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{rubric.subject}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{rubric.criteria.length} criteria</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{rubric.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Modified: {formatDate(rubric.lastModified)}</span>
                    <span>by {rubric.createdBy.split(" ").slice(0, 2).join(" ")}</span>
                  </div>
                  <div className="section-divider my-3" />
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => startEditRubric(rubric)}>
                      <Edit3 className="w-3 h-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => handleDuplicate(rubric)}>
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setPreviewRubric(rubric)}>
                      <Eye className="w-3 h-3" /> Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => {}}>
                      <Share2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-red-600 hover:text-red-700" onClick={() => { setDeleteTarget(rubric.id); setDeleteDialogOpen(true); }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create New Card */}
            <Card className="border-dashed border-2 hover:border-emerald-500/50 cursor-pointer transition-colors" onClick={startNewRubric}>
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium">Create New Rubric</p>
                <p className="text-xs text-muted-foreground mt-0.5">Start from scratch or use a template</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Builder Tab */}
        <TabsContent value="builder" className="mt-4 space-y-4">
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-500" />
                {editingRubric ? "Edit Rubric" : "Create New Rubric"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Rubric Title *</label>
                  <Input value={builderTitle} onChange={(e) => setBuilderTitle(e.target.value)} placeholder="e.g., Essay Writing Rubric" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Subject</label>
                  <Input value={builderSubject} onChange={(e) => setBuilderSubject(e.target.value)} placeholder="e.g., English Literature" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea value={builderDescription} onChange={(e) => setBuilderDescription(e.target.value)} placeholder="Describe this rubric..." rows={2} />
              </div>

              <div className="section-divider" />

              {/* Criteria Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Criteria & Performance Levels</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addCriterion}>
                    <Plus className="w-3 h-3" /> Add Criterion
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground w-40">Criterion</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground hidden sm:table-cell w-32">Description</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground w-16">Weight</th>
                        {builderLevels.map((level) => (
                          <th key={level.id} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[140px]">
                            {level.name} ({level.points}pts)
                          </th>
                        ))}
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {builderCriteria.map((criterion) => (
                        <tr key={criterion.id} className="border-t border-border/50">
                          <td className="py-2 px-3">
                            <Input
                              value={criterion.name}
                              onChange={(e) => updateCriterion(criterion.id, "name", e.target.value)}
                              placeholder="Criterion name"
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="py-2 px-3 hidden sm:table-cell">
                            <Input
                              value={criterion.description}
                              onChange={(e) => updateCriterion(criterion.id, "description", e.target.value)}
                              placeholder="Brief description"
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              value={criterion.weight}
                              onChange={(e) => updateCriterion(criterion.id, "weight", parseInt(e.target.value) || 0)}
                              className="h-8 text-xs w-16 text-center"
                              min={0}
                              max={100}
                            />
                          </td>
                          {builderLevels.map((level) => (
                            <td key={level.id} className="py-2 px-2">
                              <Textarea
                                value={builderDescriptors[criterion.id]?.[level.id] ?? ""}
                                onChange={(e) => updateDescriptor(criterion.id, level.id, e.target.value)}
                                placeholder="Descriptor..."
                                className="resize-none h-16 text-[11px]"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                              onClick={() => removeCriterion(criterion.id)}
                              disabled={builderCriteria.length <= 1}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex items-center justify-between mt-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Criteria: <strong className="text-foreground">{builderCriteria.length}</strong></span>
                    <span className="text-muted-foreground">Total Weight: <strong className={totalWeight === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>{totalWeight}%</strong></span>
                    {totalWeight !== 100 && (
                      <span className="text-red-600 dark:text-red-400">Weights should sum to 100%</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">Max Points: <strong className="text-foreground">{totalPoints}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-emerald-500" />
              Rubric Templates
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Start with a pre-built template and customize it to your needs.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                      <template.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm">{template.title}</h4>
                      <p className="text-xs text-muted-foreground">{template.subject}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.criteria.slice(0, 3).map((c, i) => (
                      <Badge key={i} variant="outline" className="text-[9px]">{c}</Badge>
                    ))}
                    {template.criteria.length > 3 && (
                      <Badge variant="outline" className="text-[9px]">+{template.criteria.length - 3} more</Badge>
                    )}
                  </div>
                  <div className="section-divider my-3" />
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1" onClick={() => startFromTemplate(template)}>
                    <Sparkles className="w-3 h-3" /> Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-4">
          {previewRubric && (
            <Card className="card-premium">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      {previewRubric.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{previewRubric.subject} · {previewRubric.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setPreviewRubric(null)}>
                    <X className="w-3 h-3" /> Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[60vh]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-border rounded-lg overflow-hidden min-w-[600px]">
                      <thead>
                        <tr className="bg-emerald-50 dark:bg-emerald-950/30">
                          <th className="text-left py-3 px-3 font-semibold w-36">Criteria</th>
                          <th className="text-left py-3 px-3 font-semibold hidden sm:table-cell w-28">Description</th>
                          <th className="text-left py-3 px-3 font-semibold w-16">Weight</th>
                          {previewRubric.levels.map((level) => (
                            <th key={level.id} className="text-center py-3 px-3 font-semibold min-w-[140px]">
                              {level.name} ({level.points}pts)
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRubric.criteria.map((criterion, idx) => (
                          <tr key={criterion.id} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                            <td className="py-3 px-3 font-medium">{criterion.name}</td>
                            <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{criterion.description}</td>
                            <td className="py-3 px-3 text-center font-medium">{criterion.weight}%</td>
                            {previewRubric.levels.map((level) => (
                              <td key={level.id} className="py-3 px-3 text-center text-muted-foreground">
                                <div className="p-2 rounded bg-muted/30 min-h-[40px] flex items-center justify-center">
                                  <span className="text-[10px] italic">Add descriptor in builder</span>
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/50 font-semibold">
                          <td colSpan={2} className="py-2 px-3">Total</td>
                          <td className="py-2 px-3 text-center">{previewRubric.criteria.reduce((s, c) => s + c.weight, 0)}%</td>
                          <td colSpan={previewRubric.levels.length} className="py-2 px-3 text-center">
                            {previewRubric.criteria.length * Math.max(...previewRubric.levels.map((l) => l.points))} points
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rubric?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The rubric will be permanently deleted from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
