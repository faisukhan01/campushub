"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/app-store";
import {
  mockCourses,
  mockAssessments,
  mockQuizAttempts,
  mockGrades,
  mockStudents,
} from "@/lib/mock-data";
import {
  FileQuestion, Clock, Plus, Users, CheckCircle2, AlertCircle,
  Eye, Play, BarChart3, Send, Trash2, Edit, BookOpen,
  Zap, Shield, Upload,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Question {
  id: string;
  type: "MCQ" | "TrueFalse" | "ShortAnswer" | "FillBlank";
  text: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
}

export function AssessmentsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const isTeacher = currentUser?.role === "Teacher";
  const teacherAssessments = isTeacher
    ? mockAssessments.filter((a) => a.teacherId === currentUser.id)
    : mockAssessments;

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [reviewStudentId, setReviewStudentId] = useState<string | null>(null);
  const [questionInput, setQuestionInput] = useState("");
  const [questionType, setQuestionType] = useState<"MCQ" | "TrueFalse" | "ShortAnswer" | "FillBlank">("MCQ");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "q-1", type: "MCQ", text: "What is the time complexity of binary search?", marks: 5, options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: "O(log n)" },
    { id: "q-2", type: "TrueFalse", text: "A stack follows LIFO principle.", marks: 2, correctAnswer: "True" },
    { id: "q-3", type: "ShortAnswer", text: "Explain the difference between BFS and DFS.", marks: 5 },
  ]);
  const [createForm, setCreateForm] = useState({
    title: "",
    type: "Quiz" as "Quiz" | "Midterm" | "Final",
    course: "",
    duration: "30",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "10:30",
    attempts: "1",
    showExplanation: true,
    randomize: false,
  });

  const selected = selectedAssessment ? mockAssessments.find((a) => a.id === selectedAssessment) : null;
  const attempts = selectedAssessment ? mockQuizAttempts.filter((a) => a.assessmentId === selectedAssessment) : [];

  // Live test takers (mock)
  const liveTakers = selected?.isActive
    ? [
        { studentId: "u-student-001", name: "Ryan Patel", progress: 65, timeLeft: "12:30" },
        { studentId: "u-student-002", name: "Sophia Martinez", progress: 80, timeLeft: "8:15" },
        { studentId: "u-student-003", name: "Liam Johnson", progress: 40, timeLeft: "18:00" },
      ]
    : [];

  const reviewStudent = reviewStudentId ? mockStudents.find((s) => s.id === reviewStudentId) : null;
  const reviewAttempt = reviewStudentId && selectedAssessment
    ? mockQuizAttempts.find((a) => a.assessmentId === selectedAssessment && a.studentId === reviewStudentId)
    : null;

  const addQuestion = () => {
    if (!questionInput.trim()) return;
    const newQ: Question = {
      id: `q-${Date.now()}`,
      type: questionType,
      text: questionInput,
      marks: questionType === "TrueFalse" ? 2 : questionType === "ShortAnswer" ? 5 : 3,
    };
    if (questionType === "MCQ") {
      newQ.options = ["Option A", "Option B", "Option C", "Option D"];
    }
    setQuestions((prev) => [...prev, newQ]);
    setQuestionInput("");
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateForm = (key: string, value: string | boolean) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">
            {isTeacher ? "Create, monitor, and grade assessments" : "View your assessments and results"}
          </p>
        </div>
        {isTeacher && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Create Assessment
            </Button>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Assessment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Assessment title" value={createForm.title} onChange={(e) => updateForm("title", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={createForm.type} onValueChange={(v) => updateForm("type", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quiz">Quiz</SelectItem>
                        <SelectItem value="Midterm">Midterm</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={createForm.course} onValueChange={(v) => updateForm("course", v)}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      {mockCourses.filter((c) => c.teacherId === currentUser?.id).map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Duration (min)</Label>
                    <Input type="number" value={createForm.duration} onChange={(e) => updateForm("duration", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Attempts</Label>
                    <Input type="number" value={createForm.attempts} onChange={(e) => updateForm("attempts", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={createForm.startDate} onChange={(e) => updateForm("startDate", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" value={createForm.startTime} onChange={(e) => updateForm("startTime", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" value={createForm.endTime} onChange={(e) => updateForm("endTime", e.target.value)} />
                  </div>
                </div>

                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Question Bank</Label>
                    <Badge variant="outline" className="text-xs">{questions.length} questions</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Select value={questionType} onValueChange={(v) => setQuestionType(v as typeof questionType)}>
                      <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCQ">MCQ</SelectItem>
                        <SelectItem value="TrueFalse">True/False</SelectItem>
                        <SelectItem value="ShortAnswer">Short Answer</SelectItem>
                        <SelectItem value="FillBlank">Fill in Blank</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Type question text..."
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                    />
                    <Button size="sm" onClick={addQuestion} className="bg-emerald-600 hover:bg-emerald-700 text-white">Add</Button>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs w-full">
                    <Upload className="w-3 h-3 mr-1" />Import from Document
                  </Button>

                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                    {questions.map((q) => (
                      <div key={q.id} className="flex items-start gap-2 p-2 rounded bg-muted/50 text-xs">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{q.type}</Badge>
                            <span className="font-medium">{q.marks} marks</span>
                          </div>
                          <p className="truncate">{q.text}</p>
                          {q.options && (
                            <p className="text-muted-foreground mt-0.5">{q.options.length} options</p>
                          )}
                        </div>
                        <button onClick={() => removeQuestion(q.id)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label>Randomize Questions</Label>
                    </div>
                    <Switch checked={createForm.randomize} onCheckedChange={(v) => updateForm("randomize", v)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label>Show Explanations After</Label>
                    </div>
                    <Switch checked={createForm.showExplanation} onCheckedChange={(v) => updateForm("showExplanation", v)} />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Zap className="w-3 h-3 mr-1" />Create Assessment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="tabs-smooth">
          <TabsTrigger value="list">Assessment List</TabsTrigger>
          {isTeacher && <TabsTrigger value="monitor">Live Monitor</TabsTrigger>}
          <TabsTrigger value="results">Results & Review</TabsTrigger>
        </TabsList>

        {/* Assessment List */}
        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherAssessments.map((assessment) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="card-premium">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{assessment.type}</Badge>
                          {assessment.isActive ? (
                            <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Closed</Badge>
                          )}
                        </div>
                        <h3 className="text-base font-semibold">{assessment.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{assessment.courseName}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                        <FileQuestion className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {assessment.date}</span>
                        {assessment.duration && <span>Duration: {assessment.duration} min</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total: {assessment.totalMarks} marks</span>
                        <span>Pass: {assessment.passingMarks} marks</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Weight: {assessment.weightage}%</span>
                        <span>Questions: {assessment.questionsCount ?? "—"}</span>
                      </div>
                    </div>
                    {isTeacher && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => { setSelectedAssessment(assessment.id); }}>
                          <Eye className="w-3 h-3 mr-1" />View
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs"><Edit className="w-3 h-3" /></Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          {assessment.isActive ? (
                            <><Shield className="w-3 h-3 mr-1" />Publish</>
                          ) : (
                            <><BarChart3 className="w-3 h-3 mr-1" />Results</>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Live Monitor */}
        <TabsContent value="monitor" className="space-y-4">
          {selected?.isActive ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-600" />
                      Live: {selected.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{selected.courseName}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {liveTakers.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liveTakers.map((taker) => (
                    <div key={taker.studentId} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{taker.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={taker.progress} className="h-1.5 flex-1" />
                          <span className="text-[10px] text-muted-foreground">{taker.progress}%</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-mono text-amber-600 dark:text-amber-400">{taker.timeLeft}</p>
                        <p className="text-[10px] text-muted-foreground">remaining</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">No active assessments</p>
                <p className="text-xs text-muted-foreground mt-1">Select an active assessment to monitor live</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Results & Review */}
        <TabsContent value="results" className="space-y-4">
          {selected ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedAssessment(null)} className="text-xs">← Back</Button>
                <div>
                  <h3 className="text-sm font-semibold">{selected.title}</h3>
                  <p className="text-xs text-muted-foreground">{selected.courseName} · {selected.totalMarks} marks</p>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs ml-auto">
                  <Send className="w-3 h-3 mr-1" />Publish Results
                </Button>
              </div>

              {/* Attempts table */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Student Attempts ({attempts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left py-2.5 px-3 text-xs font-semibold">Student</th>
                          <th className="text-center py-2.5 px-3 text-xs font-semibold">Score</th>
                          <th className="text-center py-2.5 px-3 text-xs font-semibold">Percentage</th>
                          <th className="text-center py-2.5 px-3 text-xs font-semibold">Time Spent</th>
                          <th className="text-center py-2.5 px-3 text-xs font-semibold">Status</th>
                          <th className="text-center py-2.5 px-3 text-xs font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attempts.map((attempt) => (
                          <tr key={attempt.id} className="border-b hover:bg-muted/30">
                            <td className="py-2.5 px-3 text-xs font-medium">{attempt.studentName}</td>
                            <td className="py-2.5 px-3 text-center text-xs font-bold">{attempt.score}/{attempt.totalMarks}</td>
                            <td className="py-2.5 px-3 text-center">
                              <Badge
                                variant={attempt.percentage >= 70 ? "default" : attempt.percentage >= 40 ? "secondary" : "destructive"}
                                className={`text-xs ${attempt.percentage >= 70 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}`}
                              >
                                {attempt.percentage}%
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-center text-xs text-muted-foreground">
                              {attempt.timeSpent ? `${Math.floor(attempt.timeSpent / 60)}m ${attempt.timeSpent % 60}s` : "—"}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <Badge variant={attempt.isCompleted ? "default" : "secondary"} className={`text-xs ${attempt.isCompleted ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}`}>
                                {attempt.isCompleted ? "Completed" : "In Progress"}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setReviewStudentId(attempt.studentId)}>
                                <Eye className="w-3 h-3 mr-1" />Review
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {attempts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No attempts recorded yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Student Review Panel */}
              {reviewStudent && reviewAttempt && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        Review: {reviewStudent.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Score: {reviewAttempt.score}/{reviewAttempt.totalMarks}</Badge>
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setReviewStudentId(null)}>✕</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {questions.map((q, idx) => (
                        <div key={q.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px]">Q{idx + 1}</Badge>
                              <Badge variant="secondary" className="text-[10px]">{q.type}</Badge>
                              <span className="text-[10px] text-muted-foreground">{q.marks} marks</span>
                            </div>
                            {q.type === "MCQ" || q.type === "TrueFalse" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Input type="number" placeholder="Marks" className="w-16 h-6 text-[10px]" />
                            )}
                          </div>
                          <p className="text-sm">{q.text}</p>
                          {q.options && (
                            <div className="grid grid-cols-2 gap-1">
                              {q.options.map((opt, oi) => (
                                <div
                                  key={oi}
                                  className={`text-xs px-2 py-1 rounded ${opt === q.correctAnswer ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-muted"}`}
                                >
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}
                          <Textarea placeholder="Feedback for this answer..." rows={1} className="text-xs" />
                        </div>
                      ))}
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                        <Send className="w-3 h-3 mr-1" />Submit Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Select an assessment</p>
                <p className="text-xs text-muted-foreground mt-1">Click &quot;View&quot; on any assessment card to see results</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
