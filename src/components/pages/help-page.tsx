"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Rocket,
  BookOpen,
  Award,
  ClipboardCheck,
  CreditCard,
  Calendar,
  Shield,
  Settings,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Eye,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  ExternalLink,
  FileText,
  Users,
  Star,
} from "lucide-react";

// -------------------- Types --------------------

interface KnowledgeCategory {
  id: string;
  title: string;
  description: string;
  articleCount: number;
  icon: React.ElementType;
}

interface PopularArticle {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  views: number;
  helpful: number;
  author: string;
  date: string;
  toc: { id: string; label: string }[];
  content: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

// -------------------- Mock Data --------------------

const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of CampusHub and set up your account quickly.",
    articleCount: 12,
    icon: Rocket,
  },
  {
    id: "courses-enrollment",
    title: "Courses & Enrollment",
    description: "Browse courses, enroll in classes, and manage your academic path.",
    articleCount: 8,
    icon: BookOpen,
  },
  {
    id: "assignments-grades",
    title: "Assignments & Grades",
    description: "Submit assignments, track grades, and understand your academic standing.",
    articleCount: 10,
    icon: Award,
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "Check attendance records, request corrections, and view policies.",
    articleCount: 6,
    icon: ClipboardCheck,
  },
  {
    id: "fees-payments",
    title: "Fees & Payments",
    description: "View fee structures, make payments, and download receipts.",
    articleCount: 9,
    icon: CreditCard,
  },
  {
    id: "timetable-calendar",
    title: "Timetable & Calendar",
    description: "View your schedule, academic calendar, and important dates.",
    articleCount: 5,
    icon: Calendar,
  },
  {
    id: "account-security",
    title: "Account & Security",
    description: "Manage your profile, update passwords, and secure your account.",
    articleCount: 7,
    icon: Shield,
  },
  {
    id: "technical-issues",
    title: "Technical Issues",
    description: "Troubleshoot common problems, browser compatibility, and app issues.",
    articleCount: 11,
    icon: Settings,
  },
];

