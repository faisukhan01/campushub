"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/store/app-store";
import {
  Database, Plus, Search, Filter, Upload, Download, Share2, Copy,
  ChevronDown, ChevronUp, Tag, BookOpen, BarChart3, Clock, Eye,
  FileText, HelpCircle, Hash, Layers, X, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// -------------------- Types --------------------

type QuestionType = "MCQ" | "TrueFalse" | "ShortAnswer" | "FillBlank";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  marks: number;
  usageCount: number;
  tags: string[];
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  createdAt: string;
}

// -------------------- Mock Data --------------------

const SUBJECTS = ["Computer Science", "Mathematics", "Physics", "Chemistry", "English", "Biology"];
const TOPICS: Record<string, string[]> = {
  "Computer Science": ["Data Structures", "Algorithms", "DBMS", "OS", "Networking"],
  Mathematics: ["Calculus", "Linear Algebra", "Probability", "Statistics", "Discrete Math"],
  Physics: ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism", "Quantum Physics"],
  Chemistry: ["Organic", "Inorganic", "Physical", "Analytical", "Biochemistry"],
  English: ["Grammar", "Literature", "Writing", "Comprehension", "Phonetics"],
  Biology: ["Genetics", "Ecology", "Anatomy", "Cell Biology", "Evolution"],
};
const ALL_TAGS = ["important", "review", "exam", "practice", "advanced", "beginner", "lab", "theory", "formula", "diagram"];

