"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/app-store";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  AlertCircle,
  FileQuestion,
  BookOpen,
} from "lucide-react";

// ---- Types ----

type QuestionType = "mcq" | "truefalse" | "shortanswer";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  points: number;
  hasImage: boolean;
}

interface QuizState {
  currentIndex: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  submitted: boolean;
  startTime: number;
  endTime: number | null;
  timeRemaining: number;
}

// ---- Mock Questions ----

const mockQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: "mcq",
    question: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: [
      { id: "a", text: "Queue" },
      { id: "b", text: "Stack" },
      { id: "c", text: "Linked List" },
      { id: "d", text: "Array" },
    ],
    correctAnswer: "b",
    points: 2,
    hasImage: false,
  },
  {
    id: 2,
    type: "truefalse",
    question: "In a binary search tree, the left child of a node always has a greater value than the node itself.",
    options: [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ],
    correctAnswer: "false",
    points: 1,
    hasImage: false,
  },
  {
    id: 3,
    type: "mcq",
    question: "What is the time complexity of accessing an element in a hash table with a good hash function?",
    options: [
      { id: "a", text: "O(n)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(1) average case" },
      { id: "d", text: "O(n log n)" },
    ],
    correctAnswer: "c",
    points: 2,
    hasImage: false,
  },
  {
    id: 4,
    type: "shortanswer",
    question: "What is the difference between a process and a thread in operating systems?",
    options: [],
    correctAnswer: "A process is an independent program in execution with its own memory space, while a thread is a lightweight sub-process that shares memory space with other threads of the same process.",
    points: 3,
    hasImage: false,
  },
  {
    id: 5,
    type: "mcq",
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: [
      { id: "a", text: "Bubble Sort - O(n²)" },
      { id: "b", text: "Merge Sort - O(n log n)" },
      { id: "c", text: "Selection Sort - O(n²)" },
      { id: "d", text: "Insertion Sort - O(n²)" },
    ],
    correctAnswer: "b",
    points: 2,
    hasImage: true,
  },
  {
    id: 6,
    type: "truefalse",
    question: "TCP (Transmission Control Protocol) is a connectionless protocol.",
    options: [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ],
    correctAnswer: "false",
    points: 1,
    hasImage: false,
  },
  {
    id: 7,
    type: "mcq",
    question: "Which layer of the OSI model is responsible for routing?",
    options: [
      { id: "a", text: "Data Link Layer" },
      { id: "b", text: "Transport Layer" },
      { id: "c", text: "Network Layer" },
      { id: "d", text: "Application Layer" },
    ],
    correctAnswer: "c",
    points: 2,
    hasImage: false,
  },
  {
    id: 8,
    type: "shortanswer",
    question: "Explain the concept of virtual memory in operating systems.",
    options: [],
    correctAnswer: "Virtual memory is a memory management technique that creates an illusion of a large, contiguous address space by using both RAM and secondary storage (disk). It allows programs to use more memory than physically available through paging and segmentation.",
    points: 3,
    hasImage: false,
  },
  {
    id: 9,
    type: "mcq",
    question: "What does ACID stand for in database management systems?",
    options: [
      { id: "a", text: "Atomicity, Consistency, Isolation, Durability" },
      { id: "b", text: "Access, Control, Integrity, Data" },
      { id: "c", text: "Asynchronous, Concurrent, Independent, Distributed" },
      { id: "d", text: "Authentication, Control, Identity, Distribution" },
    ],
    correctAnswer: "a",
    points: 2,
    hasImage: false,
  },
  {
    id: 10,
    type: "truefalse",
    question: "In normalized databases, third normal form (3NF) eliminates transitive dependencies.",
    options: [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ],
    correctAnswer: "true",
    points: 1,
    hasImage: false,
  },
];

const TOTAL_TIME_SECONDS = 30 * 60; // 30 minutes

