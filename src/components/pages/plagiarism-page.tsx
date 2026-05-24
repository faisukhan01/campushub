"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/app-store";
import {
  ShieldCheck,
  ShieldX,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Globe,
  Database,
  BookOpen,
  Search,
  Loader2,
  ArrowRight,
  Eye,
} from "lucide-react";

// ---- Types ----

interface PlagiarismSource {
  id: string;
  title: string;
  similarity: number;
  snippet: string;
  highlightedText: string;
  url: string;
}

interface PlagiarismResult {
  overallScore: number;
  internetSources: number;
  internalDb: number;
  publications: number;
  sources: PlagiarismSource[];
  originalText: string;
  matchedText: string;
}

interface ScanHistory {
  id: string;
  date: string;
  student: string;
  assignment: string;
  course: string;
  similarity: number;
  status: "Completed" | "Flagged" | "Clean";
}

// ---- Mock Data ----

const mockResult: PlagiarismResult = {
  overallScore: 32,
  internetSources: 18,
  internalDb: 10,
  publications: 4,
  originalText: "Machine learning algorithms are computational methods that allow computers to learn patterns from data without being explicitly programmed. These algorithms use statistical techniques to identify patterns and make decisions with minimal human intervention. The field has grown rapidly in recent years due to the availability of large datasets and increased computational power.",
  matchedText: "Machine learning algorithms are computational methods that allow computers to learn patterns from data without being explicitly programmed. These algorithms leverage statistical techniques to discover patterns and make decisions with minimal human intervention. The field has experienced significant growth in recent years, driven by the abundance of big data and enhanced computing capabilities.",
  sources: [
    {
      id: "s1", title: "Introduction to Machine Learning - Stanford CS229",
      similarity: 18, snippet: "Machine learning algorithms are computational methods that allow computers to learn patterns from data",
      highlightedText: "Machine learning algorithms are computational methods that allow computers to learn patterns from data without being explicitly programmed",
      url: "https://cs229.stanford.edu",
    },
    {
      id: "s2", title: "Internal Submission - CS401 Assignment 3 (2024)",
      similarity: 10, snippet: "These algorithms use statistical techniques to identify patterns and make decisions",
      highlightedText: "These algorithms use statistical techniques to identify patterns and make decisions with minimal human intervention",
      url: "#",
    },
    {
      id: "s3", title: "IEEE Paper: ML in Education (2023)",
      similarity: 4, snippet: "The field has grown rapidly in recent years",
      highlightedText: "The field has grown rapidly in recent years due to the availability of large datasets",
      url: "https://ieeexplore.ieee.org",
    },
  ],
};

const mockHistory: ScanHistory[] = [
  { id: "h1", date: "2025-01-15", student: "Ryan Patel", assignment: "ML Research Paper", course: "CS401", similarity: 32, status: "Flagged" },
  { id: "h2", date: "2025-01-14", student: "Priya Sharma", assignment: "Data Analysis Report", course: "CS301", similarity: 8, status: "Clean" },
  { id: "h3", date: "2025-01-13", student: "Alex Johnson", assignment: "Network Design Doc", course: "CS303", similarity: 15, status: "Completed" },
  { id: "h4", date: "2025-01-12", student: "Sarah Kim", assignment: "DB Schema Design", course: "CS302", similarity: 45, status: "Flagged" },
  { id: "h5", date: "2025-01-11", student: "David Lee", assignment: "OS Process Report", course: "CS201", similarity: 5, status: "Clean" },
];

// ---- Helpers ----

