"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAppStore } from "@/store/app-store";
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Plus,
  Video,
  Target,
  BookOpen,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Star,
  TrendingUp,
  GraduationCap,
  Send,
} from "lucide-react";

// ---- Mock Data ----

const mentorProfile = {
  name: "Dr. Michael Chen",
  department: "Computer Science",
  email: "m.chen@campus.edu",
  phone: "+1 (555) 123-4567",
  officeHours: "Tue & Thu, 2:00 PM - 4:00 PM",
  office: "Room 412, CS Building",
  expertise: ["Machine Learning", "Data Science", "Artificial Intelligence", "Computer Vision"],
};

const upcomingSessions = [
  { id: "ms1", date: "2025-01-28", time: "2:00 PM", topic: "Career Planning Discussion", location: "Office 412" },
  { id: "ms2", date: "2025-02-04", time: "2:30 PM", topic: "Research Paper Review", location: "Office 412" },
  { id: "ms3", date: "2025-02-11", time: "3:00 PM", topic: "Internship Application Prep", location: "Video Call" },
  { id: "ms4", date: "2025-02-18", time: "2:00 PM", topic: "Semester Progress Check", location: "Office 412" },
];

const meetingHistory = [
  { id: "mh1", date: "2025-01-14", topic: "Goal Setting for Spring Semester", duration: "45 min" },
  { id: "mh2", date: "2025-01-07", topic: "Fall Semester Review", duration: "30 min" },
  { id: "mh3", date: "2024-12-10", topic: "Course Selection Guidance", duration: "40 min" },
  { id: "mh4", date: "2024-11-20", topic: "Research Interests Discussion", duration: "50 min" },
];

const mentees = [
  { id: "mt1", name: "Aisha Khan", program: "B.Tech CSE", semester: 6, lastMeeting: "2025-01-25", progress: 75, goals: ["Complete ML project", "Apply for 3 internships", "Publish research paper"] },
  { id: "mt2", name: "James Miller", program: "B.Tech CSE", semester: 4, lastMeeting: "2025-01-20", progress: 60, goals: ["Improve GPA", "Join research lab", "Learn cloud computing"] },
  { id: "mt3", name: "Sophia Martinez", program: "M.Tech AI", semester: 2, lastMeeting: "2025-01-22", progress: 85, goals: ["Complete thesis proposal", "Attend conference", "Submit journal paper"] },
  { id: "mt4", name: "David Kim", program: "B.Tech CSE", semester: 8, lastMeeting: "2025-01-18", progress: 90, goals: ["Finalize capstone project", "Job interview prep", "Graduate school applications"] },
];

const meetingTopics = [
  "Academic Progress",
  "Career Planning",
  "Research Guidance",
  "Course Selection",
  "Personal Development",
  "Internship/Career Support",
  "Project Review",
  "General Discussion",
];

const faqItems = [
  { question: "How do I get assigned a mentor?", answer: "Mentors are assigned at the beginning of each academic year based on your department and area of interest. You can also request a specific mentor through the program coordinator." },
  { question: "How often should I meet with my mentor?", answer: "We recommend meeting at least twice a month. Regular meetings help track progress and address concerns early. You can schedule additional sessions as needed." },
  { question: "Can I change my mentor?", answer: "Yes, you can request a mentor change after completing one semester with your current mentor. Submit a request through the program coordinator with a valid reason." },
  { question: "What should I prepare for mentor meetings?", answer: "Prepare an agenda with topics you want to discuss, progress updates on your goals, any challenges you're facing, and questions about your academic or career path." },
  { question: "Is participation in the mentorship program mandatory?", answer: "The mentorship program is mandatory for all undergraduate students in their first two years and optional but highly recommended for upper-level students and graduate students." },
];

// ---- Helpers ----

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ---- Main Component ----

