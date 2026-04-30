"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Clock,
  Award,
  BarChart3,
  Zap,
  BookOpen,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ---- Mock Data ----

const gpaTrend = [
  { semester: "Sem 1", gpa: 3.2, classAvg: 3.0 },
  { semester: "Sem 2", gpa: 3.4, classAvg: 3.1 },
  { semester: "Sem 3", gpa: 3.1, classAvg: 3.0 },
  { semester: "Sem 4", gpa: 3.6, classAvg: 3.1 },
  { semester: "Sem 5", gpa: 3.5, classAvg: 3.2 },
  { semester: "Sem 6", gpa: 3.8, classAvg: 3.2 },
];

const coursePerformance = [
  { course: "Data Structures", score: 88, avg: 72, fullMark: "CS201" },
  { course: "Database Systems", score: 82, avg: 68, fullMark: "CS202" },
  { course: "Operating Systems", score: 75, avg: 70, fullMark: "CS203" },
  { course: "Computer Networks", score: 91, avg: 74, fullMark: "CS204" },
  { course: "Machine Learning", score: 85, avg: 65, fullMark: "CS305" },
  { course: "Software Eng.", score: 79, avg: 71, fullMark: "CS301" },
];

const radarData = [
  { subject: "Problem Solving", value: 90, fullMark: 100 },
  { subject: "Theory", value: 78, fullMark: 100 },
  { subject: "Programming", value: 92, fullMark: 100 },
  { subject: "Mathematics", value: 72, fullMark: 100 },
  { subject: "Communication", value: 85, fullMark: 100 },
  { subject: "Research", value: 68, fullMark: 100 },
];

const gradeDistribution = [
  { grade: "A+", count: 4, classAvg: 2 },
  { grade: "A", count: 6, classAvg: 5 },
  { grade: "A-", count: 3, classAvg: 4 },
  { grade: "B+", count: 2, classAvg: 6 },
  { grade: "B", count: 1, classAvg: 8 },
  { grade: "B-", count: 0, classAvg: 5 },
  { grade: "C+", count: 0, classAvg: 4 },
];

const studyTimeData = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 5.1 },
  { day: "Thu", hours: 2.8 },
  { day: "Fri", hours: 6.0 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 3.5 },
];

const subjectBreakdown = [
  { course: "Data Structures", progress: 88, trend: "up" as const, grade: "A", credits: 4 },
  { course: "Database Systems", progress: 82, trend: "up" as const, grade: "A-", credits: 3 },
  { course: "Operating Systems", progress: 75, trend: "down" as const, grade: "B+", credits: 4 },
  { course: "Computer Networks", progress: 91, trend: "up" as const, grade: "A", credits: 3 },
  { course: "Machine Learning", progress: 85, trend: "same" as const, grade: "A", credits: 4 },
  { course: "Software Eng.", progress: 79, trend: "up" as const, grade: "B+", credits: 3 },
];