function getScoreColor(score: number): string {
  if (score < 20) return "text-emerald-600 dark:text-emerald-400";
  if (score <= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreBg(score: number): string {
  if (score < 20) return "bg-emerald-100 dark:bg-emerald-900/30";
  if (score <= 50) return "bg-amber-100 dark:bg-amber-900/30";
  return "bg-red-100 dark:bg-red-900/30";
}

function getScoreStroke(score: number): string {
  if (score < 20) return "stroke-emerald-500";
  if (score <= 50) return "stroke-amber-500";
  return "stroke-red-500";
}

function getScoreRingBg(score: number): string {
  if (score < 20) return "stroke-emerald-100 dark:stroke-emerald-900/50";
  if (score <= 50) return "stroke-amber-100 dark:stroke-amber-900/50";
  return "stroke-red-100 dark:stroke-red-900/50";
}

function getScoreLabel(score: number): string {
  if (score < 20) return "Low Similarity";
  if (score <= 50) return "Moderate Similarity";
  return "High Similarity";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Completed": return <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0 text-[10px]">Completed</Badge>;
    case "Flagged": return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 text-[10px]">Flagged</Badge>;
    case "Clean": return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">Clean</Badge>;
    default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
  }
}

// ---- Circular Progress ----

function CircularProgress({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={center} cy={center} r={radius} fill="none" strokeWidth="10" className={getScoreRingBg(score)} />
        <circle cx={center} cy={center} r={radius} fill="none" strokeWidth="10" className={getScoreStroke(score)} strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
        <span className="text-[10px] text-muted-foreground font-medium">{getScoreLabel(score)}</span>
      </div>
    </div>
  );
}

// ---- Main Component ----

export function PlagiarismPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const [activeTab, setActiveTab] = useState("upload");
  const [inputText, setInputText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<"table" | "sidebyside">("table");

  // Role check: students get access denied
  if (currentRole === "Student") {
    return (
      <div className="page-transition flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            The Plagiarism Checker is only available for teachers and administrators. If you believe this is an error, please contact your institution.
          </p>
        </div>
      </div>
    );
  }

  const handleCheckPlagiarism = () => {
    if (!inputText.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
      setActiveTab("results");
    }, 2500);
  };

  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Plagiarism Checker</h1>
            <p className="text-sm text-muted-foreground">Detect plagiarism in student submissions with advanced text analysis</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="mt-4 space-y-4">
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" />
                Submit for Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop Zone */}
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium">Drag and drop files here</p>
                <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, TXT up to 25MB</p>
                <Button variant="outline" size="sm" className="mt-3 gap-2">
                  <FileText className="w-3.5 h-3.5" /> Browse Files
                </Button>
              </div>

              <div className="section-divider" />

              {/* Or Paste Text */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" /> Or paste text directly
                </label>
                <Textarea
                  placeholder="Paste the text to check for plagiarism here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1">{inputText.length} characters</p>
              </div>

              <div className="section-divider" />

              {/* Select Course & Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs201">CS201 - Data Structures</SelectItem>
                      <SelectItem value="cs301">CS301 - Operating Systems</SelectItem>
                      <SelectItem value="cs401">CS401 - Machine Learning</SelectItem>
                      <SelectItem value="cs302">CS302 - Database Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Assignment</label>
                  <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                    <SelectTrigger><SelectValue placeholder="Select assignment" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a1">Assignment 1 - Research Paper</SelectItem>
                      <SelectItem value="a2">Assignment 2 - Lab Report</SelectItem>
                      <SelectItem value="a3">Assignment 3 - Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={!inputText.trim() || isScanning}
                  onClick={handleCheckPlagiarism}
                >
                  {isScanning ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</>
                  ) : (
                    <><Search className="w-4 h-4" /> Check Plagiarism</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="mt-4 space-y-4">
          {showResults && (
            <>
              {/* Overall Score */}
              <Card className="card-premium">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <CircularProgress score={mockResult.overallScore} />
                    <div className="flex-1 w-full">
                      <h3 className="text-base font-semibold mb-1">Similarity Analysis Complete</h3>
                      <p className="text-xs text-muted-foreground mb-4">Results are based on comparison against internet sources, internal database, and academic publications.</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Internet Sources", value: mockResult.internetSources, icon: Globe, color: "text-sky-600 dark:text-sky-400" },
                          { label: "Internal Database", value: mockResult.internalDb, icon: Database, color: "text-purple-600 dark:text-purple-400" },
                          { label: "Publications", value: mockResult.publications, icon: BookOpen, color: "text-amber-600 dark:text-amber-400" },
                        ].map((item) => (
                          <div key={item.label} className="text-center p-3 rounded-lg bg-muted/50">
                            <item.icon className={`w-4 h-4 mx-auto mb-1 ${item.color}`} />
                            <p className={`text-lg font-bold ${item.color}`}>{item.value}%</p>
                            <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-3.5 h-3.5" /> Download Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Source Details
                </h3>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                  <button className={`text-xs px-3 py-1 rounded-md transition-colors ${comparisonMode === "table" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`} onClick={() => setComparisonMode("table")}>Table</button>
                  <button className={`text-xs px-3 py-1 rounded-md transition-colors ${comparisonMode === "sidebyside" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`} onClick={() => setComparisonMode("sidebyside")}>Side by Side</button>
                </div>
              </div>

              {/* Table View */}
              {comparisonMode === "table" && (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b data-table-header">
                            <th className="text-left py-3 px-4">Source</th>
                            <th className="text-left py-3 px-4">Similarity</th>
                            <th className="text-left py-3 px-4 hidden md:table-cell">Matched Text</th>
                            <th className="text-left py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockResult.sources.map((source) => (
                            <tr key={source.id} className="border-b last:border-0 data-table-row">
                              <td className="py-3 px-4">
                                <p className="font-medium text-xs">{source.title}</p>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Progress value={source.similarity} className="w-16 h-1.5" />
                                  <span className={`text-xs font-medium ${getScoreColor(source.similarity)}`}>{source.similarity}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  &ldquo;{source.snippet}...&rdquo;
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                  <Eye className="w-3 h-3" /> View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Side by Side Comparison */}
              {comparisonMode === "sidebyside" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-semibold flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-emerald-500" /> Submitted Text
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 rounded-lg bg-muted/50 text-xs leading-relaxed">
                        {mockResult.originalText.split(" ").map((word, i) => {
                          const isMatched = mockResult.sources.some((s) => s.highlightedText.toLowerCase().includes(word.toLowerCase()));
                          return isMatched ? (
                            <mark key={i} className="bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 px-0.5 rounded">{word} </mark>
                          ) : (
                            <span key={i}>{word} </span>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-semibold flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-sky-500" /> Matched Source
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 rounded-lg bg-muted/50 text-xs leading-relaxed">
                        {mockResult.matchedText.split(" ").map((word, i) => {
                          const isMatched = mockResult.sources.some((s) => s.highlightedText.toLowerCase().includes(word.toLowerCase()));
                          return isMatched ? (
                            <mark key={i} className="bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100 px-0.5 rounded">{word} </mark>
                          ) : (
                            <span key={i}>{word} </span>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Scan History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b data-table-header">
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Student</th>
                      <th className="text-left py-3 px-2 hidden sm:table-cell">Assignment</th>
                      <th className="text-left py-3 px-2">Similarity</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHistory.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 data-table-row">
                        <td className="py-3 px-2 text-xs">{item.date}</td>
                        <td className="py-3 px-2 font-medium text-xs">{item.student}</td>
                        <td className="py-3 px-2 text-xs text-muted-foreground hidden sm:table-cell">{item.assignment}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Progress value={item.similarity} className="w-12 h-1.5" />
                            <span className={`text-xs font-medium ${getScoreColor(item.similarity)}`}>{item.similarity}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">{getStatusBadge(item.status)}</td>
                        <td className="py-3 px-2">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
