"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import {
  GraduationCap,
  Users,
  Briefcase,
  Building2,
  MapPin,
  Search,
  Filter,
  Linkedin,
  MessageSquare,
  UserPlus,
  Star,
  Quote,
  CalendarDays,
  Award,
  TrendingUp,
  Globe,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Heart,
  Eye,
  Clock,
  Trophy,
} from "lucide-react";

// ---- Types ----

interface Alumni {
  id: string;
  name: string;
  avatar?: string;
  batch: string;
  department: string;
  degree: string;
  currentCompany: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  linkedin?: string;
  bio: string;
  achievements: string[];
  careerHistory: { company: string; role: string; period: string }[];
}

interface AlumniEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
  attendees: number;
}

interface SuccessStory {
  id: string;
  name: string;
  batch: string;
  role: string;
  company: string;
  quote: string;
  achievement: string;
  avatarInitials: string;
}

// ---- Mock Data ----

const mockAlumni: Alumni[] = [
  {
    id: "al1", name: "Aarav Mehta", batch: "2020", department: "Computer Science", degree: "B.Tech",
    currentCompany: "Google", role: "Senior Software Engineer", location: "Mountain View, CA",
    email: "aarav.mehta@email.com", phone: "+1 555-1001", linkedin: "linkedin.com/in/aaravmehta",
    bio: "Full-stack developer specializing in distributed systems and cloud infrastructure. Passionate about open-source and mentoring.",
    achievements: ["Published 3 research papers", "Google Peer Bonus Award 2023", "Open-source contributor to Kubernetes"],
    careerHistory: [
      { company: "Google", role: "Senior SWE", period: "2022 - Present" },
      { company: "Microsoft", role: "Software Engineer", period: "2020 - 2022" },
    ],
  },
  {
    id: "al2", name: "Sneha Reddy", batch: "2019", department: "Electronics", degree: "B.Tech",
    currentCompany: "Apple", role: "Hardware Engineer", location: "Cupertino, CA",
    email: "sneha.reddy@email.com", phone: "+1 555-1002", linkedin: "linkedin.com/in/snehareddy",
    bio: "Hardware design engineer working on next-gen consumer electronics. Robotics enthusiast and hackathon winner.",
    achievements: ["Apple Innovation Award", "3 patents filed", "MIT Tech Review 35 Under 35"],
    careerHistory: [
      { company: "Apple", role: "Hardware Engineer", period: "2021 - Present" },
      { company: "Qualcomm", role: "Design Engineer", period: "2019 - 2021" },
    ],
  },
  {
    id: "al3", name: "Rahul Sharma", batch: "2018", department: "MBA", degree: "MBA",
    currentCompany: "McKinsey & Co", role: "Engagement Manager", location: "New York, NY",
    email: "rahul.sharma@email.com", phone: "+1 555-1003", linkedin: "linkedin.com/in/rahulsharma",
    bio: "Management consultant specializing in digital transformation. Led $50M+ projects for Fortune 500 companies.",
    achievements: ["McKinsey Partner Track", "Published Harvard BR article", "TEDx Speaker"],
    careerHistory: [
      { company: "McKinsey & Co", role: "Engagement Manager", period: "2022 - Present" },
      { company: "Deloitte", role: "Senior Consultant", period: "2018 - 2022" },
    ],
  },
  {
    id: "al4", name: "Priya Nair", batch: "2021", department: "Data Science", degree: "M.Tech",
    currentCompany: "Netflix", role: "ML Engineer", location: "Los Gatos, CA",
    email: "priya.nair@email.com", phone: "+1 555-1004", linkedin: "linkedin.com/in/priyanair",
    bio: "Machine learning engineer building recommendation systems that serve 200M+ users. Research focus on reinforcement learning.",
    achievements: ["Best Paper Award at NeurIPS", "Netflix Innovation Award", "GitHub 5k+ stars project"],
    careerHistory: [
      { company: "Netflix", role: "ML Engineer", period: "2023 - Present" },
      { company: "Amazon", role: "Applied Scientist", period: "2021 - 2023" },
    ],
  },
  {
    id: "al5", name: "Vikram Singh", batch: "2017", department: "Mechanical Engg", degree: "B.Tech",
    currentCompany: "Tesla", role: "Engineering Manager", location: "Austin, TX",
    email: "vikram.singh@email.com", phone: "+1 555-1005", linkedin: "linkedin.com/in/vikramsingh",
    bio: "Leading the battery engineering team for Tesla Energy products. Previously worked on Model Y powertrain.",
    achievements: ["Tesla Impact Award", "15 patents in battery tech", "Forbes 30 Under 30"],
    careerHistory: [
      { company: "Tesla", role: "Eng. Manager", period: "2021 - Present" },
      { company: "SpaceX", role: "Engineer", period: "2017 - 2021" },
    ],
  },
  {
    id: "al6", name: "Ananya Gupta", batch: "2020", department: "Computer Science", degree: "B.Tech",
    currentCompany: "Microsoft", role: "Product Manager", location: "Seattle, WA",
    email: "ananya.gupta@email.com", phone: "+1 555-1006", linkedin: "linkedin.com/in/ananyagupta",
    bio: "Product manager at Microsoft Azure. Building cloud services for enterprise customers. Startup advisor.",
    achievements: ["Microsoft Gold Award", "Startup advisor to 5 companies", "Speaker at re:Invent"],
    careerHistory: [
      { company: "Microsoft", role: "Product Manager", period: "2022 - Present" },
      { company: "Amazon Web Services", role: "Associate PM", period: "2020 - 2022" },
    ],
  },
  {
    id: "al7", name: "Karthik Iyer", batch: "2019", department: "Civil Engg", degree: "B.Tech",
    currentCompany: "L&T", role: "Project Director", location: "Mumbai, India",
    email: "karthik.iyer@email.com", phone: "+91 555-1007", linkedin: "linkedin.com/in/karthikiyer",
    bio: "Leading mega infrastructure projects worth $500M+. Expert in sustainable construction and green building design.",
    achievements: ["LEED Certified Professional", "Completed 10 major projects", "Published in ASCE Journal"],
    careerHistory: [
      { company: "L&T", role: "Project Director", period: "2023 - Present" },
      { company: "Shapoorji Pallonji", role: "Senior Engineer", period: "2019 - 2023" },
    ],
  },
  {
    id: "al8", name: "Divya Patel", batch: "2022", department: "Design", degree: "B.Des",
    currentCompany: "Figma", role: "Design Lead", location: "San Francisco, CA",
    email: "divya.patel@email.com", phone: "+1 555-1008", linkedin: "linkedin.com/in/divyapatel",
    bio: "Design lead at Figma creating tools for designers worldwide. Previously at Airbnb and a design startup founder.",
    achievements: ["Awwwards Site of the Day", "Design Startup acquired", "Speaker at Config"],
    careerHistory: [
      { company: "Figma", role: "Design Lead", period: "2023 - Present" },
      { company: "Airbnb", role: "Senior Designer", period: "2022 - 2023" },
    ],
  },
];