// ---- Helpers ----

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getTimerColor(remaining: number): string {
  if (remaining > 600) return "text-emerald-600 dark:text-emerald-400";
  if (remaining > 180) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getTimerBg(remaining: number): string {
  if (remaining > 600) return "stroke-emerald-500";
  if (remaining > 180) return "stroke-amber-500";
  return "stroke-red-500";
}

function getTimerRingBg(remaining: number): string {
  if (remaining > 600) return "stroke-emerald-100 dark:stroke-emerald-900/50";
  if (remaining > 180) return "stroke-amber-100 dark:stroke-amber-900/50";
  return "stroke-red-100 dark:stroke-red-900/50";
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ---- Circular Timer ----

function CircularTimer({ remaining, total }: { remaining: number; total: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (remaining / total) * circumference;
  const color = getTimerColor(remaining);
  const strokeColor = getTimerBg(remaining);
  const ringBg = getTimerRingBg(remaining);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50" cy="50" r={radius}
          fill="none" strokeWidth="6"
          className={ringBg}
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none" strokeWidth="6"
          className={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Clock className={`w-3.5 h-3.5 ${color} mb-0.5`} />
        <span className={`text-base font-bold tabular-nums ${color}`}>
          {formatTime(remaining)}
        </span>
      </div>
    </div>
  );
}

// ---- Question Navigation Grid ----

function QuestionNavGrid({
  questions,
  currentIndex,
  answers,
  flagged,
  onSelect,
}: {
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, idx) => {
        const isAnswered = !!answers[q.id];
        const isCurrent = idx === currentIndex;
        const isFlagged = flagged.has(q.id);

        let bgClass = "bg-muted text-muted-foreground hover:bg-muted/80";
        if (isCurrent) bgClass = "bg-emerald-500 text-white hover:bg-emerald-600";
        else if (isAnswered) bgClass = "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60";
        else if (isFlagged) bgClass = "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60";

        return (
          <button
            key={q.id}
            onClick={() => onSelect(idx)}
            className={`relative w-full aspect-square rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${bgClass}`}
          >
            {idx + 1}
            {isFlagged && !isCurrent && (
              <Flag className="absolute -top-1 -right-1 w-3 h-3 text-amber-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---- Main Component ----

export function QuizPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);

  const [quizState, setQuizState] = useState<QuizState>({
    currentIndex: 0,
    answers: {},
    flagged: new Set(),
    submitted: false,
    startTime: Date.now(),
    endTime: null,
    timeRemaining: TOTAL_TIME_SECONDS,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [shortAnswerInput, setShortAnswerInput] = useState("");

  const currentQuestion = mockQuestions[quizState.currentIndex];

  // Timer countdown
  useEffect(() => {
    if (quizState.submitted) return;
    const interval = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Auto-submit on time expiry
          return { ...prev, timeRemaining: 0, submitted: true, endTime: Date.now() };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizState.submitted]);

  const handleAnswer = useCallback((questionId: number, answer: string) => {
    setQuizState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const handleShortAnswer = useCallback(() => {
    if (shortAnswerInput.trim()) {
      handleAnswer(currentQuestion.id, shortAnswerInput.trim());
    }
  }, [shortAnswerInput, currentQuestion.id, handleAnswer]);

  const handleFlag = useCallback(() => {
    setQuizState((prev) => {
      const newFlagged = new Set(prev.flagged);
      if (newFlagged.has(currentQuestion.id)) {
        newFlagged.delete(currentQuestion.id);
      } else {
        newFlagged.add(currentQuestion.id);
      }
      return { ...prev, flagged: newFlagged };
    });
  }, [currentQuestion.id]);

  const handlePrev = useCallback(() => {
    if (currentQuestion.type === "shortanswer" && !quizState.answers[currentQuestion.id]) {
      handleShortAnswer();
    }
    setQuizState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, [currentQuestion.type, currentQuestion.id, quizState.answers, handleShortAnswer]);

  const handleNext = useCallback(() => {
    if (currentQuestion.type === "shortanswer" && !quizState.answers[currentQuestion.id]) {
      handleShortAnswer();
    }
    setQuizState((prev) => ({
      ...prev,
      currentIndex: Math.min(mockQuestions.length - 1, prev.currentIndex + 1),
    }));
  }, [currentQuestion.type, currentQuestion.id, quizState.answers, handleShortAnswer]);

  const handleNavSelect = useCallback((index: number) => {
    if (currentQuestion.type === "shortanswer" && !quizState.answers[currentQuestion.id]) {
      handleShortAnswer();
    }
    setQuizState((prev) => ({ ...prev, currentIndex: index }));
  }, [currentQuestion.type, currentQuestion.id, quizState.answers, handleShortAnswer]);

  const handleSubmit = useCallback(() => {
    setQuizState((prev) => ({ ...prev, submitted: true, endTime: Date.now() }));
    setShowConfirmDialog(false);
  }, []);

  const handleRetake = useCallback(() => {
    setQuizState({
      currentIndex: 0,
      answers: {},
      flagged: new Set(),
      submitted: false,
      startTime: Date.now(),
      endTime: null,
      timeRemaining: TOTAL_TIME_SECONDS,
    });
    setShortAnswerInput("");
  }, []);

  // Stats calculations
  const answeredCount = Object.keys(quizState.answers).length;
  const unansweredCount = mockQuestions.length - answeredCount;
  const flaggedCount = quizState.flagged.size;

  // Results
  const calculateResults = () => {
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    mockQuestions.forEach((q) => {
      totalPoints += q.points;
      const userAnswer = quizState.answers[q.id]?.toLowerCase().trim();
      const correctAnswer = q.correctAnswer.toLowerCase().trim();
      if (userAnswer === correctAnswer) {
        correct++;
        earnedPoints += q.points;
      }
    });

    return { correct, total: mockQuestions.length, totalPoints, earnedPoints, percentage: Math.round((earnedPoints / totalPoints) * 100) };
  };

  const results = quizState.submitted ? calculateResults() : null;
  const timeTaken = quizState.endTime ? Math.round((quizState.endTime - quizState.startTime) / 1000) : 0;

  // ---- Student View (Quiz Taking) ----
  if (currentRole === "Student" || currentRole === "Teacher") {
    return (
      <div className="page-transition space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <FileQuestion className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Data Structures & Algorithms</h1>
              <p className="text-sm text-muted-foreground">CS201 &middot; Mid-Semester Assessment</p>
            </div>
          </div>
          {!quizState.submitted && (
            <CircularTimer remaining={quizState.timeRemaining} total={TOTAL_TIME_SECONDS} />
          )}
        </div>

        {!quizState.submitted ? (
          <>
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <Progress value={(answeredCount / mockQuestions.length) * 100} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                {answeredCount}/{mockQuestions.length} answered
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Question Content */}
              <div className="lg:col-span-3">
                <Card className="card-premium">
                  <CardContent className="p-4 sm:p-6">
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Question {quizState.currentIndex + 1} of {mockQuestions.length}
                        </Badge>
                        <Badge
                          className={`text-[10px] ${
                            currentQuestion.type === "mcq" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            currentQuestion.type === "truefalse" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          } border-0`}
                        >
                          {currentQuestion.type === "mcq" ? "Multiple Choice" : currentQuestion.type === "truefalse" ? "True / False" : "Short Answer"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {currentQuestion.points} pts
                        </Badge>
                      </div>
                      {quizState.flagged.has(currentQuestion.id) && (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px] gap-1">
                          <Flag className="w-2.5 h-2.5" /> Flagged
                        </Badge>
                      )}
                    </div>

                    {/* Question Text */}
                    <h2 className="text-base sm:text-lg font-semibold mb-2">{currentQuestion.question}</h2>
                    <p className="text-xs text-muted-foreground mb-6">Select or type the best answer below.</p>

                    {/* Image Placeholder */}
                    {currentQuestion.hasImage && (
                      <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground/20">
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                          <div className="text-center">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">Question diagram / image</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Answer Options */}
                    {currentQuestion.type === "mcq" && (
                      <RadioGroup
                        value={quizState.answers[currentQuestion.id] ?? ""}
                        onValueChange={(val) => handleAnswer(currentQuestion.id, val)}
                        className="space-y-3"
                      >
                        {currentQuestion.options.map((opt) => {
                          const isSelected = quizState.answers[currentQuestion.id] === opt.id;
                          return (
                            <Label
                              key={opt.id}
                              htmlFor={`q${currentQuestion.id}-${opt.id}`}
                              className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500"
                                  : "border-border hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-muted/50"
                              }`}
                            >
                              <RadioGroupItem value={opt.id} id={`q${currentQuestion.id}-${opt.id}`} className="sr-only" />
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/30"
                              }`}>
                                <span className="text-xs font-bold">{opt.id.toUpperCase()}</span>
                              </div>
                              <span className="text-sm">{opt.text}</span>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    )}

                    {currentQuestion.type === "truefalse" && (
                      <RadioGroup
                        value={quizState.answers[currentQuestion.id] ?? ""}
                        onValueChange={(val) => handleAnswer(currentQuestion.id, val)}
                        className="grid grid-cols-2 gap-3"
                      >
                        {currentQuestion.options.map((opt) => {
                          const isSelected = quizState.answers[currentQuestion.id] === opt.id;
                          const isTrue = opt.id === "true";
                          return (
                            <Label
                              key={opt.id}
                              htmlFor={`q${currentQuestion.id}-${opt.id}`}
                              className={`flex items-center justify-center gap-2 p-4 sm:p-6 rounded-xl border cursor-pointer transition-all text-sm font-semibold ${
                                isSelected
                                  ? isTrue ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500" : "border-red-500 bg-red-50 dark:bg-red-950/30 ring-1 ring-red-500"
                                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                              }`}
                            >
                              <RadioGroupItem value={opt.id} id={`q${currentQuestion.id}-${opt.id}`} className="sr-only" />
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isSelected ? (isTrue ? "bg-emerald-500 text-white" : "bg-red-500 text-white") : "bg-muted"
                              }`}>
                                {isTrue ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </div>
                              {opt.text}
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    )}

                    {currentQuestion.type === "shortanswer" && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your answer here..."
                          value={quizState.answers[currentQuestion.id] ?? shortAnswerInput}
                          onChange={(e) => setShortAnswerInput(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-muted-foreground">
                            Your answer will be reviewed manually.
                          </p>
                          {shortAnswerInput.trim() && !quizState.answers[currentQuestion.id] && (
                            <Button size="sm" onClick={handleShortAnswer} className="h-7 text-xs">
                              Save Answer
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="section-divider my-6" />

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrev}
                          disabled={quizState.currentIndex === 0}
                          className="gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={quizState.currentIndex === mockQuestions.length - 1}
                          className="gap-1"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleFlag}
                          className={`gap-1 ${quizState.flagged.has(currentQuestion.id) ? "text-amber-600 border-amber-300 dark:border-amber-700" : ""}`}
                        >
                          <Flag className={`w-3.5 h-3.5 ${quizState.flagged.has(currentQuestion.id) ? "fill-amber-500" : ""}`} />
                          {quizState.flagged.has(currentQuestion.id) ? "Unflag" : "Flag for Review"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowConfirmDialog(true)}
                          className="gap-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit Quiz
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Question Navigation */}
              <div className="lg:col-span-1">
                <Card className="lg:sticky lg:top-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Question Navigator</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <QuestionNavGrid
                      questions={mockQuestions}
                      currentIndex={quizState.currentIndex}
                      answers={quizState.answers}
                      flagged={quizState.flagged}
                      onSelect={handleNavSelect}
                    />
                    <div className="section-divider" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-emerald-500" />
                        <span>Current</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/40" />
                        <span>Answered ({answeredCount})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-muted" />
                        <span>Unanswered ({unansweredCount})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/40" />
                        <span>Flagged ({flaggedCount})</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : results ? (
          /* ---- Results View ---- */
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="card-premium">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center">
                  <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ${
                    results.percentage >= 80 ? "bg-emerald-100 dark:bg-emerald-900/30" :
                    results.percentage >= 60 ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-red-100 dark:bg-red-900/30"
                  }`}>
                    <Trophy className={`w-10 h-10 ${
                      results.percentage >= 80 ? "text-emerald-600 dark:text-emerald-400" :
                      results.percentage >= 60 ? "text-amber-600 dark:text-amber-400" :
                      "text-red-600 dark:text-red-400"
                    }`} />
                  </div>
                  <h2 className="text-3xl font-bold">
                    {results.earnedPoints}/{results.totalPoints}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {results.percentage >= 80 ? "Excellent Performance! 🎉" :
                     results.percentage >= 60 ? "Good Job! 👍" : "Keep Practicing! 💪"}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Score</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{results.percentage}%</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Correct</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{results.correct}/{results.total}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Time Taken</p>
                    <p className="text-xl font-bold">{formatTime(timeTaken)}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Points Earned</p>
                    <p className="text-xl font-bold">{results.earnedPoints}</p>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={handleRetake} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Per-Question Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Answer Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockQuestions.map((q, idx) => {
                    const userAnswer = quizState.answers[q.id] ?? "Not answered";
                    const isCorrect = userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();

                    return (
                      <div key={q.id} className="p-4 rounded-xl border">
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isCorrect ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                            "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}>
                            {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-muted-foreground">Q{idx + 1}</span>
                              <Badge className={`text-[10px] border-0 ${q.type === "mcq" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : q.type === "truefalse" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                                {q.type === "mcq" ? "MCQ" : q.type === "truefalse" ? "T/F" : "Short"}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">{q.points} pts</Badge>
                            </div>
                            <p className="text-sm font-medium mb-2">{q.question}</p>
                            <div className="space-y-1">
                              <p className="text-xs">
                                <span className="text-muted-foreground">Your answer: </span>
                                <span className={isCorrect ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                                  {q.type === "shortanswer" ? (userAnswer.length > 80 ? userAnswer.slice(0, 80) + "..." : userAnswer) : userAnswer.toUpperCase()}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-xs">
                                  <span className="text-muted-foreground">Correct answer: </span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    {q.type === "shortanswer" ? (q.correctAnswer.length > 100 ? q.correctAnswer.slice(0, 100) + "..." : q.correctAnswer) : q.correctAnswer.toUpperCase()}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Submit Quiz?
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3">
                  <p>Are you sure you want to submit? This action cannot be undone.</p>
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</p>
                      <p className="text-[10px] text-muted-foreground">Answered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{unansweredCount}</p>
                      <p className="text-[10px] text-muted-foreground">Unanswered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{flaggedCount}</p>
                      <p className="text-[10px] text-muted-foreground">Flagged</p>
                    </div>
                  </div>
                  {unansweredCount > 0 && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        You have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}.
                      </p>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600">
                Submit Quiz
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ---- Admin View (Quiz Management) ----
  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quiz Center</h1>
          <p className="text-muted-foreground text-sm">Manage assessments and view student results</p>
        </div>
        <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-fit">
          <FileQuestion className="w-4 h-4" /> Create Quiz
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Quizzes", value: "5", icon: FileQuestion, color: "bg-emerald-500" },
          { label: "Total Questions", value: "48", icon: BookOpen, color: "bg-teal-500" },
          { label: "Avg Score", value: "76%", icon: Trophy, color: "bg-amber-500" },
          { label: "Submissions", value: "124", icon: CheckCircle2, color: "bg-sky-500" },
        ].map((stat) => (
          <Card key={stat.label} className="stat-card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Quizzes Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Quiz</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Course</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Questions</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Submissions</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Avg Score</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Mid-Semester Assessment", course: "CS201", questions: 10, submissions: 32, avg: 78, status: "Active" },
                  { name: "Weekly Quiz 5", course: "CS301", questions: 15, submissions: 28, avg: 82, status: "Active" },
                  { name: "Lab Test 2", course: "CS201", questions: 8, submissions: 30, avg: 71, status: "Closed" },
                  { name: "Assignment Quiz", course: "CS401", questions: 12, submissions: 34, avg: 85, status: "Closed" },
                ].map((quiz) => (
                  <tr key={quiz.name} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{quiz.name}</td>
                    <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{quiz.course}</td>
                    <td className="py-3 px-2">{quiz.questions}</td>
                    <td className="py-3 px-2">{quiz.submissions}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={quiz.avg >= 80 ? "text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700" : "text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700"}>
                        {quiz.avg}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={`text-[10px] border-0 ${quiz.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {quiz.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
