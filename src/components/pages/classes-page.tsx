"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Video,
  Play,
  Pause,
  Monitor,
  Clock,
  Calendar,
  BookOpen,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Hand,
  PhoneOff,
  Send,
  Users,
  Eye,
  ThumbsUp,
  Star,
  Upload,
  Share2,
  MoreVertical,
  Download,
  Trash2,
  Edit3,
  Search,
  Filter,
  Grid3X3,
  List,
  CheckCircle2,
  AlertCircle,
  Radio,
} from "lucide-react";

// -------------------- Types --------------------

type ClassStatus = "live" | "starting-soon" | "scheduled";

interface UpcomingClass {
  id: string;
  courseName: string;
  courseCode: string;
  topic: string;
  teacher: string;
  teacherInitials: string;
  date: string;
  time: string;
  duration: string;
  status: ClassStatus;
  hasMeetingLink: boolean;
}

interface RecordedClass {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  teacher: string;
  teacherInitials: string;
  date: string;
  duration: string;
  views: number;
  rating: number;
  progress: number;
  gradient: string;
}

interface MyRecording {
  id: string;
  title: string;
  course: string;
  date: string;
  duration: string;
  views: number;
  shareLink: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  initial: string;
  message: string;
  time: string;
  isTeacher: boolean;
}

// -------------------- Mock Data --------------------

const upcomingClasses: UpcomingClass[] = [
  {
    id: "uc1",
    courseName: "Data Structures & Algorithms",
    courseCode: "CS201",
    topic: "Binary Trees and Graph Traversal",
    teacher: "Prof. Emily Rodriguez",
    teacherInitials: "ER",
    date: "Today",
    time: "10:00 AM",
    duration: "1h 30m",
    status: "live",
    hasMeetingLink: true,
  },
  {
    id: "uc2",
    courseName: "Database Management Systems",
    courseCode: "CS301",
    topic: "SQL Joins and Subqueries Workshop",
    teacher: "Dr. James Chen",
    teacherInitials: "JC",
    date: "Today",
    time: "10:30 AM",
    duration: "1h 00m",
    status: "starting-soon",
    hasMeetingLink: true,
  },
  {
    id: "uc3",
    courseName: "Operating Systems",
    courseCode: "CS401",
    topic: "Process Scheduling Algorithms",
    teacher: "Prof. Sarah Kim",
    teacherInitials: "SK",
    date: "Today",
    time: "2:00 PM",
    duration: "1h 15m",
    status: "scheduled",
    hasMeetingLink: true,
  },
  {
    id: "uc4",
    courseName: "Computer Networks",
    courseCode: "CS302",
    topic: "TCP/IP Protocol Suite Deep Dive",
    teacher: "Dr. Michael Brown",
    teacherInitials: "MB",
    date: "Today",
    time: "4:00 PM",
    duration: "1h 00m",
    status: "scheduled",
    hasMeetingLink: true,
  },
  {
    id: "uc5",
    courseName: "Software Engineering",
    courseCode: "CS501",
    topic: "Agile Methodologies and Scrum Framework",
    teacher: "Prof. Lisa Wang",
    teacherInitials: "LW",
    date: "Tomorrow",
    time: "9:00 AM",
    duration: "1h 30m",
    status: "scheduled",
    hasMeetingLink: true,
  },
  {
    id: "uc6",
    courseName: "Machine Learning",
    courseCode: "CS601",
    topic: "Neural Networks and Backpropagation",
    teacher: "Dr. Alex Turner",
    teacherInitials: "AT",
    date: "Tomorrow",
    time: "11:00 AM",
    duration: "2h 00m",
    status: "scheduled",
    hasMeetingLink: true,
  },
];