const mockEvents: AlumniEvent[] = [
  { id: "ev1", title: "Annual Alumni Reunion 2025", date: "2025-03-15", time: "6:00 PM", location: "Campus Main Auditorium", type: "Reunion", description: "Join us for the biggest alumni gathering of the year with networking, dinner, and nostalgia.", attendees: 350 },
  { id: "ev2", title: "Tech Talk: AI in Industry", date: "2025-02-20", time: "3:00 PM", location: "Virtual (Zoom)", type: "Seminar", description: "Alumni from top tech companies share insights on AI adoption across industries.", attendees: 120 },
  { id: "ev3", title: "Startup Networking Mixer", date: "2025-02-28", time: "7:00 PM", location: "The Grand Hotel, Downtown", type: "Networking", description: "Connect with alumni entrepreneurs and investors. Pitch your startup idea!", attendees: 85 },
  { id: "ev4", title: "Career Mentorship Program", date: "2025-03-01", time: "10:00 AM", location: "Career Center, Block B", type: "Workshop", description: "One-on-one mentorship sessions with experienced alumni across various industries.", attendees: 60 },
  { id: "ev5", title: "Department of CS: 25 Year Celebration", date: "2025-04-10", time: "4:00 PM", location: "CS Department, Building 3", type: "Celebration", description: "Celebrating 25 years of the Computer Science department with distinguished alumni speakers.", attendees: 200 },
];

