"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  MessageCircle,
  Plus,
  Search,
  ArrowLeft,
  ThumbsUp,
  Bookmark,
  Share2,
  Pin,
  CheckCircle2,
  Clock,
  Eye,
  ChevronRight,
  Filter,
  Tag,
  Send,
  Menu,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Megaphone,
  FileText,
  User,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";

// ---- Helpers ----

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatRelative(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---- Types ----

type DiscussionCategory = "Question" | "Discussion" | "Announcement" | "Resource";
type SortOption = "latest" | "mostReplied" | "unresolved" | "mine";

interface ForumCourse {
  id: string;
  code: string;
  name: string;
  icon: React.ElementType;
  unreadCount: number;
}

interface ForumReply {
  id: string;
  authorName: string;
  authorRole: "Student" | "Teacher";
  content: string;
  timestamp: string;
  likes: number;
  isAcceptedAnswer: boolean;
}

interface ForumDiscussion {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: "Student" | "Teacher";
  category: DiscussionCategory;
  timestamp: string;
  replyCount: number;
  viewCount: number;
  likeCount: number;
  isPinned: boolean;
  isResolved: boolean;
  isUnread: boolean;
  tags: string[];
  replies: ForumReply[];
}

// ---- Mock Courses ----

const mockForumCourses: ForumCourse[] = [
  { id: "course-001", code: "CS201", name: "Data Structures & Algorithms", icon: BookOpen, unreadCount: 3 },
  { id: "course-002", code: "CS202", name: "Database Management Systems", icon: BookOpen, unreadCount: 2 },
  { id: "course-003", code: "MATH301", name: "Linear Algebra", icon: GraduationCap, unreadCount: 1 },
];

// ---- Mock Discussions ----

const mockDiscussions: ForumDiscussion[] = [
  {
    id: "disc-001",
    courseId: "course-001",
    title: "How to implement a balanced BST deletion algorithm?",
    content: "I'm working on the BST assignment and the deletion part is tricky. When deleting a node with two children, do we always use the in-order successor? What about using the in-order predecessor? I've tried both approaches but my test cases are failing for certain edge cases.\n\nHere's my current approach:\n1. Find the node to delete\n2. If it has two children, find the in-order successor\n3. Replace the node's value with the successor's value\n4. Delete the successor\n\nAny help would be appreciated!",
    authorName: "Ryan Patel",
    authorRole: "Student",
    category: "Question",
    timestamp: "2025-06-28T10:00:00",
    replyCount: 4,
    viewCount: 89,
    likeCount: 12,
    isPinned: true,
    isResolved: true,
    isUnread: false,
    tags: ["BST", "Algorithms", "Assignment"],
    replies: [
      { id: "r1", authorName: "Prof. Emily Rodriguez", authorRole: "Teacher", content: "Great question! Both in-order successor and predecessor work fine. The key thing to check is:\n\n1. Make sure you're properly updating parent pointers if you're using a parent-based implementation\n2. Handle the case where the successor is the right child directly (it won't have a left child)\n3. Don't forget to free/deallocate the successor node after copying its value\n\nTry adding a test case for deleting the root when it has two children.", timestamp: "2025-06-28T11:30:00", likes: 8, isAcceptedAnswer: true },
      { id: "r2", authorName: "Sophia Martinez", authorRole: "Student", content: "I had the same issue! The problem was in my successor finding function - I wasn't handling the case where the right child itself is the successor (i.e., it has no left subtree). Make sure your findMin function returns correctly in that case.", timestamp: "2025-06-28T12:00:00", likes: 5, isAcceptedAnswer: false },
      { id: "r3", authorName: "Liam Johnson", authorRole: "Student", content: "Here's a helpful visualization tool I found: https://visualgo.net/en/bst\nIt shows step-by-step how BST deletion works. Really helped me understand the edge cases.", timestamp: "2025-06-28T14:15:00", likes: 7, isAcceptedAnswer: false },
      { id: "r4", authorName: "Ryan Patel", authorRole: "Student", content: "Thank you everyone! The issue was indeed with the successor being a direct right child. It's working now! 🎉", timestamp: "2025-06-28T16:00:00", likes: 3, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-002",
    courseId: "course-001",
    title: "Time complexity of Dijkstra's algorithm with a binary heap",
    content: "In class, Prof. Rodriguez mentioned that Dijkstra's algorithm has O((V+E)log V) time complexity when using a binary heap. Can someone explain why it's not O(V^2) like the basic implementation? I understand the basic array-based approach but I'm not clear on how the heap operations affect the overall complexity.",
    authorName: "Emma Thompson",
    authorRole: "Student",
    category: "Question",
    timestamp: "2025-06-27T15:00:00",
    replyCount: 3,
    viewCount: 67,
    likeCount: 8,
    isPinned: false,
    isResolved: true,
    isUnread: true,
    tags: ["Graphs", "Dijkstra", "Complexity"],
    replies: [
      { id: "r5", authorName: "Sophia Martinez", authorRole: "Student", content: "The key insight is that with a binary heap:\n- Each extract-min operation is O(log V)\n- Each decrease-key operation is O(log V)\n- We do V extract-mins and at most E decrease-keys\n\nSo total: O(V log V + E log V) = O((V+E) log V)\n\nThis is much better than O(V^2) for sparse graphs where E << V^2.", timestamp: "2025-06-27T16:30:00", likes: 6, isAcceptedAnswer: true },
      { id: "r6", authorName: "Prof. Emily Rodriguez", authorRole: "Teacher", content: "Great explanation, Sophia! To add to this: for dense graphs (E ≈ V^2), the Fibonacci heap gives O(V log V + E) which is theoretically better, but in practice binary heaps often perform better due to smaller constant factors.", timestamp: "2025-06-27T17:00:00", likes: 9, isAcceptedAnswer: false },
      { id: "r7", authorName: "Emma Thompson", authorRole: "Student", content: "That makes sense now. Thank you both! So for competitive programming, binary heap is usually the way to go.", timestamp: "2025-06-27T18:00:00", likes: 2, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-003",
    courseId: "course-002",
    title: "Normalization vs Denormalization - When to use which?",
    content: "We learned about normalization up to BCNF in class, but in real-world applications, I've heard that denormalization is often preferred for performance. Can we discuss the trade-offs? When is it appropriate to denormalize and what are the risks?",
    authorName: "Ryan Patel",
    authorRole: "Student",
    category: "Discussion",
    timestamp: "2025-06-27T09:00:00",
    replyCount: 5,
    viewCount: 112,
    likeCount: 15,
    isPinned: false,
    isResolved: false,
    isUnread: true,
    tags: ["Normalization", "Database Design", "Performance"],
    replies: [
      { id: "r8", authorName: "Prof. Michael Lee", authorRole: "Teacher", content: "Excellent question for discussion! Normalization eliminates redundancy and ensures data integrity, but it can lead to many JOINs which hurt read performance. Denormalization is a conscious trade-off:\n\n- Read-heavy systems (like analytics dashboards): denormalize for faster reads\n- Write-heavy systems (like transactional systems): normalize to maintain consistency\n- The key is to understand your access patterns first, then decide", timestamp: "2025-06-27T10:00:00", likes: 12, isAcceptedAnswer: false },
      { id: "r9", authorName: "Liam Johnson", authorRole: "Student", content: "At my internship last summer, we used a hybrid approach: normalized tables as the source of truth, and materialized views (denormalized) for reporting. Best of both worlds!", timestamp: "2025-06-27T11:30:00", likes: 8, isAcceptedAnswer: false },
      { id: "r10", authorName: "Sophia Martinez", authorRole: "Student", content: "Caching is another approach. Keep the DB normalized but cache the denormalized results in Redis or similar. This is what most modern web apps do.", timestamp: "2025-06-27T12:00:00", likes: 6, isAcceptedAnswer: false },
      { id: "r11", authorName: "Emma Thompson", authorRole: "Student", content: "What about NoSQL databases? Don't they encourage denormalization by design? How does that fit into this discussion?", timestamp: "2025-06-27T14:00:00", likes: 4, isAcceptedAnswer: false },
      { id: "r12", authorName: "Prof. Michael Lee", authorRole: "Teacher", content: "Good point, Emma. NoSQL databases like MongoDB are designed for denormalized data because they prioritize scalability and availability over consistency (think CAP theorem). The document model naturally leads to denormalization. But this means you need to handle data consistency at the application level.", timestamp: "2025-06-27T15:00:00", likes: 10, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-004",
    courseId: "course-002",
    title: "Mid-term Exam Study Guide Available",
    content: "Dear students,\n\nThe mid-term exam study guide has been uploaded to the course portal. Topics covered:\n\n1. ER Model and ER Diagrams\n2. Relational Algebra\n3. SQL (DDL, DML, DCL)\n4. Normalization (1NF through BCNF)\n5. Transaction Management (ACID properties)\n\nThe exam will be on July 5th during regular class hours. Please review the material and come prepared with any questions for our review session on July 3rd.",
    authorName: "Prof. Michael Lee",
    authorRole: "Teacher",
    category: "Announcement",
    timestamp: "2025-06-26T08:00:00",
    replyCount: 2,
    viewCount: 156,
    likeCount: 22,
    isPinned: true,
    isResolved: false,
    isUnread: false,
    tags: ["Exam", "Mid-term", "Study Guide"],
    replies: [
      { id: "r13", authorName: "Sophia Martinez", authorRole: "Student", content: "Thank you, Prof. Lee! Will the exam be open-book or closed-book?", timestamp: "2025-06-26T09:00:00", likes: 5, isAcceptedAnswer: false },
      { id: "r14", authorName: "Prof. Michael Lee", authorRole: "Teacher", content: "Closed-book, but you can bring one handwritten cheat sheet (A4 size, both sides).", timestamp: "2025-06-26T09:30:00", likes: 18, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-005",
    courseId: "course-003",
    title: "Intuitive explanation of eigenvalues and eigenvectors?",
    content: "I can compute eigenvalues and eigenvectors mechanically, but I don't have a good geometric intuition. Can someone explain what they represent visually? Why are they important in applications like PCA and quantum mechanics?",
    authorName: "Ryan Patel",
    authorRole: "Student",
    category: "Question",
    timestamp: "2025-06-26T14:00:00",
    replyCount: 3,
    viewCount: 73,
    likeCount: 10,
    isPinned: false,
    isResolved: true,
    isUnread: true,
    tags: ["Eigenvalues", "Linear Algebra", "Intuition"],
    replies: [
      { id: "r15", authorName: "Prof. David Kim", authorRole: "Teacher", content: "Think of a matrix as a transformation that stretches and rotates space. Eigenvectors are the special directions that only get stretched (not rotated) by the transformation. The eigenvalue tells you how much they get stretched.\n\nFor a 2D example: if a matrix has eigenvector [1,0] with eigenvalue 2, it means the x-axis gets stretched to twice its length without any rotation.\n\nIn PCA, eigenvectors of the covariance matrix represent the principal components (directions of maximum variance), and eigenvalues tell you how much variance each component captures.", timestamp: "2025-06-26T15:00:00", likes: 15, isAcceptedAnswer: true },
      { id: "r16", authorName: "Emma Thompson", authorRole: "Student", content: "3Blue1Brown has an amazing video on this called 'Essence of Linear Algebra' - Chapter 14 specifically covers eigenvectors. The visualizations are incredible!", timestamp: "2025-06-26T16:00:00", likes: 11, isAcceptedAnswer: false },
      { id: "r17", authorName: "Liam Johnson", authorRole: "Student", content: "For quantum mechanics: the Schrödinger equation is essentially an eigenvalue problem. The allowed energy levels of a quantum system are the eigenvalues of the Hamiltonian operator. That's why electrons can only be in certain energy levels!", timestamp: "2025-06-26T17:30:00", likes: 8, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-006",
    courseId: "course-001",
    title: "Study group for graph algorithms - who's interested?",
    content: "Hey everyone! A few of us are planning to form a study group focused on graph algorithms (BFS, DFS, shortest path, MST, etc.) for the upcoming midterm. We're planning to meet on Wednesdays at 4 PM in the library study room.\n\nTopics we want to cover:\n- Graph representations (adjacency list vs matrix)\n- BFS and DFS\n- Dijkstra's and Bellman-Ford\n- Kruskal's and Prim's MST\n- Topological sort\n- Strongly connected components\n\nLet me know if you're interested!",
    authorName: "Sophia Martinez",
    authorRole: "Student",
    category: "Discussion",
    timestamp: "2025-06-25T12:00:00",
    replyCount: 7,
    viewCount: 95,
    likeCount: 18,
    isPinned: false,
    isResolved: false,
    isUnread: false,
    tags: ["Study Group", "Graphs", "Collaboration"],
    replies: [
      { id: "r18", authorName: "Ryan Patel", authorRole: "Student", content: "Count me in! I really need help with topological sort. Would Wednesdays work for everyone?", timestamp: "2025-06-25T12:30:00", likes: 3, isAcceptedAnswer: false },
      { id: "r19", authorName: "Emma Thompson", authorRole: "Student", content: "I'm in! Can we also cover network flow problems? That's a topic I'm really struggling with.", timestamp: "2025-06-25T13:00:00", likes: 4, isAcceptedAnswer: false },
      { id: "r20", authorName: "Liam Johnson", authorRole: "Student", content: "Wednesday at 4 PM works for me. Should we create a shared document for notes and problems?", timestamp: "2025-06-25T13:30:00", likes: 5, isAcceptedAnswer: false },
      { id: "r21", authorName: "Noah Williams", authorRole: "Student", content: "Can I join even though I'm from the BBA batch? I'm taking a CS elective on algorithms and could use the help!", timestamp: "2025-06-25T14:00:00", likes: 7, isAcceptedAnswer: false },
      { id: "r22", authorName: "Sophia Martinez", authorRole: "Student", content: "Of course, Noah! Everyone is welcome. I've created a Google Doc for our notes. I'll share the link in our group chat. Let's aim to solve 5-10 problems each session.", timestamp: "2025-06-25T14:30:00", likes: 6, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-007",
    courseId: "course-002",
    title: "ACID properties in distributed systems",
    content: "We learned about ACID properties for single-database transactions, but how do these apply in distributed systems? I've heard of the CAP theorem and BASE instead of ACID. Can someone explain the differences and when you'd choose one over the other?",
    authorName: "Liam Johnson",
    authorRole: "Student",
    category: "Question",
    timestamp: "2025-06-24T16:00:00",
    replyCount: 3,
    viewCount: 54,
    likeCount: 9,
    isPinned: false,
    isResolved: false,
    isUnread: true,
    tags: ["ACID", "Distributed Systems", "CAP Theorem"],
    replies: [
      { id: "r23", authorName: "Prof. Michael Lee", authorRole: "Teacher", content: "In distributed systems, maintaining ACID across multiple nodes is expensive. The CAP theorem states you can only guarantee 2 out of 3: Consistency, Availability, Partition tolerance.\n\nMost modern systems choose AP (Availability + Partition tolerance) and use eventual consistency instead of strong consistency. This is the BASE approach:\n- Basically Available\n- Soft state\n- Eventually consistent", timestamp: "2025-06-24T17:00:00", likes: 11, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-008",
    courseId: "course-003",
    title: "Useful linear algebra resources for machine learning",
    content: "Sharing some resources I found helpful for understanding the linear algebra concepts we need for ML:\n\n1. MIT 18.06 (Gilbert Strang) - Free on YouTube\n2. 'Mathematics for Machine Learning' by Deisenroth et al.\n3. Khan Academy Linear Algebra course\n4. 'Linear Algebra Done Right' by Sheldon Axler\n\nFeel free to add more!",
    authorName: "Emma Thompson",
    authorRole: "Student",
    category: "Resource",
    timestamp: "2025-06-23T10:00:00",
    replyCount: 4,
    viewCount: 128,
    likeCount: 25,
    isPinned: false,
    isResolved: false,
    isUnread: false,
    tags: ["Resources", "Machine Learning", "Linear Algebra"],
    replies: [
      { id: "r24", authorName: "Ryan Patel", authorRole: "Student", content: "I'd also recommend 'Essence of Linear Algebra' by 3Blue1Brown on YouTube. The geometric intuition videos are unmatched!", timestamp: "2025-06-23T11:00:00", likes: 14, isAcceptedAnswer: false },
      { id: "r25", authorName: "Prof. David Kim", authorRole: "Teacher", content: "Excellent list! I'd add the Matrix Cookbook (free PDF) as a quick reference for matrix identities and properties. Very useful for derivations.", timestamp: "2025-06-23T12:00:00", likes: 8, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-009",
    courseId: "course-001",
    title: "Dynamic programming vs greedy algorithms - how to identify?",
    content: "I always struggle to determine whether a problem should be solved with DP or a greedy approach. Are there any clear indicators or heuristics? I know that greedy requires optimal substructure AND the greedy choice property, but I can never seem to verify the greedy choice property.",
    authorName: "Noah Williams",
    authorRole: "Student",
    category: "Question",
    timestamp: "2025-06-22T14:00:00",
    replyCount: 2,
    viewCount: 45,
    likeCount: 6,
    isPinned: false,
    isResolved: true,
    isUnread: false,
    tags: ["Dynamic Programming", "Greedy", "Problem Solving"],
    replies: [
      { id: "r26", authorName: "Prof. Emily Rodriguez", authorRole: "Teacher", content: "A useful heuristic: try the exchange argument. If you can show that swapping any non-greedy choice with the greedy choice never makes the solution worse, then greedy works. If you can't, you probably need DP.\n\nCommon greedy patterns: interval scheduling, Huffman coding, MST, shortest path (with non-negative weights).\n\nWhen in doubt, start with DP - it always gives the correct answer, just might be slower.", timestamp: "2025-06-22T15:00:00", likes: 10, isAcceptedAnswer: true },
      { id: "r27", authorName: "Sophia Martinez", authorRole: "Student", content: "Another tip: if the problem asks for 'maximum' or 'minimum' of something that has overlapping subproblems, it's likely DP. If it asks for an 'optimal arrangement' that seems locally obvious at each step, try greedy first.", timestamp: "2025-06-22T16:00:00", likes: 7, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-010",
    courseId: "course-002",
    title: "Assignment 3 - ER Diagram feedback thread",
    content: "Let's use this thread to discuss feedback on Assignment 3 (ER Diagram & Schema Design). What mistakes did everyone make? I lost points for not including a many-to-many relationship properly.",
    authorName: "Liam Johnson",
    authorRole: "Student",
    category: "Discussion",
    timestamp: "2025-06-21T11:00:00",
    replyCount: 6,
    viewCount: 87,
    likeCount: 7,
    isPinned: false,
    isResolved: false,
    isUnread: false,
    tags: ["Assignment", "ER Diagram", "Feedback"],
    replies: [
      { id: "r28", authorName: "Ryan Patel", authorRole: "Student", content: "I lost marks for not normalizing properly. My schema was only in 2NF when it should have been in 3NF. Make sure you check for transitive dependencies!", timestamp: "2025-06-21T11:30:00", likes: 4, isAcceptedAnswer: false },
      { id: "r29", authorName: "Prof. Michael Lee", authorRole: "Teacher", content: "Common issues I noticed:\n1. Many-to-many relationships not converted to junction tables\n2. Weak entities not properly identified\n3. Generalization hierarchies mapped incorrectly\n4. Missing participation constraints\n\nI'll go over these in the next class.", timestamp: "2025-06-21T12:00:00", likes: 9, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-011",
    courseId: "course-003",
    title: "Announcement: Linear Algebra Quiz 6 Date Changed",
    content: "Dear students,\n\nDue to the scheduling conflict with the sports day event, Quiz 6 on Vector Spaces has been rescheduled from June 30 to July 2. The quiz will cover:\n- Subspaces\n- Span and linear independence\n- Basis and dimension\n- Rank-nullity theorem\n\nPlease adjust your preparation accordingly.",
    authorName: "Prof. David Kim",
    authorRole: "Teacher",
    category: "Announcement",
    timestamp: "2025-06-20T09:00:00",
    replyCount: 1,
    viewCount: 98,
    likeCount: 5,
    isPinned: false,
    isResolved: false,
    isUnread: false,
    tags: ["Quiz", "Schedule Change"],
    replies: [
      { id: "r30", authorName: "Emma Thompson", authorRole: "Student", content: "Thank you for the update, Prof. Kim! Will the quiz format be the same as previous ones?", timestamp: "2025-06-20T09:30:00", likes: 2, isAcceptedAnswer: false },
    ],
  },
  {
    id: "disc-012",
    courseId: "course-001",
    title: "Best resources for competitive programming graph problems?",
    content: "Can anyone recommend good resources specifically for graph problems in competitive programming? I've been solving problems on LeetCode but I need more structured practice for graphs. Looking for problem sets categorized by difficulty.",
    authorName: "Emma Thompson",
    authorRole: "Student",
    category: "Resource",
    timestamp: "2025-06-19T13:00:00",
    replyCount: 3,
    viewCount: 76,
    likeCount: 14,
    isPinned: false,
    isResolved: false,
    isUnread: false,
    tags: ["Competitive Programming", "Graphs", "Resources"],
    replies: [
      { id: "r31", authorName: "Sophia Martinez", authorRole: "Student", content: "CP-Algorithms (cp-algorithms.com) is amazing! It has detailed explanations and implementations for every graph algorithm you'd need in CP.", timestamp: "2025-06-19T13:30:00", likes: 9, isAcceptedAnswer: false },
      { id: "r32", authorName: "Ryan Patel", authorRole: "Student", content: "I'd also recommend the 'Graph Theory' section on Codeforces. Sort by difficulty and start from 800-rated problems. CSES Problem Set also has a great Graph section.", timestamp: "2025-06-19T14:00:00", likes: 8, isAcceptedAnswer: false },
      { id: "r33", authorName: "Prof. Emily Rodriguez", authorRole: "Teacher", content: "Great resources shared here! For those interested, I'll be posting weekly graph challenges on the course portal starting next week. These will be CP-style problems relevant to our syllabus.", timestamp: "2025-06-19T16:00:00", likes: 12, isAcceptedAnswer: false },
    ],
  },
];

// ---- Category Config ----

const categoryConfig: Record<DiscussionCategory, { icon: React.ElementType; color: string }> = {
  Question: { icon: HelpCircle, color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0" },
  Discussion: { icon: MessageCircle, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0" },
  Announcement: { icon: Megaphone, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0" },
  Resource: { icon: FileText, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0" },
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "mostReplied", label: "Most Replied" },
  { value: "unresolved", label: "Unresolved" },
  { value: "mine", label: "My Discussions" },
];

// ---- Course Sidebar Content ----

function CourseSidebarContent({
  courses,
  selectedCourse,
  onSelectCourse,
}: {
  courses: ForumCourse[];
  selectedCourse: string | null;
  onSelectCourse: (courseId: string | null) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground px-3 mb-2">
        {courses.length} Courses
      </p>
      <Button
        variant={selectedCourse === null ? "secondary" : "ghost"}
        className="w-full justify-start gap-3 px-3 h-10"
        onClick={() => onSelectCourse(null)}
      >
        <MessageCircle className="w-4 h-4 text-emerald-500" />
        <span className="text-sm">All Discussions</span>
      </Button>
      {courses.map((course) => (
        <Button
          key={course.id}
          variant={selectedCourse === course.id ? "secondary" : "ghost"}
          className="w-full justify-start gap-3 px-3 h-10"
          onClick={() => onSelectCourse(course.id)}
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
            <course.icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-medium truncate">{course.code}</p>
            <p className="text-[10px] text-muted-foreground truncate">{course.name}</p>
          </div>
          {course.unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-medium flex items-center justify-center flex-shrink-0">
              {course.unreadCount}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}

// ---- Main Component ----

export function ForumPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedDiscussion, setSelectedDiscussion] = useState<ForumDiscussion | null>(null);
  const [newDiscussionOpen, setNewDiscussionOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // New discussion form state
  const [newDiscTitle, setNewDiscTitle] = useState("");
  const [newDiscCategory, setNewDiscCategory] = useState<DiscussionCategory>("Question");
  const [newDiscCourse, setNewDiscCourse] = useState("course-001");
  const [newDiscContent, setNewDiscContent] = useState("");
  const [newDiscTags, setNewDiscTags] = useState("");

  // Filtered and sorted discussions
  const filteredDiscussions = useMemo(() => {
    let result = selectedCourse
      ? mockDiscussions.filter((d) => d.courseId === selectedCourse)
      : [...mockDiscussions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.content.toLowerCase().includes(query) ||
          d.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case "latest":
        result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "mostReplied":
        result.sort((a, b) => b.replyCount - a.replyCount);
        break;
      case "unresolved":
        result = result.filter((d) => !d.isResolved);
        break;
      case "mine":
        result = result.filter((d) => d.authorName === currentUser?.name);
        break;
    }

    // Pinned discussions first
    result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return result;
  }, [selectedCourse, searchQuery, sortBy, currentUser]);

  const totalUnread = mockForumCourses.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0">
        <Card className="sticky top-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              My Courses
              {totalUnread > 0 && (
                <Badge className="bg-emerald-500 text-white border-0 text-[10px]">
                  {totalUnread}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <CourseSidebarContent
              courses={mockForumCourses}
              selectedCourse={selectedCourse}
              onSelectCourse={setSelectedCourse}
            />
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Discussion List View */}
        {!selectedDiscussion ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile sidebar trigger */}
                <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-0">
                    <SheetHeader className="p-4 pb-2">
                      <SheetTitle className="text-base font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        My Courses
                      </SheetTitle>
                    </SheetHeader>
                    <div className="px-2 pb-4">
                      <CourseSidebarContent
                        courses={mockForumCourses}
                        selectedCourse={selectedCourse}
                        onSelectCourse={(id) => {
                          setSelectedCourse(id);
                          setMobileSidebarOpen(false);
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Discussions</h1>
                  <p className="text-sm text-muted-foreground">
                    {selectedCourse
                      ? mockForumCourses.find((c) => c.id === selectedCourse)?.name
                      : "All Courses"}
                  </p>
                </div>
              </div>

              <Dialog open={newDiscussionOpen} onOpenChange={setNewDiscussionOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-emerald-500" />
                      New Discussion
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Title</Label>
                      <Input
                        value={newDiscTitle}
                        onChange={(e) => setNewDiscTitle(e.target.value)}
                        placeholder="What would you like to discuss?"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <Select
                          value={newDiscCategory}
                          onValueChange={(v) => setNewDiscCategory(v as DiscussionCategory)}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Question">Question</SelectItem>
                            <SelectItem value="Discussion">Discussion</SelectItem>
                            <SelectItem value="Announcement">Announcement</SelectItem>
                            <SelectItem value="Resource">Resource</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Course</Label>
                        <Select value={newDiscCourse} onValueChange={setNewDiscCourse}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockForumCourses.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Content</Label>
                      <Textarea
                        value={newDiscContent}
                        onChange={(e) => setNewDiscContent(e.target.value)}
                        placeholder="Describe your topic in detail..."
                        className="mt-1.5 min-h-[120px] resize-none"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tags (comma-separated)</Label>
                      <Input
                        value={newDiscTags}
                        onChange={(e) => setNewDiscTags(e.target.value)}
                        placeholder="e.g., algorithms, homework, midterm"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewDiscussionOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setNewDiscussionOpen(false);
                        setNewDiscTitle("");
                        setNewDiscContent("");
                        setNewDiscTags("");
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Discussion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="pl-9"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Discussion List */}
            <div className="space-y-3">
              {filteredDiscussions.map((discussion) => {
                const catConfig = categoryConfig[discussion.category];
                const courseInfo = mockForumCourses.find((c) => c.id === discussion.courseId);

                return (
                  <Card
                    key={discussion.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedDiscussion(discussion)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Author Avatar */}
                        <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5">
                          <AvatarFallback className="text-xs bg-muted">
                            {getInitials(discussion.authorName)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2 flex-wrap">
                            {discussion.isPinned && (
                              <Pin className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0 fill-amber-500" />
                            )}
                            <h3
                              className={`text-sm font-semibold leading-tight ${
                                discussion.isUnread ? "" : "font-medium text-muted-foreground"
                              }`}
                            >
                              {discussion.title}
                            </h3>
                          </div>

                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {discussion.content}
                          </p>

                          {/* Meta info row */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                            <span className="text-[11px] text-muted-foreground">
                              {discussion.authorName}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelative(discussion.timestamp)}
                            </span>
                            {courseInfo && (
                              <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                                {courseInfo.code}
                              </Badge>
                            )}
                            <Badge className={`text-[10px] h-5 ${catConfig.color}`}>
                              {discussion.category}
                            </Badge>
                          </div>

                          {/* Tags */}
                          {discussion.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {discussion.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                                >
                                  <Tag className="w-2.5 h-2.5" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Stats row */}
                          <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {discussion.replyCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {discussion.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {discussion.likeCount}
                            </span>
                            {discussion.isResolved && (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                Resolved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredDiscussions.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-sm font-semibold">No discussions found</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try adjusting your filters or start a new discussion.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Discussion Detail View */
          <div className="space-y-4">
            {/* Back button */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground"
              onClick={() => setSelectedDiscussion(null)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Discussions
            </Button>

            {/* Main Post */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-11 w-11 flex-shrink-0">
                    <AvatarFallback
                      className={`text-sm ${
                        selectedDiscussion.authorRole === "Teacher"
                          ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300"
                          : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {getInitials(selectedDiscussion.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedDiscussion.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      )}
                      <h2 className="text-xl font-bold">{selectedDiscussion.title}</h2>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-sm font-medium">{selectedDiscussion.authorName}</span>
                      <Badge
                        className={`text-[10px] ${
                          selectedDiscussion.authorRole === "Teacher"
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                        }`}
                      >
                        {selectedDiscussion.authorRole}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(selectedDiscussion.timestamp)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedDiscussion.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                      <Badge className={`text-[10px] ${categoryConfig[selectedDiscussion.category].color}`}>
                        {selectedDiscussion.category}
                      </Badge>
                      {selectedDiscussion.isResolved && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {selectedDiscussion.content}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {selectedDiscussion.likeCount}
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <Bookmark className="w-3.5 h-3.5" />
                        Bookmark
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Replies
                  <Badge variant="secondary" className="text-xs">
                    {selectedDiscussion.replies.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {selectedDiscussion.replies.map((reply) => (
                  <div key={reply.id}>
                    <div className="flex items-start gap-3 py-4">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback
                          className={`text-xs ${
                            reply.authorRole === "Teacher"
                              ? "bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300"
                              : "bg-muted"
                          }`}
                        >
                          {getInitials(reply.authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{reply.authorName}</span>
                          <Badge
                            className={`text-[10px] ${
                              reply.authorRole === "Teacher"
                                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0"
                                : "bg-muted text-muted-foreground border-0"
                            }`}
                          >
                            {reply.authorRole}
                          </Badge>
                          {reply.isAcceptedAnswer && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Accepted Answer
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatRelative(reply.timestamp)}
                          </span>
                        </div>
                        <div className={`text-sm text-muted-foreground mt-1.5 whitespace-pre-wrap leading-relaxed ${reply.isAcceptedAnswer ? "bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800" : ""}`}>
                          {reply.content}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1.5 mt-2 h-7 text-muted-foreground hover:text-emerald-600"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {reply.likes}
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}

                {/* Reply Input */}
                <div className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        {currentUser ? getInitials(currentUser.name) : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="min-h-[80px] resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" className="flex items-center gap-1.5" disabled={!replyText.trim()}>
                          <Send className="w-3.5 h-3.5" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