const recordedClasses: RecordedClass[] = [
  {
    id: "rc1",
    title: "Introduction to Linked Lists",
    course: "Data Structures & Algorithms",
    courseCode: "CS201",
    teacher: "Prof. Emily Rodriguez",
    teacherInitials: "ER",
    date: "Dec 12, 2024",
    duration: "1h 28m",
    views: 342,
    rating: 4.8,
    progress: 100,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "rc2",
    title: "Normalization and ER Diagrams",
    course: "Database Management Systems",
    courseCode: "CS301",
    teacher: "Dr. James Chen",
    teacherInitials: "JC",
    date: "Dec 11, 2024",
    duration: "1h 05m",
    views: 289,
    rating: 4.6,
    progress: 72,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    id: "rc3",
    title: "Memory Management Techniques",
    course: "Operating Systems",
    courseCode: "CS401",
    teacher: "Prof. Sarah Kim",
    teacherInitials: "SK",
    date: "Dec 10, 2024",
    duration: "1h 12m",
    views: 198,
    rating: 4.5,
    progress: 45,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "rc4",
    title: "OSI Model and Network Layers",
    course: "Computer Networks",
    courseCode: "CS302",
    teacher: "Dr. Michael Brown",
    teacherInitials: "MB",
    date: "Dec 9, 2024",
    duration: "55m",
    views: 156,
    rating: 4.3,
    progress: 0,
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "rc5",
    title: "Software Development Life Cycle",
    course: "Software Engineering",
    courseCode: "CS501",
    teacher: "Prof. Lisa Wang",
    teacherInitials: "LW",
    date: "Dec 8, 2024",
    duration: "1h 22m",
    views: 234,
    rating: 4.7,
    progress: 88,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "rc6",
    title: "Linear Regression and Gradient Descent",
    course: "Machine Learning",
    courseCode: "CS601",
    teacher: "Dr. Alex Turner",
    teacherInitials: "AT",
    date: "Dec 7, 2024",
    duration: "1h 45m",
    views: 412,
    rating: 4.9,
    progress: 30,
    gradient: "from-sky-500 to-blue-500",
  },
  {
    id: "rc7",
    title: "Sorting Algorithms Comparison",
    course: "Data Structures & Algorithms",
    courseCode: "CS201",
    teacher: "Prof. Emily Rodriguez",
    teacherInitials: "ER",
    date: "Dec 5, 2024",
    duration: "1h 15m",
    views: 278,
    rating: 4.4,
    progress: 100,
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    id: "rc8",
    title: "REST API Design Principles",
    course: "Software Engineering",
    courseCode: "CS501",
    teacher: "Prof. Lisa Wang",
    teacherInitials: "LW",
    date: "Dec 3, 2024",
    duration: "1h 10m",
    views: 189,
    rating: 4.6,
    progress: 0,
    gradient: "from-teal-500 to-emerald-500",
  },
];

const myRecordings: MyRecording[] = [
  {
    id: "mr1",
    title: "Week 12 Lecture: Advanced SQL Queries",
    course: "Database Management Systems",
    date: "Dec 12, 2024",
    duration: "1h 05m",
    views: 145,
    shareLink: "shared_abc123",
  },
  {
    id: "mr2",
    title: "Week 11 Lecture: Indexing Strategies",
    course: "Database Management Systems",
    date: "Dec 5, 2024",
    duration: "58m",
    views: 132,
    shareLink: "shared_def456",
  },
  {
    id: "mr3",
    title: "Week 10 Lecture: Transaction Management",
    course: "Database Management Systems",
    date: "Nov 28, 2024",
    duration: "1h 10m",
    views: 98,
    shareLink: "shared_ghi789",
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: "msg1",
    sender: "Prof. Emily Rodriguez",
    initial: "ER",
    message: "Welcome everyone! Today we'll be covering Binary Trees and Graph Traversal.",
    time: "10:01",
    isTeacher: true,
  },
  {
    id: "msg2",
    sender: "Ryan Patel",
    initial: "RP",
    message: "Can you clarify the difference between pre-order and in-order traversal?",
    time: "10:05",
    isTeacher: false,
  },
  {
    id: "msg3",
    sender: "Prof. Emily Rodriguez",
    initial: "ER",
    message: "Great question! Pre-order visits root first, then left, then right. In-order visits left first, then root, then right. I'll demonstrate both on the whiteboard.",
    time: "10:06",
    isTeacher: true,
  },
  {
    id: "msg4",
    sender: "Priya Sharma",
    initial: "PS",
    message: "Will this be covered in the upcoming assignment?",
    time: "10:12",
    isTeacher: false,
  },
  {
    id: "msg5",
    sender: "Prof. Emily Rodriguez",
    initial: "ER",
    message: "Yes, Assignment 8 will include problems on both tree and graph traversals. Start practicing with the examples from today's lecture.",
    time: "10:13",
    isTeacher: true,
  },
];

// -------------------- Status Helpers --------------------

function StatusBadge({ status }: { status: ClassStatus }) {
  switch (status) {
    case "live":
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-2 py-0 animate-pulse">
          <Radio className="w-3 h-3 mr-1" />
          Live Now
        </Badge>
      );
    case "starting-soon":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] px-2 py-0">
          <AlertCircle className="w-3 h-3 mr-1" />
          Starting in 30 min
        </Badge>
      );
    case "scheduled":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-2 py-0">
          <Clock className="w-3 h-3 mr-1" />
          Scheduled
        </Badge>
      );
  }
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}

// -------------------- Component --------------------

