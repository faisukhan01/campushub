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
  mockAssignments,
  mockSubmissions,
  mockStudents,
} from "@/lib/mock-data";
import {
  FileEdit, Clock, CheckCircle2, Plus, Edit, Trash2, Eye,
  Users, AlertCircle, Star, Send, Grid,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AssignmentsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const isTeacher = currentUser?.role === "Teacher";
  const teacherAssignments = isTeacher
    ? mockAssignments.filter((a) => a.teacherId === currentUser.id)
    : mockAssignments;

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [gradingMarks, setGradingMarks] = useState<Record<string, string>>({});
  const [gradingFeedback, setGradingFeedback] = useState<Record<string, string>>({});
  const [createForm, setCreateForm] = useState({
    title: "",
    instructions: "",
    course: "",
    dueDate: "",
    dueTime: "23:59",
    maxMarks: "100",
    fileType: "pdf,doc,docx,zip",
    maxSize: "10",
    maxAttempts: "1",
    lateSubmission: false,
    latePenalty: "10",
    isGroup: false,
    isPublished: true,
  });

  const selectedAsgn = selectedAssignment
    ? mockAssignments.find((a) => a.id === selectedAssignment)
    : null;

  const assignmentSubmissions = selectedAssignment
    ? mockSubmissions.filter((s) => s.assignmentId === selectedAssignment)
    : [];

  const updateForm = (key: string, value: string | boolean) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">
            {isTeacher ? "Create, review, and grade student assignments" : "View and manage your assignments"}
          </p>
        </div>
        {isTeacher && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Create Assignment
            </Button>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Assignment title" value={createForm.title} onChange={(e) => updateForm("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Textarea placeholder="Detailed instructions..." rows={3} value={createForm.instructions} onChange={(e) => updateForm("instructions", e.target.value)} />
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" value={createForm.dueDate} onChange={(e) => updateForm("dueDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Time</Label>
                    <Input type="time" value={createForm.dueTime} onChange={(e) => updateForm("dueTime", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Max Marks</Label>
                    <Input type="number" value={createForm.maxMarks} onChange={(e) => updateForm("maxMarks", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Size (MB)</Label>
                    <Input type="number" value={createForm.maxSize} onChange={(e) => updateForm("maxSize", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Attempts</Label>
                    <Input type="number" value={createForm.maxAttempts} onChange={(e) => updateForm("maxAttempts", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>File Types</Label>
                  <Input placeholder="pdf,doc,docx,zip" value={createForm.fileType} onChange={(e) => updateForm("fileType", e.target.value)} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Late Submission</Label>
                    <p className="text-xs text-muted-foreground">Students can submit after deadline</p>
                  </div>
                  <Switch checked={createForm.lateSubmission} onCheckedChange={(v) => updateForm("lateSubmission", v)} />
                </div>
                {createForm.lateSubmission && (
                  <div className="space-y-2">
                    <Label>Late Penalty (%)</Label>
                    <Input type="number" value={createForm.latePenalty} onChange={(e) => updateForm("latePenalty", e.target.value)} />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Group Assignment</Label>
                    <p className="text-xs text-muted-foreground">Students submit as groups</p>
                  </div>
                  <Switch checked={createForm.isGroup} onCheckedChange={(v) => updateForm("isGroup", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Publish Immediately</Label>
                    <p className="text-xs text-muted-foreground">Visible to students right away</p>
                  </div>
                  <Switch checked={createForm.isPublished} onCheckedChange={(v) => updateForm("isPublished", v)} />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {createForm.isPublished ? "Publish" : "Save as Draft"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Assignment List</TabsTrigger>
          <TabsTrigger value="submissions">Submission Review</TabsTrigger>
          <TabsTrigger value="grid">Quick Grading</TabsTrigger>
        </TabsList>

        {/* Assignment List */}
        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherAssignments.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date();
              const submissionRate = assignment.totalStudents > 0
                ? Math.round((assignment.submissionsCount / assignment.totalStudents) * 100)
                : 0;
              const gradedCount = mockSubmissions.filter(
                (s) => s.assignmentId === assignment.id && s.status === "Graded"
              ).length;

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{assignment.type}</Badge>
                            {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                          </div>
                          <CardTitle className="text-base leading-tight">{assignment.title}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{assignment.courseName}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                          <FileEdit className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{assignment.description}</p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {assignment.dueDate}</span>
                          <span className="font-medium">{assignment.totalMarks} marks</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Submissions</span>
                          <span className="font-medium">{assignment.submissionsCount}/{assignment.totalStudents}</span>
                        </div>
                        <Progress value={submissionRate} className="h-1.5" />
                        <div className="flex items-center justify-between pt-1">
                          <span>Graded: {gradedCount}/{assignment.submissionsCount}</span>
                          {gradedCount < assignment.submissionsCount && (
                            <Badge variant="amber" className="text-[10px]">{assignment.submissionsCount - gradedCount} to grade</Badge>
                          )}
                        </div>
                      </div>
                      {isTeacher && (
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => { setSelectedAssignment(assignment.id); }}>
                            <Eye className="w-3 h-3 mr-1" />Review
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs"><Edit className="w-3 h-3" /></Button>
                          <Button variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-700"><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Submission Review */}
        <TabsContent value="submissions" className="space-y-4">
          {selectedAsgn ? (
            <>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(null)} className="text-xs">← Back</Button>
                <div>
                  <h3 className="text-sm font-semibold">{selectedAsgn.title}</h3>
                  <p className="text-xs text-muted-foreground">{selectedAsgn.courseName} · {selectedAsgn.totalMarks} marks</p>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      Submissions ({assignmentSubmissions.length}/{selectedAsgn.totalStudents})
                    </CardTitle>
                    <Badge variant="outline">{selectedAsgn.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignmentSubmissions.length > 0 ? (
                      assignmentSubmissions.map((sub) => (
                        <div key={sub.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{sub.studentName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "Not submitted"}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={sub.status === "Graded" ? "default" : sub.status === "Submitted" ? "secondary" : "outline"}
                              className={sub.status === "Graded" ? "bg-emerald-600 text-white" : ""}
                            >
                              {sub.status}
                            </Badge>
                          </div>
                          {sub.status === "Submitted" && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t">
                              <div className="space-y-1">
                                <Label className="text-xs">Marks (/{selectedAsgn.totalMarks})</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="h-8 text-sm"
                                  value={gradingMarks[sub.id] ?? ""}
                                  onChange={(e) => setGradingMarks((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-1 sm:col-span-2">
                                <Label className="text-xs">Feedback</Label>
                                <Textarea
                                  placeholder="Provide feedback..."
                                  rows={2}
                                  className="text-sm"
                                  value={gradingFeedback[sub.id] ?? ""}
                                  onChange={(e) => setGradingFeedback((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                                />
                              </div>
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs w-full sm:w-auto sm:col-span-3">
                                <Send className="w-3 h-3 mr-1" />Grade Submission
                              </Button>
                            </div>
                          )}
                          {sub.status === "Graded" && (
                            <div className="pt-2 border-t space-y-1">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-semibold">{sub.marksObtained}/{selectedAsgn.totalMarks}</span>
                              </div>
                              {sub.feedback && <p className="text-xs text-muted-foreground italic">&quot;{sub.feedback}&quot;</p>}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No submissions yet for this assignment</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Select an assignment to review submissions</p>
                <p className="text-xs text-muted-foreground mt-1">Click &quot;Review&quot; on any assignment card above</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Quick Grading Grid */}
        <TabsContent value="grid" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Grid className="w-4 h-4" /> Quick Grading Grid
                </CardTitle>
                <Button size="sm" variant="outline" className="text-xs">Save All Grades</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground">Student</th>
                      {teacherAssignments.map((a) => (
                        <th key={a.id} className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground min-w-[100px]">
                          <div className="truncate max-w-[100px]">{a.title.length > 15 ? a.title.slice(0, 15) + "…" : a.title}</div>
                          <div className="text-[10px] text-muted-foreground font-normal">/{a.totalMarks}</div>
                        </th>
                      ))}
                      <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.slice(0, 6).map((student) => (
                      <tr key={student.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3">
                          <p className="font-medium text-xs">{student.name}</p>
                          <p className="text-[10px] text-muted-foreground">{student.rollNumber}</p>
                        </td>
                        {teacherAssignments.map((a) => (
                          <td key={a.id} className="py-2 px-3 text-center">
                            <Input
                              type="number"
                              placeholder="—"
                              className="w-16 h-7 text-xs text-center mx-auto"
                            />
                          </td>
                        ))}
                        <td className="py-2 px-3 text-center">
                          <Badge variant="outline" className="text-xs">—</Badge>
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
