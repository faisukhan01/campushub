"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
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
import { useAppStore } from "@/store/app-store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  MessageSquare,
  Star,
  Send,
  ClipboardCheck,
  TrendingUp,
  Users,
  ThumbsUp,
  MinusCircle,
  ThumbsDown,
  Plus,
  FileText,
  Calendar,
} from "lucide-react";

// ---- Mock Data ----

interface Survey {
  id: string;
  title: string;
  description: string;
  course: string;
  deadline: string;
  responseCount: number;
  totalResponses: number;
  questions: SurveyQuestion[];
}

interface SurveyQuestion {
  id: number;
  type: "mcq" | "rating" | "text";
  question: string;
  options?: string[];
  required?: boolean;
}

const mockSurveys: Survey[] = [
  {
    id: "s1",
    title: "Course Evaluation - CS201",
    description: "Help us improve the Data Structures course by sharing your experience.",
    course: "Data Structures & Algorithms",
    deadline: "2025-02-15",
    responseCount: 24,
    totalResponses: 40,
    questions: [
      { id: 1, type: "mcq", question: "How would you rate the overall course quality?", options: ["Excellent", "Good", "Average", "Poor"] },
      { id: 2, type: "rating", question: "Rate the instructor's teaching effectiveness" },
      { id: 3, type: "mcq", question: "Were the course materials helpful?", options: ["Very Helpful", "Somewhat Helpful", "Neutral", "Not Helpful"] },
      { id: 4, type: "rating", question: "Rate the lab sessions" },
      { id: 5, type: "text", question: "Any suggestions for improvement?" },
    ],
  },
  {
    id: "s2",
    title: "Campus Facilities Survey",
    description: "Share your feedback on campus facilities including labs, library, and sports.",
    course: "General",
    deadline: "2025-02-20",
    responseCount: 67,
    totalResponses: 100,
    questions: [
      { id: 1, type: "mcq", question: "How satisfied are you with the library?", options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
      { id: 2, type: "rating", question: "Rate the computer lab facilities" },
      { id: 3, type: "mcq", question: "How is the campus Wi-Fi quality?", options: ["Excellent", "Good", "Fair", "Poor"] },
      { id: 4, type: "rating", question: "Rate sports facilities" },
      { id: 5, type: "text", question: "What facility improvements would you like to see?" },
    ],
  },
  {
    id: "s3",
    title: "Teaching Feedback - Prof. Rodriguez",
    description: "Provide feedback on Prof. Emily Rodriguez's Machine Learning course.",
    course: "Machine Learning",
    deadline: "2025-01-30",
    responseCount: 30,
    totalResponses: 32,
    questions: [
      { id: 1, type: "rating", question: "Rate the clarity of explanations" },
      { id: 2, type: "mcq", question: "How engaging were the lectures?", options: ["Very Engaging", "Engaging", "Neutral", "Not Engaging"] },
      { id: 3, type: "rating", question: "Rate the availability for doubt clearing" },
      { id: 4, type: "mcq", question: "Was the pace of teaching appropriate?", options: ["Too Fast", "Just Right", "Too Slow"] },
      { id: 5, type: "text", question: "Additional comments for the professor" },
    ],
  },
];

interface FeedbackRecord {
  id: string;
  course: string;
  type: string;
  date: string;
  status: "Submitted" | "Reviewed";
}

const mockFeedbackHistory: FeedbackRecord[] = [
  { id: "f1", course: "Data Structures & Algorithms", type: "Course", date: "2024-12-10", status: "Reviewed" },
  { id: "f2", course: "Machine Learning", type: "Course Evaluation", date: "2024-11-25", status: "Reviewed" },
  { id: "f3", course: "Prof. Rodriguez", type: "Teacher", date: "2024-11-20", status: "Reviewed" },
  { id: "f4", course: "General", type: "General", date: "2024-10-15", status: "Submitted" },
  { id: "f5", course: "Operating Systems", type: "Course", date: "2024-09-30", status: "Submitted" },
  { id: "f6", course: "Prof. Johnson", type: "Teacher", date: "2024-09-15", status: "Reviewed" },
];

const sentimentData = [
  { name: "Positive", value: 45, fill: "#10b981" },
  { name: "Neutral", value: 30, fill: "#f59e0b" },
  { name: "Negative", value: 15, fill: "#ef4444" },
];

const feedbackCategories = ["Teaching Quality", "Course Content", "Facilities", "Support", "General", "Other"];

// ---- Helpers ----

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StarRating({ value, onChange, interactive = false }: { value: number; onChange?: (v: number) => void; interactive?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          onClick={() => onChange?.(star)}
          disabled={!interactive}
        >
          <Star
            className={`w-5 h-5 ${
              star <= value
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ---- Main Component ----

export function FeedbackPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);

  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, string>>({});
  const [giveFeedbackOpen, setGiveFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackAnonymous, setFeedbackAnonymous] = useState(false);

  const avgRating = 4.2;
  const totalFeedback = 18;
  const responseRate = 78;

  const handleSurveySubmit = () => {
    setActiveSurvey(null);
    setSurveyAnswers({});
  };

  return (
    <div className="page-transition space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Feedback & Surveys</h1>
            <p className="text-sm text-muted-foreground">Share your feedback and participate in surveys</p>
          </div>
        </div>
        <Dialog open={giveFeedbackOpen} onOpenChange={setGiveFeedbackOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-fit">
              <Plus className="w-3.5 h-3.5" /> Give Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Give Feedback
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Target</Label>
                <Select value={feedbackTarget} onValueChange={setFeedbackTarget}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Rating</Label>
                <StarRating value={feedbackRating} onChange={setFeedbackRating} interactive />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Category</Label>
                <Select value={feedbackCategory} onValueChange={setFeedbackCategory}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Your Feedback</Label>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={feedbackAnonymous} onCheckedChange={setFeedbackAnonymous} />
                  <Label className="text-xs">Submit anonymously</Label>
                </div>
                <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setGiveFeedbackOpen(false)}>
                  <Send className="w-3.5 h-3.5" /> Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Avg Rating", value: avgRating.toFixed(1), icon: Star, color: "bg-amber-500", sub: "out of 5.0" },
          { label: "Feedback Given", value: totalFeedback, icon: MessageSquare, color: "bg-emerald-500", sub: "total" },
          { label: "Response Rate", value: `${responseRate}%`, icon: Users, color: "bg-sky-500", sub: "all surveys" },
          { label: "Active Surveys", value: mockSurveys.length, icon: ClipboardCheck, color: "bg-purple-500", sub: "open now" },
        ].map((stat) => (
          <Card key={stat.label} className="stat-card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs: Surveys, History, Analytics */}
      <Tabs defaultValue="surveys" className="tabs-smooth">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="surveys">Active Surveys</TabsTrigger>
          <TabsTrigger value="history">My Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Active Surveys Tab */}
        <TabsContent value="surveys" className="space-y-4 mt-4">
          {mockSurveys.map((survey) => {
            const progress = Math.round((survey.responseCount / survey.totalResponses) * 100);
            const isCompleted = progress >= 95;

            return (
              <Card key={survey.id} className="card-premium">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold truncate">{survey.title}</h3>
                        {isCompleted && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
                            Almost Full
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{survey.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {survey.course}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due {formatDate(survey.deadline)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={progress} className="flex-1 h-2" />
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                          {survey.responseCount}/{survey.totalResponses}
                        </span>
                      </div>
                    </div>
                    <Dialog open={activeSurvey?.id === survey.id} onOpenChange={(open) => { if (!open) { setActiveSurvey(null); setSurveyAnswers({}); } }}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : "default"}
                          className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white whitespace-nowrap"
                          onClick={() => setActiveSurvey(survey)}
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          {isCompleted ? "View Results" : "Take Survey"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{survey.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5">
                          {survey.questions.map((q) => (
                            <div key={q.id} className="space-y-2">
                              <Label className="text-sm font-medium flex items-center gap-1">
                                {q.id}. {q.question}
                                {q.required && <span className="text-red-500">*</span>}
                              </Label>
                              {q.type === "mcq" && q.options && (
                                <div className="space-y-1.5">
                                  {q.options.map((opt) => (
                                    <label
                                      key={opt}
                                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition-all ${
                                        surveyAnswers[q.id] === opt
                                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                                          : "border-border hover:bg-muted/50"
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        surveyAnswers[q.id] === opt
                                          ? "border-emerald-500 bg-emerald-500"
                                          : "border-muted-foreground/30"
                                      }`}>
                                        {surveyAnswers[q.id] === opt && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        )}
                                      </div>
                                      {opt}
                                    </label>
                                  ))}
                                </div>
                              )}
                              {q.type === "rating" && (
                                <StarRating
                                  value={parseInt(surveyAnswers[q.id] ?? "0")}
                                  onChange={(v) => setSurveyAnswers((prev) => ({ ...prev, [q.id]: String(v) }))}
                                  interactive
                                />
                              )}
                              {q.type === "text" && (
                                <Textarea
                                  placeholder="Type your response..."
                                  value={surveyAnswers[q.id] ?? ""}
                                  onChange={(e) => setSurveyAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                                  rows={3}
                                  className="resize-none text-sm"
                                />
                              )}
                            </div>
                          ))}
                          <div className="flex justify-end">
                            <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSurveySubmit}>
                              <Send className="w-3.5 h-3.5" /> Submit Survey
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* My Feedback History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Course / Target</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFeedbackHistory.map((record) => (
                      <tr key={record.id} className="border-b last:border-0 hover:bg-muted/50 data-table-row">
                        <td className="py-3 px-4 font-medium">{record.course}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">{record.type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{formatDate(record.date)}</td>
                        <td className="py-3 px-4">
                          <Badge className={`text-[10px] border-0 ${
                            record.status === "Reviewed"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sentiment Chart */}
            <Card className="card-premium">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Feedback Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={sentimentData} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(value: number) => [`${value}%`, "Responses"]}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Positive
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Neutral
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    Negative
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Feedback Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">Positive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-24 h-2" />
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MinusCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-sm">Neutral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="w-24 h-2" />
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">25%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Negative</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-24 h-2" />
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">15%</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Average Rating:</span>
                    <StarRating value={Math.round(avgRating)} />
                    <span className="text-sm font-bold">{avgRating}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