export function ClassesPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<UpcomingClass | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<RecordedClass | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [watchingRecording, setWatchingRecording] = useState(false);

  // Stats
  const stats = [
    { label: "Total Classes This Week", value: "12", icon: Video, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20" },
    { label: "Hours Watched", value: "18.5h", icon: Clock, color: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/20" },
    { label: "Recordings Available", value: "24", icon: Monitor, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20" },
    { label: "Average Rating", value: "4.7", icon: ThumbsUp, color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20" },
  ];

  const filteredUpcoming = upcomingClasses.filter(
    (c) =>
      c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecorded = recordedClasses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Online Classes</h1>
          <p className="text-muted-foreground text-sm">
            Join live sessions, watch recordings, and manage your classes.
          </p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-fit"
          onClick={() => setShowUploadDialog(true)}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Recording
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recorded">Recorded</TabsTrigger>
            <TabsTrigger value="my-recordings">My Recordings</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          {activeTab === "recorded" && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ==================== UPCOMING TAB ==================== */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {/* Live classes first */}
          {filteredUpcoming.some((c) => c.status === "live" || c.status === "starting-soon") && (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Radio className="w-4 h-4 text-red-500" />
              Happening Now
            </div>
          )}
          <div className="space-y-3">
            {filteredUpcoming
              .filter((c) => c.status === "live" || c.status === "starting-soon")
              .map((cls) => (
                <Card
                  key={cls.id}
                  className={`hover:shadow-md transition-all duration-200 ${
                    cls.status === "live"
                      ? "border-red-300 dark:border-red-800 border-2"
                      : "border-amber-300 dark:border-amber-800 border-2"
                  }`}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-semibold">
                            {cls.teacherInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <StatusBadge status={cls.status} />
                            <Badge variant="outline" className="text-[10px]">
                              {cls.courseCode}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm">{cls.topic}</h3>
                          <p className="text-xs text-muted-foreground">
                            {cls.courseName}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span>{cls.teacher}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {cls.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {cls.time}
                            </span>
                            <span>{cls.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className={`w-full sm:w-auto ${
                          cls.status === "live"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                        onClick={() => setSelectedClass(cls)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {cls.status === "live" ? "Join Live Class" : "Join Class"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Scheduled classes */}
          {filteredUpcoming.some((c) => c.status === "scheduled") && (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-6">
              <Calendar className="w-4 h-4" />
              Upcoming Schedule
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredUpcoming
              .filter((c) => c.status === "scheduled")
              .map((cls) => (
                <Card
                  key={cls.id}
                  className="hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold">
                            {cls.teacherInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px]">
                              {cls.courseCode}
                            </Badge>
                            <StatusBadge status={cls.status} />
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-1">{cls.topic}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {cls.courseName}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                            <span>{cls.teacher}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {cls.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {cls.time}
                            </span>
                            <span>{cls.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:border-emerald-800 flex-shrink-0"
                      >
                        <Monitor className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* ==================== RECORDED TAB ==================== */}
      {activeTab === "recorded" && (
        <div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRecorded.map((rec) => (
                <Card
                  key={rec.id}
                  className="group cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden"
                  onClick={() => {
                    setSelectedRecording(rec);
                    setWatchingRecording(false);
                  }}
                >
                  {/* Video thumbnail */}
                  <div className={`relative aspect-video bg-gradient-to-br ${rec.gradient} flex items-center justify-center`}>
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {rec.duration}
                    </div>
                    {rec.progress > 0 && rec.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <div
                          className="h-full bg-white/80"
                          style={{ width: `${rec.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-1 mb-1">{rec.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{rec.course}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(rec.rating)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {rec.views}
                      </span>
                      <span>{rec.date}</span>
                    </div>
                    {rec.progress === 100 && (
                      <div className="mt-2">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-2 py-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecorded.map((rec) => (
                <Card
                  key={rec.id}
                  className="group cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => {
                    setSelectedRecording(rec);
                    setWatchingRecording(false);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className={`w-32 sm:w-40 aspect-video rounded-lg bg-gradient-to-br ${rec.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Play className="w-6 h-6 text-white ml-0.5 group-hover:scale-110 transition-transform" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{rec.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          {rec.course} · {rec.teacher}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(rec.rating)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {rec.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {rec.views} views
                          </span>
                          <span>{rec.date}</span>
                        </div>
                        {rec.progress > 0 && (
                          <div className="mt-2">
                            <Progress value={rec.progress} className="h-1.5" />
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {rec.progress}% watched
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex-shrink-0"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== MY RECORDINGS TAB ==================== */}
      {activeTab === "my-recordings" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {myRecordings.length} recordings uploaded
            </p>
          </div>
          {myRecordings.map((rec) => (
            <Card
              key={rec.id}
              className="hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1">{rec.title}</h3>
                      <p className="text-xs text-muted-foreground">{rec.course}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {rec.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rec.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {rec.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ==================== LIVE CLASS VIEWER DIALOG ==================== */}
      <Dialog open={!!selectedClass && selectedClass.status === "live"} onOpenChange={(open) => !open && setSelectedClass(null)}>
        {selectedClass && selectedClass.status === "live" && (
          <DialogContent className="max-w-5xl p-0 overflow-hidden gap-0">
            {/* Video Area */}
            <div className="bg-gray-900 aspect-video flex items-center justify-center relative">
              <div className="text-center">
                <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Class video feed</p>
                <p className="text-gray-500 text-xs mt-1">Connecting to live stream...</p>
              </div>
              {/* Live indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-sm font-semibold">LIVE</span>
              </div>
              {/* Time remaining */}
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                <Clock className="w-3 h-3 inline mr-1" />
                42:15 remaining
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-800">
              <Button
                size="icon"
                variant={micOn ? "ghost" : "destructive"}
                className={`h-10 w-10 ${micOn ? "text-white hover:bg-gray-700" : ""}`}
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                variant={cameraOn ? "ghost" : "destructive"}
                className={`h-10 w-10 ${cameraOn ? "text-white hover:bg-gray-700" : ""}`}
                onClick={() => setCameraOn(!cameraOn)}
              >
                {cameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                variant={handRaised ? "default" : "ghost"}
                className={`h-10 w-10 ${handRaised ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-white hover:bg-gray-700"}`}
                onClick={() => setHandRaised(!handRaised)}
              >
                <Hand className="w-5 h-5" />
              </Button>
              <div className="w-px h-6 bg-gray-600 mx-1" />
              <Button
                size="sm"
                variant="destructive"
                className="text-white"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                Leave Class
              </Button>
            </div>

            {/* Info + Chat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-h-72">
              {/* Class Info */}
              <div className="p-4 md:col-span-1 border-b md:border-b-0 md:border-r">
                <h3 className="font-semibold text-sm mb-1">{selectedClass.topic}</h3>
                <p className="text-xs text-muted-foreground mb-2">{selectedClass.courseName}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-semibold">
                      {selectedClass.teacherInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{selectedClass.teacher}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>28 participants</span>
                </div>
              </div>

              {/* Chat Panel */}
              <div className="md:col-span-2 flex flex-col">
                <div className="px-4 py-2 border-b">
                  <p className="text-xs font-semibold text-muted-foreground">Class Chat</p>
                </div>
                <ScrollArea className="flex-1 p-3 space-y-3 max-h-40">
                  {mockChatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback
                          className={`text-[10px] font-semibold ${
                            msg.isTeacher
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {msg.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${msg.isTeacher ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="p-2 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ==================== RECORDED CLASS VIEWER DIALOG ==================== */}
      <Dialog open={!!selectedRecording && watchingRecording} onOpenChange={(open) => !open && setWatchingRecording(false)}>
        {selectedRecording && watchingRecording && (
          <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0">
            {/* Video Area */}
            <div className={`aspect-video bg-gradient-to-br ${selectedRecording.gradient} flex items-center justify-center relative`}>
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-3 mb-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                    <Pause className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 h-1 bg-white/30 rounded-full">
                    <div className="h-full bg-white rounded-full" style={{ width: `${selectedRecording.progress}%` }} />
                  </div>
                  <span className="text-white text-xs">{selectedRecording.duration}</span>
                </div>
              </div>
            </div>

            {/* Recording Info */}
            <div className="p-4">
              <h3 className="font-semibold text-base">{selectedRecording.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {selectedRecording.course}
                </span>
                <span>{selectedRecording.teacher}</span>
                <span>{selectedRecording.date}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                {renderStars(selectedRecording.rating)}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {selectedRecording.views} views
                </span>
              </div>
              {selectedRecording.progress < 100 && (
                <div className="mt-3">
                  <Progress value={selectedRecording.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{selectedRecording.progress}% completed</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ==================== UPLOAD RECORDING DIALOG ==================== */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Recording</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input placeholder="e.g., Week 13 Lecture: Advanced Topics" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Course</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs201">CS201 - Data Structures & Algorithms</SelectItem>
                  <SelectItem value="cs301">CS301 - Database Management Systems</SelectItem>
                  <SelectItem value="cs401">CS401 - Operating Systems</SelectItem>
                  <SelectItem value="cs302">CS302 - Computer Networks</SelectItem>
                  <SelectItem value="cs501">CS501 - Software Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea placeholder="Brief description of the recording content..." rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Video File</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-emerald-400 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, WebM, or MOV (max 2GB)
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