const popularArticles: PopularArticle[] = [
  {
    id: "a1",
    title: "How to Reset Your CampusHub Password",
    category: "Account & Security",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    views: 3240,
    helpful: 287,
    author: "Support Team",
    date: "Dec 15, 2024",
    toc: [
      { id: "step1", label: "Using the Forgot Password Link" },
      { id: "step2", label: "Resetting via Email" },
      { id: "step3", label: "Setting a New Password" },
      { id: "step4", label: "Troubleshooting Common Issues" },
    ],
    content: [
      "If you've forgotten your CampusHub password, don't worry — resetting it is quick and straightforward. Navigate to the login page and click on the 'Forgot Password?' link located below the login button. This will initiate the password recovery process.",
      "After clicking the link, you'll be prompted to enter the email address associated with your CampusHub account. Within a few minutes, you should receive an email from noreply@campushub.edu with a secure reset link. Make sure to check your spam or junk folder if you don't see the email in your inbox.",
      "Click the reset link in the email and you'll be directed to a secure page where you can create a new password. Your new password must be at least 8 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Avoid reusing passwords from other services.",
      "If you encounter any issues during the reset process — such as not receiving the email or the link expiring — try requesting a new reset link after waiting 5 minutes. You can also contact IT support at support@campushub.edu or visit the IT help desk in the main building during office hours for further assistance.",
    ],
  },
  {
    id: "a2",
    title: "Understanding Your Grade Report and GPA Calculation",
    category: "Assignments & Grades",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    views: 2890,
    helpful: 254,
    author: "Academic Office",
    date: "Dec 10, 2024",
    toc: [
      { id: "step1", label: "Accessing Your Grade Report" },
      { id: "step2", label: "Reading Grade Components" },
      { id: "step3", label: "GPA Calculation Method" },
    ],
    content: [
      "Your grade report is available under the 'Grades & Results' section of CampusHub. Click on any course to view detailed breakdowns including assignment scores, quiz results, midterm and final exam grades, and your overall course grade. Grades are typically updated within 48 hours of submission.",
      "Each grade component contributes a specific percentage to your final grade as defined in the course syllabus. For example, assignments might account for 30%, quizzes for 20%, a midterm for 25%, and the final exam for 25%. You can see these weightings displayed alongside each score in the grade breakdown view.",
      "Your GPA is calculated on a 4.0 scale using the standard formula: sum of (credit hours × grade points) divided by total credit hours attempted. Grade points are assigned as follows: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, and F=0.0. Failed courses are included in the calculation unless retaken.",
    ],
  },
  {
    id: "a3",
    title: "How to Enroll in Courses for the Next Semester",
    category: "Courses & Enrollment",
    categoryColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    views: 2650,
    helpful: 312,
    author: "Registrar Office",
    date: "Nov 28, 2024",
    toc: [
      { id: "step1", label: "Checking Enrollment Dates" },
      { id: "step2", label: "Browsing Available Courses" },
      { id: "step3", label: "Completing Enrollment" },
      { id: "step4", label: "Dropping or Swapping Courses" },
    ],
    content: [
      "Course enrollment typically opens 2 weeks before the start of each semester. You can find the exact enrollment dates on the Academic Calendar page. Make sure your account is in good standing — any outstanding fee balances or holds may prevent you from enrolling on time.",
      "To browse available courses, navigate to 'My Courses' and click 'Browse Catalog.' You can filter courses by department, level, time slot, or instructor. Each course listing shows prerequisites, credit hours, available seats, and a brief description. Pay attention to prerequisites to ensure you meet the requirements.",
      "Once you've selected your courses, add them to your cart and click 'Enroll.' The system will validate your selections against prerequisites, schedule conflicts, and seat availability. If everything checks out, you'll receive a confirmation email with your enrolled courses. You can view your complete schedule on the Timetable page.",
      "If you need to drop or swap a course, you can do so during the add/drop period (typically the first 2 weeks of the semester). Dropping a course after this period may result in a 'W' (Withdrawal) grade on your transcript, which could affect your GPA and financial aid status.",
    ],
  },
  {
    id: "a4",
    title: "Fee Payment Methods and Deadlines Guide",
    category: "Fees & Payments",
    categoryColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    views: 2410,
    helpful: 198,
    author: "Finance Department",
    date: "Dec 5, 2024",
    toc: [
      { id: "step1", label: "Viewing Your Fee Statement" },
      { id: "step2", label: "Available Payment Methods" },
      { id: "step3", label: "Payment Deadlines" },
    ],
    content: [
      "Your fee statement is available under the 'Fees' section of CampusHub. It provides a detailed breakdown of tuition, lab fees, library fees, and any other charges. You can also view your payment history and download receipts for past transactions directly from this page.",
      "CampusHub supports multiple payment methods including online bank transfer, credit/debit card payments, and mobile wallet payments. For bank transfers, use the account details provided on the payment page and include your student ID as the reference. Online card payments are processed instantly through our secure payment gateway.",
      "Fee payment deadlines are strictly enforced. The due date for each semester is typically 2 weeks before classes begin. Late payments may incur a penalty fee of 2% per week. If you're facing financial difficulties, contact the Finance Department to discuss installment plans or scholarship options before the deadline.",
    ],
  },
  {
    id: "a5",
    title: "How to Submit Assignments Online",
    category: "Assignments & Grades",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    views: 2180,
    helpful: 267,
    author: "Academic Office",
    date: "Nov 20, 2024",
    toc: [
      { id: "step1", label: "Finding Your Assignments" },
      { id: "step2", label: "Uploading Your Work" },
      { id: "step3", label: "Confirming Submission" },
      { id: "step4", label: "Late Submission Policy" },
    ],
    content: [
      "Navigate to the 'Assignments' section from your dashboard. Here you'll see a list of all active assignments organized by course. Each assignment card shows the title, due date, status, and any special instructions from your instructor. You can filter assignments by course or status (pending, submitted, graded).",
      "To submit an assignment, click the 'Submit' button on the assignment card. You can upload files in PDF, DOCX, PPTX, or ZIP format (maximum 50MB). Some assignments may also accept links to online portfolios or code repositories. Make sure your file follows any naming conventions specified by your instructor.",
      "After uploading, review your submission details and click 'Confirm Submit.' You'll receive a confirmation notification and email. Once submitted, you can view your submission in the 'My Submissions' tab, but you cannot modify the file unless your instructor enables resubmission.",
      "Late submissions are subject to the course-specific late policy outlined in your syllabus. Generally, assignments submitted within 24 hours of the deadline receive a 10% penalty, and submissions after 24 hours may not be accepted. Technical issues are not accepted as valid excuses — submit early and keep backups of your work.",
    ],
  },
  {
    id: "a6",
    title: "Checking and Fixing Attendance Records",
    category: "Attendance",
    categoryColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    views: 1950,
    helpful: 176,
    author: "Student Affairs",
    date: "Dec 1, 2024",
    toc: [
      { id: "step1", label: "Viewing Your Attendance" },
      { id: "step2", label: "Understanding Attendance Codes" },
      { id: "step3", label: "Requesting Corrections" },
    ],
    content: [
      "Your attendance records are accessible under the 'Attendance' section. You'll see a course-by-course breakdown showing total classes, classes attended, classes missed, and your attendance percentage. The minimum attendance requirement for most courses is 75% — falling below this may result in a grade penalty or course withdrawal.",
      "Attendance is marked with several codes: 'P' for Present, 'A' for Absent, 'L' for Late (arrived after 10 minutes), 'E' for Excused (medical or approved leave), and 'M' for Makeup class attendance. Each code is color-coded for easy identification — green for present, red for absent, amber for late.",
      "If you believe your attendance record is incorrect, you can submit a correction request through the Attendance page. Click on the specific date and class, then select 'Request Correction.' Provide a brief explanation and, if available, supporting evidence (such as a medical certificate). Requests are reviewed within 5 business days.",
    ],
  },
  {
    id: "a7",
    title: "Configuring Two-Factor Authentication for Extra Security",
    category: "Account & Security",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    views: 1720,
    helpful: 203,
    author: "IT Security",
    date: "Nov 15, 2024",
    toc: [
      { id: "step1", label: "Enabling 2FA in Settings" },
      { id: "step2", label: "Using Authenticator App" },
      { id: "step3", label: "Backup Codes" },
    ],
    content: [
      "Two-Factor Authentication (2FA) adds an extra layer of security to your CampusHub account. To enable it, go to Settings → Account & Security → Two-Factor Authentication and click 'Enable 2FA.' You'll need an authenticator app such as Google Authenticator, Authy, or Microsoft Authenticator installed on your phone.",
      "Scan the QR code displayed on your screen with the authenticator app. The app will generate a 6-digit code that refreshes every 30 seconds. Enter this code in CampusHub to verify the setup. After enabling 2FA, you'll be prompted to enter this code each time you log in, in addition to your password.",
      "CampusHub will also provide 10 backup recovery codes when you enable 2FA. Store these codes in a safe place — they can be used to access your account if you lose your phone or cannot use the authenticator app. Each backup code can only be used once. If you've used all backup codes, you can regenerate a new set from your security settings.",
    ],
  },
  {
    id: "a8",
    title: "Troubleshooting Browser Compatibility Issues",
    category: "Technical Issues",
    categoryColor: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    views: 1560,
    helpful: 145,
    author: "IT Support",
    date: "Dec 8, 2024",
    toc: [
      { id: "step1", label: "Supported Browsers" },
      { id: "step2", label: "Clearing Browser Cache" },
      { id: "step3", label: "Disabling Extensions" },
      { id: "step4", label: "Contacting IT Support" },
    ],
    content: [
      "CampusHub is optimized for the latest versions of Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari. We recommend using Chrome or Firefox for the best experience. Internet Explorer is no longer supported. If you're using an older browser version, update to the latest release before troubleshooting further.",
      "Many display and functionality issues can be resolved by clearing your browser cache and cookies. In Chrome, go to Settings → Privacy and Security → Clear browsing data. Select 'Cached images and files' and 'Cookies and other site data,' then click 'Clear data.' Refresh the CampusHub page after clearing.",
      "Browser extensions (especially ad blockers, privacy tools, and VPN extensions) can sometimes interfere with CampusHub functionality. Try disabling all extensions and refreshing the page. If the issue is resolved, re-enable extensions one by one to identify the culprit. You can also try using CampusHub in an incognito/private browsing window.",
      "If you've tried all the above steps and the issue persists, please contact IT Support through the Live Chat feature or email support@campushub.edu with the following information: your browser name and version, operating system, a screenshot of the issue, and steps to reproduce it. Our team typically responds within 2 business hours during support hours.",
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "How do I log in to CampusHub for the first time?",
    answer:
      "When you first enroll, you'll receive a welcome email with your temporary credentials. Go to the CampusHub login page and enter your student/employee ID and the temporary password provided. You'll be prompted to create a new password and set up your profile. If you didn't receive the email, check your spam folder or contact the IT help desk at support@campushub.edu. You can also use the 'Account Recovery' option on the login page by entering your registered email address or phone number.",
  },
  {
    question: "Where can I find my grades and when are they updated?",
    answer:
      "Your grades are available under 'Grades & Results' in the navigation menu. Individual assignment and quiz grades are typically updated within 48 hours of the submission deadline. Midterm and final exam grades may take up to 1 week after the exam date. You'll receive a notification whenever new grades are posted. If you believe there's an error in your grade, contact your course instructor within 7 days of the grade being posted. Final course grades are officially released at the end of each semester after the examination board meeting.",
  },
  {
    question: "How do I pay my tuition fees online?",
    answer:
      "Navigate to the 'Fees' section from the navigation menu. Your outstanding balance and fee breakdown will be displayed on the dashboard. Click 'Pay Now' and select your preferred payment method — credit/debit card, bank transfer, or mobile wallet. Follow the on-screen instructions to complete the transaction. You'll receive an instant confirmation and a downloadable receipt. Payment is typically reflected in your account within 1 business day for bank transfers and instantly for card payments.",
  },
  {
    question: "What should I do if my attendance shows incorrectly?",
    answer:
      "If you notice an error in your attendance record, first verify the date and class details. Then, go to the Attendance page, find the specific class session, and click 'Request Correction.' Provide a clear explanation of the error and include any supporting documentation (e.g., medical certificate for excused absence, class notes as proof of presence). Your request will be reviewed by the course instructor and the attendance coordinator. You'll be notified of the decision within 5 business days. For urgent matters, contact the Student Affairs office directly.",
  },
  {
    question: "Can I enroll in courses outside my declared major?",
    answer:
      "Yes, you can enroll in elective courses outside your major, subject to availability and prerequisites. During the enrollment period, use the 'Browse Catalog' feature and filter by all departments. Elective courses are typically labeled with an 'E' prefix. Each program has specific requirements for the number of elective credits needed for graduation — consult your academic advisor to ensure your selections fulfill your degree requirements. Cross-departmental courses may require approval from both your department and the offering department.",
  },
  {
    question: "How do I enable dark mode in CampusHub?",
    answer:
      "CampusHub supports both light and dark themes. To switch to dark mode, click your profile avatar in the top-right corner of the screen and select the theme toggle button (sun/moon icon). Your preference is saved automatically and will persist across sessions. You can also set dark mode to follow your system settings — go to Settings → Appearance and select 'System Default.' Note that some features like the timetable may have limited color differentiation in dark mode.",
  },
  {
    question: "What do I do if CampusHub is loading slowly or not working?",
    answer:
      "First, check your internet connection and try refreshing the page. If the issue persists, try clearing your browser cache (Settings → Clear Browsing Data), disabling browser extensions, or using an incognito/private window. CampusHub may also undergo scheduled maintenance — check the announcements section for any maintenance notices. If the problem continues, check our status page at status.campushub.edu for real-time system status. For persistent issues, contact IT Support via Live Chat or email support@campushub.edu with your browser version and a description of the problem.",
  },
  {
    question: "How do I download my semester timetable?",
    answer:
      "Your timetable is available under the 'Timetable' section. To download it, click the 'Export' or 'Download' button at the top of the timetable page. You can choose to download as a PDF or as an ICS file (which can be imported into Google Calendar, Apple Calendar, or Outlook). The PDF version is printer-friendly and shows all your classes, rooms, and instructors for the week. The ICS file allows you to receive push notifications 15 minutes before each class. Timetable changes are reflected in real-time, so re-download the file if there are any schedule updates.",
  },
];

const relatedArticlesMap: Record<string, { id: string; title: string }[]> = {
  a1: [
    { id: "a7", title: "Configuring Two-Factor Authentication for Extra Security" },
    { id: "a8", title: "Troubleshooting Browser Compatibility Issues" },
    { id: "a6", title: "Checking and Fixing Attendance Records" },
  ],
  a2: [
    { id: "a5", title: "How to Submit Assignments Online" },
    { id: "a3", title: "How to Enroll in Courses for the Next Semester" },
    { id: "a1", title: "How to Reset Your CampusHub Password" },
  ],
  a3: [
    { id: "a2", title: "Understanding Your Grade Report and GPA Calculation" },
    { id: "a5", title: "How to Submit Assignments Online" },
    { id: "a6", title: "Checking and Fixing Attendance Records" },
  ],
  a4: [
    { id: "a1", title: "How to Reset Your CampusHub Password" },
    { id: "a3", title: "How to Enroll in Courses for the Next Semester" },
    { id: "a7", title: "Configuring Two-Factor Authentication for Extra Security" },
  ],
  a5: [
    { id: "a2", title: "Understanding Your Grade Report and GPA Calculation" },
    { id: "a3", title: "How to Enroll in Courses for the Next Semester" },
    { id: "a6", title: "Checking and Fixing Attendance Records" },
  ],
  a6: [
    { id: "a5", title: "How to Submit Assignments Online" },
    { id: "a2", title: "Understanding Your Grade Report and GPA Calculation" },
    { id: "a8", title: "Troubleshooting Browser Compatibility Issues" },
  ],
  a7: [
    { id: "a1", title: "How to Reset Your CampusHub Password" },
    { id: "a4", title: "Fee Payment Methods and Deadlines Guide" },
    { id: "a8", title: "Troubleshooting Browser Compatibility Issues" },
  ],
  a8: [
    { id: "a1", title: "How to Reset Your CampusHub Password" },
    { id: "a7", title: "Configuring Two-Factor Authentication for Extra Security" },
    { id: "a2", title: "Understanding Your Grade Report and GPA Calculation" },
  ],
};

const quickLinks = [
  { label: "Getting Started", icon: Rocket, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" },
  { label: "Fees & Payments", icon: CreditCard, color: "text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400" },
  { label: "Academic Policies", icon: BookOpen, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400" },
  { label: "Technical Support", icon: Settings, color: "text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400" },
];

// -------------------- Component --------------------

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<PopularArticle | null>(null);
  const [helpfulVote, setHelpfulVote] = useState<"yes" | "no" | null>(null);

  const filteredArticles = popularArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = knowledgeCategories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenArticle = (article: PopularArticle) => {
    setSelectedArticle(article);
    setHelpfulVote(null);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="space-y-8 page-transition">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 sm:p-10 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-10 h-10 mr-3 opacity-90" />
            <h1 className="text-2xl sm:text-3xl font-bold">Help Center</h1>
          </div>
          <p className="text-emerald-100 mb-6 text-sm sm:text-base">
            Find answers, browse articles, and get the support you need.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="How can we help you?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-white border-0 shadow-lg rounded-xl"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {quickLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium"
              >
                <link.icon className="w-4 h-4 mr-2" />
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Base Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Knowledge Base</h2>
            <p className="text-sm text-muted-foreground">
              Browse articles by category
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {knowledgeCategories.reduce((sum, c) => sum + c.articleCount, 0)} articles
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(searchQuery ? filteredCategories : knowledgeCategories).map((cat) => (
            <Card
              key={cat.id}
              className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700"
            >
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                  <cat.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {cat.articleCount} articles
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Popular Articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Popular Articles</h2>
            <p className="text-sm text-muted-foreground">
              Most viewed articles by the community
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {(searchQuery ? filteredArticles : popularArticles).map((article) => (
            <Card
              key={article.id}
              className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-700"
              onClick={() => handleOpenArticle(article)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-2 py-0 ${article.categoryColor}`}
                      >
                        {article.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {formatNumber(article.views)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {article.helpful} helpful
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* FAQ Accordion */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {faqs.length} questions
          </Badge>
        </div>
        <Card>
          <CardContent className="p-2 sm:p-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-sm font-medium text-left px-2 py-3 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* Contact Support */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Contact Support</h2>
          <p className="text-sm text-muted-foreground">
            Can&apos;t find what you need? Reach out to our team.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Live Chat */}
          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Live Chat</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Chat with a support agent in real-time for immediate assistance.
              </p>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Email Support</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Send us a detailed message and we&apos;ll respond within 24 hours.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-400 dark:hover:bg-teal-900/20 w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Phone */}
          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Phone Support</h3>
              <p className="text-xs text-muted-foreground mb-1">
                Call us directly for urgent issues.
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                <Clock className="w-3 h-3 inline mr-1" />
                Mon–Fri, 9:00 AM – 6:00 PM
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20 w-full"
              >
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 123-4567
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Article View Dialog */}
      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => {
          if (!open) setSelectedArticle(null);
        }}
      >
        {selectedArticle && (
          <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden">
            <ScrollArea className="max-h-[85vh]">
              <div className="p-6">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-2 py-0 ${selectedArticle.categoryColor}`}
                    >
                      {selectedArticle.category}
                    </Badge>
                  </div>
                  <DialogTitle className="text-lg leading-snug">
                    {selectedArticle.title}
                  </DialogTitle>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {selectedArticle.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedArticle.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatNumber(selectedArticle.views)} views
                    </span>
                  </div>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Table of Contents Sidebar */}
                  <div className="md:col-span-1">
                    <Card className="p-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Contents
                      </h4>
                      <nav className="space-y-2">
                        {selectedArticle.toc.map((item, idx) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                            onClick={(e) => e.preventDefault()}
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="line-clamp-2">{item.label}</span>
                          </a>
                        ))}
                      </nav>
                    </Card>
                  </div>

                  {/* Article Content */}
                  <div className="md:col-span-3 space-y-5">
                    {selectedArticle.content.map((paragraph, idx) => (
                      <div key={idx} id={selectedArticle.toc[idx]?.id}>
                        {selectedArticle.toc[idx] && (
                          <h3 className="text-sm font-semibold mb-2 text-foreground">
                            {selectedArticle.toc[idx].label}
                          </h3>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Was this helpful? */}
                <div className="text-center">
                  <p className="text-sm font-medium mb-3">Was this article helpful?</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant={helpfulVote === "yes" ? "default" : "outline"}
                      className={
                        helpfulVote === "yes"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : ""
                      }
                      onClick={() => setHelpfulVote("yes")}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Yes
                    </Button>
                    <Button
                      size="sm"
                      variant={helpfulVote === "no" ? "default" : "outline"}
                      className={
                        helpfulVote === "no"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : ""
                      }
                      onClick={() => setHelpfulVote("no")}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      No
                    </Button>
                  </div>
                  {helpfulVote && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {helpfulVote === "yes"
                        ? "Thank you for your feedback!"
                        : "We're sorry to hear that. We'll work on improving this article."}
                    </p>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Related Articles */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Related Articles</h4>
                  <div className="space-y-2">
                    {(relatedArticlesMap[selectedArticle.id] ?? []).map((related) => {
                      const relatedArticle = popularArticles.find((a) => a.id === related.id);
                      if (!relatedArticle) return null;
                      return (
                        <div
                          key={related.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleOpenArticle(relatedArticle)}
                        >
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium line-clamp-1">
                              {related.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {relatedArticle.category}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