export function MentorshipPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);

  const [requestMeetingOpen, setRequestMeetingOpen] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [meetingMessage, setMeetingMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const isTeacher = currentRole === "Teacher" || currentRole === "InstituteAdmin";

  return (
    <div className="page-transition space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mentorship Program</h1>
            <p className="text-sm text-muted-foreground">
              {isTeacher ? "Manage your mentees and track their progress" : "Connect with your mentor and track your growth"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-mentor" className="tabs-smooth">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="my-mentor">{isTeacher ? "My Mentees" : "My Mentor"}</TabsTrigger>
          {!isTeacher && <TabsTrigger value="mentees">Mentees</TabsTrigger>}
          <TabsTrigger value="program-info">Program Info</TabsTrigger>
        </TabsList>

        {/* Tab 1: My Mentor (Student) or My Mentees (Teacher) */}
        <TabsContent value="my-mentor" className="space-y-4 mt-4">
          {isTeacher ? (
            /* Teacher: Mentee List */
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card className="stat-card-gradient">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Total Mentees</p>
                    <p className="text-2xl font-bold mt-1">{mentees.length}</p>
                  </CardContent>
                </Card>
                <Card className="stat-card-gradient">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Avg Progress</p>
                    <p className="text-2xl font-bold mt-1">{Math.round(mentees.reduce((s, m) => s + m.progress, 0) / mentees.length)}%</p>
                  </CardContent>
                </Card>
              </div>
              {mentees.map((mentee) => (
                <Card key={mentee.id} className="card-premium">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                          {getInitials(mentee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold">{mentee.name}</h3>
                          <Badge variant="outline" className="text-[10px]">{mentee.program}</Badge>
                          <Badge variant="outline" className="text-[10px]">Sem {mentee.semester}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last meeting: {formatDate(mentee.lastMeeting)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1 h-7 text-xs">
                        <Calendar className="w-3 h-3" /> Schedule
                      </Button>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Goal Progress</span>
                        <span className="text-xs font-semibold">{mentee.progress}%</span>
                      </div>
                      <Progress value={mentee.progress} className="h-2" />
                      <div className="mt-2 space-y-1">
                        {mentee.goals.map((goal) => (
                          <div key={goal} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Target className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            {goal}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            /* Student: Mentor Profile */
            <>
              {/* Mentor Profile Card */}
              <Card className="card-premium">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-lg font-semibold">
                        {getInitials(mentorProfile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold">{mentorProfile.name}</h2>
                      <p className="text-sm text-muted-foreground">{mentorProfile.department}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {mentorProfile.expertise.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Dialog open={requestMeetingOpen} onOpenChange={setRequestMeetingOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white whitespace-nowrap">
                          <Plus className="w-3.5 h-3.5" /> Request Meeting
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            Request Meeting
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Topic</Label>
                            <Select value={meetingTopic} onValueChange={setMeetingTopic}>
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select topic" />
                              </SelectTrigger>
                              <SelectContent>
                                {meetingTopics.map((t) => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Preferred Time</Label>
                            <Input
                              type="datetime-local"
                              value={preferredTime}
                              onChange={(e) => setPreferredTime(e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Message (optional)</Label>
                            <Textarea
                              placeholder="Briefly describe what you'd like to discuss..."
                              value={meetingMessage}
                              onChange={(e) => setMeetingMessage(e.target.value)}
                              rows={3}
                              className="resize-none text-sm"
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button size="sm" className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setRequestMeetingOpen(false)}>
                              <Send className="w-3.5 h-3.5" /> Send Request
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mentorProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mentorProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mentorProfile.officeHours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mentorProfile.office}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Upcoming Sessions
                </h3>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <Card key={session.id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-center min-w-[52px] flex-shrink-0">
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatDate(session.date)}</p>
                            <p className="text-[10px] text-muted-foreground">{session.time}</p>
                          </div>
                          <Separator orientation="vertical" className="h-10" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{session.topic}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {session.location === "Video Call" ? (
                                <Video className="w-3 h-3 text-sky-500" />
                              ) : (
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                              )}
                              <p className="text-xs text-muted-foreground">{session.location}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Meeting History */}
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Meeting History
                </h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {meetingHistory.map((meeting) => (
                        <div key={meeting.id} className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <div>
                              <p className="text-sm font-medium">{meeting.topic}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(meeting.date)} &middot; {meeting.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Tab 2: Mentees (Student - optional info view) or for Teacher it's above */}
        {!isTeacher && (
          <TabsContent value="mentees" className="mt-4">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="empty-state-icon mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium mt-2">Mentee Management</p>
                <p className="text-xs text-muted-foreground mt-1">This section is available for mentors (teachers).</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab 3: Program Info */}
        <TabsContent value="program-info" className="space-y-4 mt-4">
          {/* Program Overview */}
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Program Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>The CampusHub Mentorship Program pairs students with experienced faculty members who provide academic guidance, career advice, and personal support throughout your educational journey.</p>
                <p>Our program aims to foster meaningful connections between students and mentors, enhancing the overall learning experience and preparing students for successful careers.</p>
              </div>
            </CardContent>
          </Card>

          {/* Matching Criteria & Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Mentor Matching Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Department and specialization alignment",
                  "Research interest compatibility",
                  "Career path relevance",
                  "Availability and scheduling preferences",
                  "Mentor-to-student ratio balance",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Star className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Session Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Meet at least twice per month",
                  "Prepare an agenda before each session",
                  "Set SMART goals at the beginning",
                  "Document action items and follow-ups",
                  "Provide mutual feedback after sessions",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resource Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-500" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Mentorship Handbook", desc: "Complete guide for mentors and mentees" },
                  { title: "Goal Setting Template", desc: "Template for creating SMART goals" },
                  { title: "Meeting Agenda Template", desc: "Structured template for sessions" },
                ].map((resource) => (
                  <div key={resource.title} className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                    <p className="text-sm font-medium flex items-center gap-1">
                      {resource.title}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{resource.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {faqItems.map((faq) => (
                <Collapsible
                  key={faq.question}
                  open={openFaq === faq.question}
                  onOpenChange={(open) => setOpenFaq(open ? faq.question : null)}
                >
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium">
                    <span className="text-left pr-4">{faq.question}</span>
                    {openFaq === faq.question ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-3 pb-3 text-sm text-muted-foreground">
                      {faq.answer}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