const strengths = [
  { label: "Problem Solving", description: "Top 15% in class. Strong analytical skills.", icon: Target, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Programming", description: "Top 10% in coding assessments. Consistent performer.", icon: Zap, color: "text-teal-600 dark:text-teal-400" },
  { label: "Communication", description: "Excellent presentation skills. Active participation.", icon: Star, color: "text-amber-600 dark:text-amber-400" },
];

const weaknesses = [
  { label: "Mathematics", description: "Below class average by 8%. Focus on linear algebra.", icon: Target, color: "text-amber-600 dark:text-amber-400" },
  { label: "Research Methods", description: "Needs improvement in academic writing.", icon: BookOpen, color: "text-amber-600 dark:text-amber-400" },
  { label: "Study Time", description: "Avg 4.2 hrs/day — aim for 5-6 hrs during exam prep.", icon: Clock, color: "text-amber-600 dark:text-amber-400" },
];

const studyRecommendations = [
  { title: "Increase Math Study Time", description: "Spend 2 extra hours/week on linear algebra", icon: Clock, color: "bg-red-100 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400" },
  { title: "Review OS Concepts", description: "Focus on process scheduling and memory management", icon: BookOpen, color: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400" },
  { title: "Practice Database Queries", description: "Complete 20 SQL problems before next exam", icon: Target, color: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { title: "Join Study Groups", description: "Collaborate with peers for ML and OS topics", icon: Brain, color: "bg-teal-100 dark:bg-teal-900/30", iconColor: "text-teal-600 dark:text-teal-400" },
];

const aiInsights = [
  "Based on your performance trend, you're on track to achieve Dean's List this semester. Keep up the consistency!",
  "Your programming skills have improved 15% since last semester. Consider taking advanced algorithms next term.",
  "Math scores need attention. Allocating 30 minutes daily to practice problems can boost your grade by at least 10%.",
  "You perform best in morning study sessions (8-11 AM). Schedule difficult subjects during this window.",
];

// ---- Helpers ----

function TrendIcon({ trend }: { trend: "up" | "down" | "same" }) {
  if (trend === "up") return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "down") return <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

function getProgressColor(value: number) {
  if (value >= 85) return "bg-emerald-500";
  if (value >= 70) return "bg-amber-500";
  return "bg-red-500";
}

// ---- Main Component ----

export function PerformancePage() {
  const stats = useMemo(() => ({
    currentGPA: 3.8,
    cgpa: 3.43,
    classRank: "12 / 156",
    totalCredits: 72,
    completedCourses: 18,
    attendanceAvg: 88,
  }), []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-500" />
            Performance Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your academic progress and get AI-powered insights
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          Semester 6
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Current GPA</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.currentGPA.toFixed(1)}</p>
              <span className="flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                <ArrowUpRight className="w-3 h-3" />+0.3
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">from {stats.cgpa.toFixed(2)} CGPA</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Class Rank</p>
            <p className="text-2xl font-bold mt-1">{stats.classRank}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Top 8%</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Credits Earned</p>
            <p className="text-2xl font-bold mt-1">{stats.totalCredits}</p>
            <Progress value={(stats.totalCredits / 140) * 100} className="mt-2 h-1.5" />
            <p className="text-[10px] text-muted-foreground mt-1">of 140 total</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Avg Attendance</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold">{stats.attendanceAvg}%</p>
              <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium mb-1">
                <ArrowUpRight className="w-3 h-3" />+2.5%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">above 75% threshold</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4">
          {/* GPA Trend + Radar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  GPA Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={gpaTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                    <YAxis domain={[2.5, 4.0]} tick={{ fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="gpa" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} name="Your GPA" />
                    <Line type="monotone" dataKey="classAvg" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3 }} name="Class Average" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Skills Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Your Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Course Performance + Grade Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Course Performance vs Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coursePerformance} layout="vertical" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="course" width={110} tick={{ fontSize: 11 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} name="Your Score" />
                    <Bar dataKey="avg" fill="#d1d5db" radius={[0, 4, 4, 0]} barSize={12} name="Class Average" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  Grade Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} name="Your Grades" />
                    <Bar dataKey="classAvg" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={24} name="Class Average" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strengths.map((s) => (
                  <div key={s.label} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weaknesses.map((w) => (
                  <div key={w.label} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                      <w.icon className={`w-4 h-4 ${w.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{w.label}</p>
                      <p className="text-xs text-muted-foreground">{w.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4 sm:space-y-6 mt-4">
          {/* Study Time + Subject Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Weekly Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={studyTimeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} formatter={(v: number) => [`${v}h`, "Study Time"]} />
                    <defs>
                      <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="hours" stroke="#10b981" fill="url(#studyGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  Subject Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectBreakdown.map((subject) => (
                  <div key={subject.course}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{subject.course}</span>
                        <TrendIcon trend={subject.trend} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={subject.grade.startsWith("A") ? "default" : "secondary"} className="text-xs">
                          {subject.grade}
                        </Badge>
                        <span className="text-sm font-semibold w-10 text-right">{subject.progress}%</span>
                      </div>
                    </div>
                    <Progress value={subject.progress} className={`h-2 ${getProgressColor(subject.progress)}`} />
                    <p className="text-[10px] text-muted-foreground mt-0.5">{subject.credits} credits</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Study Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Study Time Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {studyRecommendations.map((rec) => (
                  <div key={rec.title} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rec.color} mb-3`}>
                      <rec.icon className={`w-5 h-5 ${rec.iconColor}`} />
                    </div>
                    <p className="text-sm font-semibold mb-1">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 sm:space-y-6 mt-4">
          {/* AI Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-500" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+18.7%</p>
                <p className="text-xs text-muted-foreground mt-1">GPA improvement since Sem 1</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">4</p>
                <p className="text-xs text-muted-foreground mt-1">Courses with A grade</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">29h</p>
                <p className="text-xs text-muted-foreground mt-1">Avg weekly study time</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