const MOCK_QUESTIONS: Question[] = [
  { id: "qb-1", type: "MCQ", text: "What is the time complexity of binary search in the worst case?", subject: "Computer Science", topic: "Algorithms", difficulty: "Easy", marks: 3, usageCount: 24, tags: ["important", "exam"], options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: "O(log n)", explanation: "Binary search divides the search space in half at each step, resulting in O(log n) time complexity.", createdAt: "2025-01-15" },
  { id: "qb-2", type: "TrueFalse", text: "In a max-heap, every parent node is greater than or equal to its children.", subject: "Computer Science", topic: "Data Structures", difficulty: "Easy", marks: 2, usageCount: 18, tags: ["important", "review"], correctAnswer: "True", explanation: "This is the fundamental property of a max-heap data structure.", createdAt: "2025-01-18" },
  { id: "qb-3", type: "ShortAnswer", text: "Explain the difference between process and thread in an operating system.", subject: "Computer Science", topic: "OS", difficulty: "Medium", marks: 5, usageCount: 31, tags: ["exam", "theory"], correctAnswer: "A process is an independent unit of execution with its own memory space, while a thread is a lightweight sub-process that shares memory with other threads of the same process.", explanation: "Processes are heavier weight and provide isolation, while threads enable concurrency within a process.", createdAt: "2025-01-20" },
  { id: "qb-4", type: "FillBlank", text: "The derivative of sin(x) with respect to x is _____.", subject: "Mathematics", topic: "Calculus", difficulty: "Easy", marks: 2, usageCount: 42, tags: ["formula", "practice"], correctAnswer: "cos(x)", explanation: "This is a fundamental derivative rule in calculus.", createdAt: "2025-01-22" },
  { id: "qb-5", type: "MCQ", text: "Which data structure is best suited for implementing a breadth-first search?", subject: "Computer Science", topic: "Data Structures", difficulty: "Medium", marks: 3, usageCount: 27, tags: ["important", "exam"], options: ["Stack", "Queue", "Linked List", "Tree"], correctAnswer: "Queue", explanation: "BFS uses a FIFO (First-In-First-Out) approach, which is naturally implemented using a queue.", createdAt: "2025-02-01" },
  { id: "qb-6", type: "MCQ", text: "The integral of 1/x dx is:", subject: "Mathematics", topic: "Calculus", difficulty: "Medium", marks: 3, usageCount: 35, tags: ["formula", "review"], options: ["x² + C", "ln|x| + C", "1/x² + C", "e^x + C"], correctAnswer: "ln|x| + C", explanation: "The natural logarithm is the antiderivative of 1/x.", createdAt: "2025-02-05" },
  { id: "qb-7", type: "TrueFalse", text: "Light travels faster in glass than in a vacuum.", subject: "Physics", topic: "Optics", difficulty: "Easy", marks: 2, usageCount: 15, tags: ["beginner", "lab"], correctAnswer: "False", explanation: "Light travels fastest in a vacuum (~3×10⁸ m/s). Glass has a refractive index > 1, slowing light down.", createdAt: "2025-02-10" },
  { id: "qb-8", type: "ShortAnswer", text: "Describe Newton's Third Law of Motion with an example.", subject: "Physics", topic: "Mechanics", difficulty: "Easy", marks: 4, usageCount: 22, tags: ["important", "theory"], correctAnswer: "For every action, there is an equal and opposite reaction. Example: When you push against a wall, the wall pushes back with equal force.", explanation: "This law highlights the mutual forces between two interacting bodies.", createdAt: "2025-02-12" },
  { id: "qb-9", type: "MCQ", text: "What is the hybridization of carbon in methane (CH₄)?", subject: "Chemistry", topic: "Organic", difficulty: "Medium", marks: 3, usageCount: 19, tags: ["exam", "theory"], options: ["sp", "sp²", "sp³", "sp³d"], correctAnswer: "sp³", explanation: "Carbon forms 4 sigma bonds in methane, requiring sp³ hybridization (one s + three p orbitals).", createdAt: "2025-02-15" },
  { id: "qb-10", type: "FillBlank", text: "The powerhouse of the cell is the _____.", subject: "Biology", topic: "Cell Biology", difficulty: "Easy", marks: 2, usageCount: 50, tags: ["beginner", "important"], correctAnswer: "Mitochondria", explanation: "Mitochondria generate most of the cell's supply of ATP, used as a source of chemical energy.", createdAt: "2025-02-18" },
  { id: "qb-11", type: "MCQ", text: "Which sorting algorithm has the best average-case time complexity?", subject: "Computer Science", topic: "Algorithms", difficulty: "Hard", marks: 4, usageCount: 38, tags: ["advanced", "exam"], options: ["Bubble Sort - O(n²)", "Merge Sort - O(n log n)", "Selection Sort - O(n²)", "Insertion Sort - O(n²)"], correctAnswer: "Merge Sort - O(n log n)", explanation: "Merge Sort consistently achieves O(n log n) in all cases, making it one of the most efficient general-purpose sorting algorithms.", createdAt: "2025-02-20" },
  { id: "qb-12", type: "ShortAnswer", text: "What is the Central Limit Theorem and why is it important in statistics?", subject: "Mathematics", topic: "Statistics", difficulty: "Hard", marks: 6, usageCount: 28, tags: ["advanced", "theory"], correctAnswer: "The CLT states that the distribution of sample means approaches a normal distribution as the sample size increases, regardless of the population's distribution. It's important because it enables statistical inference about population parameters.", explanation: "The CLT is the foundation for hypothesis testing and confidence intervals.", createdAt: "2025-02-22" },
  { id: "qb-13", type: "MCQ", text: "Which of the following is a passive component in an electric circuit?", subject: "Physics", topic: "Electromagnetism", difficulty: "Medium", marks: 3, usageCount: 16, tags: ["lab", "review"], options: ["Transistor", "Resistor", "Op-Amp", "Diode"], correctAnswer: "Resistor", explanation: "Passive components do not require external power to operate. Resistors, capacitors, and inductors are passive.", createdAt: "2025-02-25" },
  { id: "qb-14", type: "TrueFalse", text: "DNA replication is semi-conservative.", subject: "Biology", topic: "Genetics", difficulty: "Medium", marks: 2, usageCount: 21, tags: ["important", "exam"], correctAnswer: "True", explanation: "Each new DNA molecule consists of one original strand and one newly synthesized strand (Meselson-Stahl experiment).", createdAt: "2025-03-01" },
  { id: "qb-15", type: "FillBlank", text: "The chemical formula for sulfuric acid is _____.", subject: "Chemistry", topic: "Inorganic", difficulty: "Easy", marks: 2, usageCount: 33, tags: ["formula", "practice"], correctAnswer: "H₂SO₄", explanation: "Sulfuric acid is one of the most important industrial chemicals.", createdAt: "2025-03-05" },
  { id: "qb-16", type: "MCQ", text: "Identify the literary device: 'The wind whispered through the trees.'", subject: "English", topic: "Literature", difficulty: "Easy", marks: 2, usageCount: 12, tags: ["beginner", "review"], options: ["Metaphor", "Simile", "Personification", "Alliteration"], correctAnswer: "Personification", explanation: "Personification gives human qualities (whispering) to non-human entities (wind).", createdAt: "2025-03-08" },
  { id: "qb-17", type: "ShortAnswer", text: "Explain the ACID properties of database transactions.", subject: "Computer Science", topic: "DBMS", difficulty: "Hard", marks: 6, usageCount: 26, tags: ["advanced", "important"], correctAnswer: "Atomicity: All operations complete or none do. Consistency: Transaction brings DB from one valid state to another. Isolation: Concurrent transactions don't interfere. Durability: Committed changes persist.", explanation: "ACID properties ensure reliable database transaction processing.", createdAt: "2025-03-10" },
  { id: "qb-18", type: "MCQ", text: "What is the probability of getting a sum of 7 when rolling two fair dice?", subject: "Mathematics", topic: "Probability", difficulty: "Medium", marks: 3, usageCount: 29, tags: ["exam", "practice"], options: ["1/12", "1/6", "1/9", "5/36"], correctAnswer: "1/6", explanation: "There are 6 favorable outcomes (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) out of 36 total = 6/36 = 1/6.", createdAt: "2025-03-12" },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const TYPE_LABELS: Record<QuestionType, string> = {
  MCQ: "MCQ",
  TrueFalse: "True/False",
  ShortAnswer: "Short Answer",
  FillBlank: "Fill-in-Blank",
};

const TYPE_COLORS: Record<QuestionType, string> = {
  MCQ: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  TrueFalse: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  ShortAnswer: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  FillBlank: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const PIE_COLORS = ["#059669", "#f59e0b", "#ef4444"];
const BAR_COLORS = ["#059669", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"];

// -------------------- Component --------------------

export function QuestionBankPage() {
  const currentUser = useAppStore((s) => s.currentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Create form
  const [createForm, setCreateForm] = useState({
    type: "MCQ" as QuestionType,
    subject: "",
    topic: "",
    difficulty: "Medium" as Difficulty,
    marks: 3,
    questionText: "",
    explanation: "",
    correctAnswer: "",
    tagInput: "",
    tags: [] as string[],
    options: ["", "", "", ""],
  });

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return MOCK_QUESTIONS.filter((q) => {
      if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase()) && !q.subject.toLowerCase().includes(searchQuery.toLowerCase()) && !q.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterType !== "all" && q.type !== filterType) return false;
      if (filterSubject !== "all" && q.subject !== filterSubject) return false;
      if (filterDifficulty !== "all" && q.difficulty !== filterDifficulty) return false;
      if (filterTag !== "all" && !q.tags.includes(filterTag)) return false;
      return true;
    });
  }, [searchQuery, filterType, filterSubject, filterDifficulty, filterTag]);

  // Stats
  const stats = useMemo(() => {
    const total = MOCK_QUESTIONS.length;
    const subjects = new Set(MOCK_QUESTIONS.map((q) => q.subject)).size;
    const easy = MOCK_QUESTIONS.filter((q) => q.difficulty === "Easy").length;
    const medium = MOCK_QUESTIONS.filter((q) => q.difficulty === "Medium").length;
    const hard = MOCK_QUESTIONS.filter((q) => q.difficulty === "Hard").length;
    const lastUpdated = "2025-03-12";
    return { total, subjects, easy, medium, hard, lastUpdated };
  }, []);

  // Chart data
  const difficultyData = [
    { name: "Easy", value: stats.easy, fill: PIE_COLORS[0] },
    { name: "Medium", value: stats.medium, fill: PIE_COLORS[1] },
    { name: "Hard", value: stats.hard, fill: PIE_COLORS[2] },
  ];

  const subjectData = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_QUESTIONS.forEach((q) => { counts[q.subject] = (counts[q.subject] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuestions.map((q) => q.id)));
    }
  };

  const addTag = () => {
    const tag = createForm.tagInput.trim().toLowerCase();
    if (tag && !createForm.tags.includes(tag)) {
      setCreateForm((p) => ({ ...p, tags: [...p.tags, tag], tagInput: "" }));
    }
  };

  const removeTag = (tag: string) => {
    setCreateForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Question Bank
          </h1>
          <p className="text-muted-foreground text-sm">Create, manage, and organize your question repository</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Upload className="w-3.5 h-3.5 mr-1.5" />Import
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" />Export
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />Create Question
            </Button>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={createForm.type} onValueChange={(v) => setCreateForm((p) => ({ ...p, type: v as QuestionType }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                        <SelectItem value="TrueFalse">True / False</SelectItem>
                        <SelectItem value="ShortAnswer">Short Answer</SelectItem>
                        <SelectItem value="FillBlank">Fill in the Blank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Difficulty</Label>
                    <Select value={createForm.difficulty} onValueChange={(v) => setCreateForm((p) => ({ ...p, difficulty: v as Difficulty }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Subject</Label>
                    <Select value={createForm.subject} onValueChange={(v) => setCreateForm((p) => ({ ...p, subject: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Topic</Label>
                    <Select value={createForm.topic} onValueChange={(v) => setCreateForm((p) => ({ ...p, topic: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select topic" /></SelectTrigger>
                      <SelectContent>
                        {(createForm.subject ? TOPICS[createForm.subject] : []).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Marks</Label>
                  <Input type="number" min={1} max={10} value={createForm.marks} onChange={(e) => setCreateForm((p) => ({ ...p, marks: parseInt(e.target.value) || 1 }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Question Text</Label>
                  <Textarea placeholder="Enter your question..." rows={3} value={createForm.questionText} onChange={(e) => setCreateForm((p) => ({ ...p, questionText: e.target.value }))} />
                </div>

                {/* MCQ Options */}
                {createForm.type === "MCQ" && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {createForm.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-6">{String.fromCharCode(65 + idx)}.</span>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          value={opt}
                          onChange={(e) => {
                            const opts = [...createForm.options];
                            opts[idx] = e.target.value;
                            setCreateForm((p) => ({ ...p, options: opts }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>Correct Answer</Label>
                  <Input placeholder="Enter correct answer" value={createForm.correctAnswer} onChange={(e) => setCreateForm((p) => ({ ...p, correctAnswer: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Explanation (optional)</Label>
                  <Textarea placeholder="Explain the correct answer..." rows={2} value={createForm.explanation} onChange={(e) => setCreateForm((p) => ({ ...p, explanation: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={createForm.tagInput}
                      onChange={(e) => setCreateForm((p) => ({ ...p, tagInput: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
                  </div>
                  {createForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {createForm.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />Add Question
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Questions", value: stats.total, icon: Database, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Subjects Covered", value: stats.subjects, icon: BookOpen, color: "text-teal-600 dark:text-teal-400" },
          { label: "Difficulty Split", value: `${stats.easy}E / ${stats.medium}M / ${stats.hard}H`, icon: BarChart3, color: "text-amber-600 dark:text-amber-400" },
          { label: "Last Updated", value: stats.lastUpdated, icon: Clock, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="stat-card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-lg font-bold mt-0.5">{s.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="chart-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {difficultyData.map((entry, idx) => <Cell key={entry.name} fill={PIE_COLORS[idx]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.55 0.17 155/0.15)", fontSize: 12, boxShadow: "0 4px 12px oklch(0 0 0/0.08)" }}
                    formatter={(value: number, name: string) => [`${value} questions`, name]}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="chart-container">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Questions per Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.55 0.17 155/0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.55 0.17 155/0.15)", fontSize: 12 }} />
                  <Bar dataKey="count" name="Questions" radius={[4, 4, 0, 0]}>
                    {subjectData.map((_, idx) => <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList className="tabs-smooth">
          <TabsTrigger value="questions">Questions ({filteredQuestions.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Questions List */}
        <TabsContent value="questions" className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search questions, subjects, topics..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                  <SelectItem value="TrueFalse">True/False</SelectItem>
                  <SelectItem value="ShortAnswer">Short Answer</SelectItem>
                  <SelectItem value="FillBlank">Fill-in-Blank</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue placeholder="Tag" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {ALL_TAGS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{selectedIds.size} selected</span>
              <div className="flex gap-1.5 ml-auto">
                <Button variant="outline" size="sm" className="text-xs h-7"><Download className="w-3 h-3 mr-1" />Export</Button>
                <Button variant="outline" size="sm" className="text-xs h-7"><Share2 className="w-3 h-3 mr-1" />Share</Button>
                <Button variant="outline" size="sm" className="text-xs h-7"><Copy className="w-3 h-3 mr-1" />Duplicate</Button>
                <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground" onClick={() => setSelectedIds(new Set())}>Clear</Button>
              </div>
            </motion.div>
          )}

          {/* Question Cards */}
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-3 pr-3">
              <AnimatePresence mode="popLayout">
                {filteredQuestions.map((q) => {
                  const isExpanded = expandedId === q.id;
                  const isSelected = selectedIds.has(q.id);
                  return (
                    <motion.div
                      key={q.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className={`card-premium transition-all ${isSelected ? "ring-2 ring-emerald-500" : ""} ${isExpanded ? "ring-1 ring-emerald-300 dark:ring-emerald-800" : ""}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(q.id)} className="mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              {/* Top row: badges and actions */}
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <Badge className={`text-[10px] px-1.5 py-0 ${TYPE_COLORS[q.type]}`}>{TYPE_LABELS[q.type]}</Badge>
                                <Badge className={`text-[10px] px-1.5 py-0 ${DIFFICULTY_COLORS[q.difficulty]}`}>{q.difficulty}</Badge>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{q.marks} marks</Badge>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                                  <Hash className="w-3 h-3" />Used {q.usageCount}x
                                </span>
                              </div>

                              {/* Question text */}
                              <p className="text-sm font-medium leading-relaxed">{q.text}</p>

                              {/* Subject and Topic */}
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{q.subject}</span>
                                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{q.topic}</span>
                              </div>

                              {/* Tags */}
                              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                {q.tags.map((tag) => (
                                  <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                                    <Tag className="w-2.5 h-2.5" />{tag}
                                  </span>
                                ))}
                              </div>

                              {/* Expanded View */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                  >
                                    <Separator className="my-3" />
                                    <div className="space-y-3">
                                      {q.options && (
                                        <div className="space-y-1.5">
                                          <p className="text-xs font-semibold text-muted-foreground">Options</p>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                            {q.options.map((opt, idx) => (
                                              <div
                                                key={idx}
                                                className={`text-xs px-3 py-1.5 rounded-md ${opt === q.correctAnswer ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 font-medium" : "bg-muted"}`}
                                              >
                                                {String.fromCharCode(65 + idx)}. {opt}
                                                {opt === q.correctAnswer && <CheckCircle2 className="w-3 h-3 inline ml-1.5" />}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex items-start gap-2 text-xs">
                                        <span className="text-muted-foreground font-semibold flex-shrink-0">Answer:</span>
                                        <span className="font-medium text-emerald-700 dark:text-emerald-400">{q.correctAnswer || "—"}</span>
                                      </div>
                                      {q.explanation && (
                                        <div className="text-xs space-y-1">
                                          <p className="text-muted-foreground font-semibold flex items-center gap-1"><HelpCircle className="w-3 h-3" />Explanation</p>
                                          <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-1">
                                        <span>ID: {q.id}</span>
                                        <span>Created: {q.createdAt}</span>
                                        <span>Used in {q.usageCount} assessments</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Expand button */}
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline mt-2"
                              >
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {isExpanded ? "Show Less" : "Preview Question"}
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredQuestions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium">No questions found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {difficultyData.map((d) => (
              <Card key={d.name} className="stat-card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm`} style={{ backgroundColor: d.fill }}>
                      {d.value}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{Math.round((d.value / stats.total) * 100)}% of total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["MCQ", "TrueFalse", "ShortAnswer", "FillBlank"] as QuestionType[]).map((type) => {
              const count = MOCK_QUESTIONS.filter((q) => q.type === type).length;
              return (
                <Card key={type} className="p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{TYPE_LABELS[type]}</p>
                </Card>
              );
            })}
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Most Used Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...MOCK_QUESTIONS].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5).map((q, idx) => (
                  <div key={q.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{q.text}</p>
                      <p className="text-[10px] text-muted-foreground">{q.subject} · {q.topic}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">{q.usageCount} uses</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