const mockSuccessStories: SuccessStory[] = [
  { id: "ss1", name: "Vikram Singh", batch: "2017", role: "Engineering Manager", company: "Tesla", quote: "The hands-on lab experience at Greenfield prepared me for real-world engineering challenges that textbooks never could.", achievement: "Forbes 30 Under 30 - Built battery systems powering thousands of homes", avatarInitials: "VS" },
  { id: "ss2", name: "Sneha Reddy", batch: "2019", role: "Hardware Engineer", company: "Apple", quote: "My professors encouraged me to think beyond the syllabus. That mindset led to my first patent within two years of graduating.", achievement: "MIT Tech Review 35 Under 35 - 3 patents in consumer electronics", avatarInitials: "SR" },
  { id: "ss3", name: "Rahul Sharma", batch: "2018", role: "Engagement Manager", company: "McKinsey & Co", quote: "The analytical rigor and case study approach we practiced in class directly translates to what I do at McKinsey every day.", achievement: "Led digital transformation for 5 Fortune 500 companies", avatarInitials: "RS" },
  { id: "ss4", name: "Priya Nair", batch: "2021", role: "ML Engineer", company: "Netflix", quote: "Greenfield's research culture sparked my love for machine learning. I published my first paper during my master's here.", achievement: "Best Paper at NeurIPS - Building recommendation systems for 200M+ users", avatarInitials: "PN" },
];

// ---- Helpers ----

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const allDepartments = [...new Set(mockAlumni.map((a) => a.department))];
const allBatches = [...new Set(mockAlumni.map((a) => a.batch))].sort().reverse();
const allCompanies = [...new Set(mockAlumni.map((a) => a.currentCompany))];
const allLocations = [...new Set(mockAlumni.map((a) => a.location))];

// ---- Main Component ----

