"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Video,
  Link2,
  Upload,
  Download,
  Grid3X3,
  List,
  Search,
  Filter,
  FolderOpen,
  BookOpen,
  Library,
  ExternalLink,
  FileSpreadsheet,
  GraduationCap,
  MoreVertical,
  Eye,
  Trash2,
  Calendar,
  Tag,
} from "lucide-react";

// ---- Types ----

type ResourceType = "PDF" | "Video" | "Link" | "Document";

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  course: string;
  category: string;
  description: string;
  size: string;
  uploadDate: string;
  downloads: number;
  tags: string[];
  author: string;
}

// ---- Type Config ----

const typeConfig: Record<ResourceType, { icon: React.ElementType; color: string; bg: string }> = {
  PDF: { icon: FileText, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
  Video: { icon: Video, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
  Link: { icon: Link2, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/30" },
  Document: { icon: FileSpreadsheet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
};

// ---- Categories ----

const categories = [
  { id: "all", label: "All Resources", icon: Library },
  { id: "lectures", label: "Lecture Notes", icon: BookOpen },
  { id: "textbooks", label: "Textbooks", icon: GraduationCap },
  { id: "past-papers", label: "Past Papers", icon: FileText },
  { id: "videos", label: "Video Lectures", icon: Video },
  { id: "research", label: "Research Papers", icon: FolderOpen },
];

// ---- Mock Data ----

const mockResources: Resource[] = [
  { id: "r1", title: "Introduction to Algorithms - Chapter 1", type: "PDF", course: "CS201 - Data Structures", category: "lectures", description: "Complete lecture notes covering algorithm analysis, Big-O notation, and basic sorting algorithms.", size: "2.4 MB", uploadDate: "2025-01-15", downloads: 128, tags: ["algorithms", "sorting", "big-o"], author: "Prof. Rodriguez" },
  { id: "r2", title: "Machine Learning Fundamentals", type: "Video", course: "CS305 - Machine Learning", category: "videos", description: "Comprehensive video series covering supervised and unsupervised learning techniques.", size: "450 MB", uploadDate: "2025-01-12", downloads: 89, tags: ["ML", "neural-networks", "supervised"], author: "Prof. Chen" },
  { id: "r3", title: "Database Design Principles", type: "PDF", course: "CS202 - Database Systems", category: "textbooks", description: "Textbook chapter on ER diagrams, normalization, and relational schema design.", size: "5.1 MB", uploadDate: "2025-01-10", downloads: 156, tags: ["database", "SQL", "normalization"], author: "Prof. Williams" },
  { id: "r4", title: "OS Past Paper 2024", type: "PDF", course: "CS203 - Operating Systems", category: "past-papers", description: "Previous year examination paper with solutions for Operating Systems.", size: "1.2 MB", uploadDate: "2025-01-08", downloads: 234, tags: ["OS", "exam", "processes"], author: "Dept. of CS" },
  { id: "r5", title: "Neural Networks from Scratch", type: "Link", course: "CS305 - Machine Learning", category: "research", description: "External article on building neural networks from first principles.", size: "N/A", uploadDate: "2025-01-06", downloads: 67, tags: ["deep-learning", "python", "tutorial"], author: "External Resource" },
  { id: "r6", title: "Data Structures Cheat Sheet", type: "Document", course: "CS201 - Data Structures", category: "lectures", description: "Quick reference guide for arrays, linked lists, trees, graphs, and hash tables.", size: "0.8 MB", uploadDate: "2025-01-05", downloads: 312, tags: ["cheatsheet", "reference"], author: "Prof. Rodriguez" },
  { id: "r7", title: "SQL Practice Problems", type: "PDF", course: "CS202 - Database Systems", category: "lectures", description: "50 practice problems with solutions covering joins, subqueries, and aggregation.", size: "3.2 MB", uploadDate: "2025-01-03", downloads: 145, tags: ["SQL", "practice", "queries"], author: "Prof. Williams" },
  { id: "r8", title: "Computer Networks Video Series", type: "Video", course: "CS204 - Computer Networks", category: "videos", description: "Lecture recordings on TCP/IP, routing, and network security fundamentals.", size: "890 MB", uploadDate: "2025-01-02", downloads: 78, tags: ["networks", "TCP/IP", "security"], author: "Prof. Kim" },
  { id: "r9", title: "Linear Algebra for ML", type: "PDF", course: "CS305 - Machine Learning", category: "textbooks", description: "Essential linear algebra concepts needed for understanding machine learning algorithms.", size: "4.7 MB", uploadDate: "2024-12-28", downloads: 198, tags: ["math", "linear-algebra", "ML"], author: "Math Dept." },
  { id: "r10", title: "Data Structures Past Paper 2023", type: "PDF", course: "CS201 - Data Structures", category: "past-papers", description: "Previous year paper with detailed solutions and marking scheme.", size: "1.5 MB", uploadDate: "2024-12-25", downloads: 267, tags: ["exam", "previous-year", "solutions"], author: "Dept. of CS" },
  { id: "r11", title: "Git & GitHub Tutorial", type: "Link", course: "General", category: "videos", description: "Complete beginner's guide to version control with Git and GitHub.", size: "N/A", uploadDate: "2024-12-22", downloads: 423, tags: ["git", "tools", "tutorial"], author: "External Resource" },
  { id: "r12", title: "Research Methods Guide", type: "Document", course: "General", category: "research", description: "Guide on writing research papers, citations, and academic writing.", size: "2.1 MB", uploadDate: "2024-12-20", downloads: 156, tags: ["research", "writing", "citations"], author: "Library" },
];

// ---- Main Component ----

export function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "PDF" as ResourceType,
    course: "",
    category: "",
    description: "",
    tags: "",
  });

  // Available courses
  const courses = useMemo(() => [...new Set(mockResources.map((r) => r.course))], []);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return mockResources.filter((r) => {
      const matchesSearch = !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === "all" || r.category === activeCategory;
      const matchesType = typeFilter === "all" || r.type === typeFilter;
      const matchesCourse = courseFilter === "all" || r.course === courseFilter;
      return matchesSearch && matchesCategory && matchesType && matchesCourse;
    });
  }, [searchQuery, activeCategory, typeFilter, courseFilter]);

  const openDetail = (resource: Resource) => {
    setSelectedResource(resource);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Library className="w-6 h-6 text-emerald-500" />
            Resource Library
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Access study materials, textbooks, and past papers
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
              <Upload className="w-4 h-4" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
              <DialogDescription>Share a new resource with your class.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="Resource title..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={uploadForm.type} onValueChange={(v) => setUploadForm({ ...uploadForm, type: v as ResourceType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Link">Link</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={uploadForm.course} onValueChange={(v) => setUploadForm({ ...uploadForm, course: v })}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={uploadForm.category} onValueChange={(v) => setUploadForm({ ...uploadForm, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c.id !== "all").map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>File</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC, PPT, MP4 up to 100MB</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} placeholder="Describe the resource..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={uploadForm.tags} onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })} placeholder="e.g., algorithms, midterm, chapter3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => setUploadDialogOpen(false)}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Sidebar - Categories (hidden on mobile) */}
        <div className="lg:col-span-1 space-y-4 hidden lg:block">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-500" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.id
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                  {cat.id !== "all" && (
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      {mockResources.filter((r) => r.category === cat.id).length}
                    </Badge>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-500" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Resource Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="All types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Link">Link</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Course</Label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="All courses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Library Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Resources</span>
                  <span className="font-semibold">{mockResources.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Downloads</span>
                  <span className="font-semibold">{mockResources.reduce((s, r) => s + r.downloads, 0).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contributors</span>
                  <span className="font-semibold">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          {/* Search & View Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources by title, description, or tags..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-normal gap-3">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className={viewMode === "grid" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className={viewMode === "list" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2 lg:hidden">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Resource</DialogTitle>
                    <DialogDescription>Share a new resource with your class.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="Resource title..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={uploadForm.type} onValueChange={(v) => setUploadForm({ ...uploadForm, type: v as ResourceType })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="Link">Link</SelectItem>
                            <SelectItem value="Document">Document</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Course</Label>
                        <Select value={uploadForm.course} onValueChange={(v) => setUploadForm({ ...uploadForm, course: v })}>
                          <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                          <SelectContent>
                            {courses.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={uploadForm.category} onValueChange={(v) => setUploadForm({ ...uploadForm, category: v })}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.filter((c) => c.id !== "all").map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>File</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, PPT, MP4 up to 100MB</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} placeholder="Describe the resource..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tags (comma separated)</Label>
                      <Input value={uploadForm.tags} onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })} placeholder="e.g., algorithms, midterm, chapter3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => setUploadDialogOpen(false)}>Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Type Filter Tabs (visible on mobile instead of sidebar type filter) */}
          <div className="mb-4 overflow-x-auto">
            <Tabs value={typeFilter} onValueChange={setTypeFilter}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="PDF" className="gap-1"><FileText className="w-3 h-3" />PDF</TabsTrigger>
                <TabsTrigger value="Video" className="gap-1"><Video className="w-3 h-3" />Video</TabsTrigger>
                <TabsTrigger value="Link" className="gap-1"><Link2 className="w-3 h-3" />Link</TabsTrigger>
                <TabsTrigger value="Document" className="gap-1"><FileSpreadsheet className="w-3 h-3" />Doc</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Category Filter */}
          <div className="mb-4 lg:hidden">
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-full">
                <FolderOpen className="w-4 h-4 text-emerald-500 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-3">
            Showing {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
          </p>

          {/* Resource Grid/List */}
          {filteredResources.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredResources.map((resource) => {
                  const config = typeConfig[resource.type];
                  const Icon = config.icon;
                  return (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow group">
                      <CardContent className="p-4">
                        {/* Thumbnail Placeholder */}
                        <div className={`w-full h-32 rounded-lg ${config.bg} flex items-center justify-center mb-3`}>
                          <Icon className={`w-12 h-12 ${config.color} opacity-60`} />
                        </div>

                        {/* Type Badge & Course */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <Icon className="w-3 h-3" />
                            {resource.type}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] truncate">
                            {resource.course.split(" - ")[0]}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {resource.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{resource.description}</p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1"><Download className="w-3 h-3" />{resource.downloads}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(resource.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                          <span>{resource.size}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[9px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                          <Button size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-600 gap-1.5 h-8 text-xs" onClick={() => openDetail(resource)}>
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-xs gap-2"><Download className="w-3.5 h-3.5" />Download</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs gap-2"><Eye className="w-3.5 h-3.5" />Preview</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs gap-2 text-red-600"><Trash2 className="w-3.5 h-3.5" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredResources.map((resource) => {
                      const config = typeConfig[resource.type];
                      const Icon = config.icon;
                      return (
                        <div key={resource.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                          <div className={`w-12 h-12 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-6 h-6 ${config.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold truncate">{resource.title}</h3>
                              <Badge variant="outline" className="text-[10px] flex-shrink-0 gap-1">
                                <Icon className="w-3 h-3" />
                                {resource.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{resource.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                              <span>{resource.course}</span>
                              <span>{resource.size}</span>
                              <span className="flex items-center gap-1"><Download className="w-3 h-3" />{resource.downloads}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={() => openDetail(resource)}>
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8">
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">No resources found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resource Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedResource && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Library className="w-5 h-5 text-emerald-500" />
                  {selectedResource.title}
                </DialogTitle>
                <DialogDescription>{selectedResource.course}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Preview Area */}
                <div className={`w-full h-48 rounded-lg ${typeConfig[selectedResource.type].bg} flex items-center justify-center`}>
                  {(() => {
                    const Icon = typeConfig[selectedResource.type].icon;
                    return <Icon className={`w-16 h-16 ${typeConfig[selectedResource.type].color} opacity-40`} />;
                  })()}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[11px] text-muted-foreground">Type</p>
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      {(() => { const Ic = typeConfig[selectedResource.type].icon; return <Ic className="w-4 h-4" />; })()}
                      {selectedResource.type}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[11px] text-muted-foreground">Size</p>
                    <p className="text-sm font-medium">{selectedResource.size}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[11px] text-muted-foreground">Downloads</p>
                    <p className="text-sm font-medium">{selectedResource.downloads}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-[11px] text-muted-foreground">Uploaded</p>
                    <p className="text-sm font-medium">{new Date(selectedResource.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">By:</span>
                  <span className="text-xs font-medium">{selectedResource.author}</span>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedResource.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedResource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <DialogFooter>
                {selectedResource.type === "Link" ? (
                  <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open Link
                  </Button>
                ) : (
                  <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                    <Download className="w-4 h-4" />
                    Download ({selectedResource.size})
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