export function AlumniPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const [activeTab, setActiveTab] = useState("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [filterCompany, setFilterCompany] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [connectedAlumni, setConnectedAlumni] = useState<Set<string>>(new Set());

  const totalAlumni = mockAlumni.length;
  const thisYearGrads = mockAlumni.filter((a) => a.batch === "2022").length;
  const employedPct = Math.round((mockAlumni.filter((a) => a.currentCompany).length / totalAlumni) * 100);
  const topCompanies = allCompanies.length;

  const filteredAlumni = useMemo(() => {
    return mockAlumni.filter((a) => {
      const matchSearch = !searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBatch = filterBatch === "all" || a.batch === filterBatch;
      const matchDept = filterDept === "all" || a.department === filterDept;
      const matchCompany = filterCompany === "all" || a.currentCompany === filterCompany;
      const matchLocation = filterLocation === "all" || a.location === filterLocation;
      return matchSearch && matchBatch && matchDept && matchCompany && matchLocation;
    });
  }, [searchQuery, filterBatch, filterDept, filterCompany, filterLocation]);

  const openProfile = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setShowProfileDialog(true);
  };

  const handleConnect = (id: string) => {
    setConnectedAlumni((prev) => new Set(prev).add(id));
  };

  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-500" />
            Alumni Directory
          </h1>
          <p className="text-muted-foreground text-sm">Connect with our alumni network</p>
        </div>
        <Badge variant="outline" className="gap-1 w-fit">
          <Users className="w-3 h-3 text-emerald-500" />
          {totalAlumni} Alumni
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Alumni", value: totalAlumni, icon: Users, color: "bg-emerald-500" },
          { label: "This Year Grads", value: thisYearGrads, icon: GraduationCap, color: "bg-teal-500" },
          { label: "Employed", value: `${employedPct}%`, icon: Briefcase, color: "bg-amber-500" },
          { label: "Top Companies", value: topCompanies, icon: Building2, color: "bg-sky-500" },
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="tabs-smooth">
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="stories">Success Stories</TabsTrigger>
        </TabsList>

        {/* Directory Tab */}
        <TabsContent value="directory" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Filter Sidebar */}
            <Card className="lg:col-span-1 lg:sticky lg:top-4 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-500" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Batch Year</Label>
                  <Select value={filterBatch} onValueChange={setFilterBatch}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches</SelectItem>
                      {allBatches.map((b) => (
                        <SelectItem key={b} value={b}>Batch {b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Department</Label>
                  <Select value={filterDept} onValueChange={setFilterDept}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {allDepartments.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Company</Label>
                  <Select value={filterCompany} onValueChange={setFilterCompany}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {allCompanies.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Location</Label>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {allLocations.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => { setFilterBatch("all"); setFilterDept("all"); setFilterCompany("all"); setFilterLocation("all"); }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>

            {/* Alumni Grid */}
            <div className="lg:col-span-3">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alumni by name, company, role, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {filteredAlumni.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No alumni found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredAlumni.map((alumni) => {
                    const isConnected = connectedAlumni.has(alumni.id);
                    return (
                      <Card key={alumni.id} className="card-premium">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                                {getInitials(alumni.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold truncate">{alumni.name}</h3>
                              <p className="text-xs text-muted-foreground">{alumni.role}</p>
                              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{alumni.currentCompany}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{alumni.location}</span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap mb-3">
                            <Badge variant="outline" className="text-[10px]">Batch {alumni.batch}</Badge>
                            <Badge variant="outline" className="text-[10px]">{alumni.department}</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8 text-xs gap-1"
                              onClick={() => openProfile(alumni)}
                            >
                              <Eye className="w-3 h-3" /> View Profile
                            </Button>
                            {isConnected ? (
                              <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-emerald-600 border-emerald-300 dark:border-emerald-700" disabled>
                                <CheckCircle2 className="w-3 h-3" /> Connected
                              </Button>
                            ) : (
                              <Button size="sm" className="h-8 text-xs gap-1 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleConnect(alumni.id)}>
                                <UserPlus className="w-3 h-3" /> Connect
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockEvents.map((event) => (
              <Card key={event.id} className="card-premium">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex flex-col items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold truncate">{event.title}</h3>
                      </div>
                      <Badge className={`text-[10px] border-0 mb-2 ${
                        event.type === "Reunion" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        event.type === "Seminar" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" :
                        event.type === "Networking" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        event.type === "Workshop" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                        "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}>
                        {event.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.attendees}</span>
                      </div>
                      <Button size="sm" className="mt-3 h-8 text-xs gap-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                        <CalendarDays className="w-3 h-3" /> RSVP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Success Stories Tab */}
        <TabsContent value="stories" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSuccessStories.map((story) => (
              <Card key={story.id} className="card-premium overflow-hidden">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-lg font-semibold">
                        {story.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.role} at {story.company}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">Batch {story.batch}</Badge>
                    </div>
                  </div>

                  <div className="relative mb-4 pl-4 border-l-2 border-emerald-300 dark:border-emerald-700">
                    <Quote className="absolute -left-2 -top-1 w-4 h-4 bg-background text-emerald-500" />
                    <p className="text-sm italic text-muted-foreground leading-relaxed">{story.quote}</p>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                    <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{story.achievement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Alumni Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedAlumni && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-lg font-semibold">
                      {getInitials(selectedAlumni.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selectedAlumni.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{selectedAlumni.role} at <span className="text-emerald-600 dark:text-emerald-400 font-medium">{selectedAlumni.currentCompany}</span></p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">Batch {selectedAlumni.batch}</Badge>
                      <Badge variant="outline" className="text-[10px]">{selectedAlumni.degree}</Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">{selectedAlumni.bio}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{selectedAlumni.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{selectedAlumni.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{selectedAlumni.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{selectedAlumni.department}</span>
                  </div>
                </div>

                <div className="section-divider" />

                {/* Career Timeline */}
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                    Career Timeline
                  </h4>
                  <div className="space-y-3">
                    {selectedAlumni.careerHistory.map((job, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{job.role}</p>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                          <p className="text-[10px] text-muted-foreground">{job.period}</p>
                        </div>
                        {i === 0 && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">Current</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-divider" />

                {/* Achievements */}
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-emerald-500" />
                    Achievements
                  </h4>
                  <div className="space-y-2">
                    {selectedAlumni.achievements.map((ach, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{ach}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" className="gap-2" onClick={() => setShowProfileDialog(false)}>
                  <Send className="w-3.5 h-3.5" /> Send Message
                </Button>
                {connectedAlumni.has(selectedAlumni.id) ? (
                  <Button variant="outline" className="gap-2 text-emerald-600 border-emerald-300 dark:border-emerald-700" disabled>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </Button>
                ) : (
                  <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => { handleConnect(selectedAlumni.id); }}>
                    <UserPlus className="w-3.5 h-3.5" /> Connect
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
