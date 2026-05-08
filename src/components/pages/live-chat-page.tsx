"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/app-store";
import {
  MessageCircle, Search, Plus, Send, Paperclip, Smile, Phone,
  Users, Clock, Check, CheckCheck, Circle, MoreVertical,
  MessageSquare, GraduationCap, HeartPulse, UserCircle, X,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -------------------- Types --------------------

type Role = "Teacher" | "Counselor" | "Peer";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  read: boolean;
  type: "sent" | "received";
}

interface ChatContact {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

// -------------------- Mock Data --------------------

const MOCK_CONTACTS: ChatContact[] = [
  {
    id: "c-1", name: "Prof. Emily Rodriguez", role: "Teacher", avatar: "ER",
    online: true, lastMessage: "The assignment deadline has been extended to Friday.", lastTime: "2 min ago", unread: 2,
    messages: [
      { id: "m1", senderId: "c-1", senderName: "Prof. Emily Rodriguez", text: "Hi Ryan, I noticed your last assignment submission.", time: "10:30 AM", read: true, type: "received" },
      { id: "m2", senderId: "me", senderName: "You", text: "Yes professor, I submitted it yesterday evening.", time: "10:32 AM", read: true, type: "sent" },
      { id: "m3", senderId: "c-1", senderName: "Prof. Emily Rodriguez", text: "Great work! Your solution for the binary tree problem was well-structured.", time: "10:35 AM", read: true, type: "received" },
      { id: "m4", senderId: "me", senderName: "You", text: "Thank you! I spent extra time on the optimization part.", time: "10:37 AM", read: true, type: "sent" },
      { id: "m5", senderId: "c-1", senderName: "Prof. Emily Rodriguez", text: "The assignment deadline has been extended to Friday.", time: "11:45 AM", read: false, type: "received" },
      { id: "m6", senderId: "c-1", senderName: "Prof. Emily Rodriguez", text: "This gives everyone more time to work on the DBMS project.", time: "11:45 AM", read: false, type: "received" },
    ],
  },
  {
    id: "c-2", name: "Dr. Sarah Mitchell", role: "Counselor", avatar: "SM",
    online: true, lastMessage: "Let's schedule a follow-up for next week.", lastTime: "15 min ago", unread: 1,
    messages: [
      { id: "m7", senderId: "me", senderName: "You", text: "Dr. Mitchell, I wanted to talk about my course load this semester.", time: "2:00 PM", read: true, type: "sent" },
      { id: "m8", senderId: "c-2", senderName: "Dr. Sarah Mitchell", text: "Of course, Ryan. How are you managing with 6 courses?", time: "2:05 PM", read: true, type: "received" },
      { id: "m9", senderId: "me", senderName: "You", text: "It's been challenging. I'm considering dropping one course.", time: "2:08 PM", read: true, type: "sent" },
      { id: "m10", senderId: "c-2", senderName: "Dr. Sarah Mitchell", text: "I understand. Let's review your options during our next session.", time: "2:12 PM", read: true, type: "received" },
      { id: "m11", senderId: "c-2", senderName: "Dr. Sarah Mitchell", text: "Let's schedule a follow-up for next week.", time: "2:15 PM", read: false, type: "received" },
    ],
  },
  {
    id: "c-3", name: "Sophia Martinez", role: "Peer", avatar: "SM",
    online: false, lastMessage: "Did you finish the physics lab report?", lastTime: "1 hr ago", unread: 0,
    messages: [
      { id: "m12", senderId: "c-3", senderName: "Sophia Martinez", text: "Hey Ryan! Are you working on the physics assignment?", time: "9:00 AM", read: true, type: "received" },
      { id: "m13", senderId: "me", senderName: "You", text: "Yeah, I'm on question 3 right now. How about you?", time: "9:05 AM", read: true, type: "sent" },
      { id: "m14", senderId: "c-3", senderName: "Sophia Martinez", text: "Did you finish the physics lab report?", time: "10:30 AM", read: true, type: "received" },
    ],
  },
  {
    id: "c-4", name: "Prof. James Walker", role: "Teacher", avatar: "JW",
    online: false, lastMessage: "Office hours are from 3-5 PM today.", lastTime: "3 hrs ago", unread: 0,
    messages: [
      { id: "m15", senderId: "c-4", senderName: "Prof. James Walker", text: "Good morning Ryan, I saw you had some questions about the calculus homework.", time: "8:00 AM", read: true, type: "received" },
      { id: "m16", senderId: "me", senderName: "You", text: "Yes professor, I'm struggling with the integration by parts problems.", time: "8:15 AM", read: true, type: "sent" },
      { id: "m17", senderId: "c-4", senderName: "Prof. James Walker", text: "Office hours are from 3-5 PM today.", time: "8:20 AM", read: true, type: "received" },
    ],
  },
  {
    id: "c-5", name: "Liam Johnson", role: "Peer", avatar: "LJ",
    online: true, lastMessage: "Study group at 4 PM in the library?", lastTime: "30 min ago", unread: 3,
    messages: [
      { id: "m18", senderId: "c-5", senderName: "Liam Johnson", text: "Ryan, are you free this afternoon?", time: "11:00 AM", read: true, type: "received" },
      { id: "m19", senderId: "me", senderName: "You", text: "Depends, what's up?", time: "11:10 AM", read: true, type: "sent" },
      { id: "m20", senderId: "c-5", senderName: "Liam Johnson", text: "A few of us are forming a study group for the OS midterm.", time: "11:12 AM", read: true, type: "received" },
      { id: "m21", senderId: "c-5", senderName: "Liam Johnson", text: "Study group at 4 PM in the library?", time: "11:15 AM", read: false, type: "received" },
      { id: "m22", senderId: "c-5", senderName: "Liam Johnson", text: "Me, Sophia, and Aisha are going to be there.", time: "11:15 AM", read: false, type: "received" },
      { id: "m23", senderId: "c-5", senderName: "Liam Johnson", text: "Bring your notes on process scheduling!", time: "11:16 AM", read: false, type: "received" },
    ],
  },
  {
    id: "c-6", name: "Dr. Anika Patel", role: "Counselor", avatar: "AP",
    online: false, lastMessage: "Your career assessment results are ready for review.", lastTime: "Yesterday", unread: 0,
    messages: [
      { id: "m24", senderId: "c-6", senderName: "Dr. Anika Patel", text: "Hi Ryan, I've completed your career assessment analysis.", time: "Yesterday", read: true, type: "received" },
      { id: "m25", senderId: "me", senderName: "You", text: "That's great! Can I see the results?", time: "Yesterday", read: true, type: "sent" },
      { id: "m26", senderId: "c-6", senderName: "Dr. Anika Patel", text: "Your career assessment results are ready for review.", time: "Yesterday", read: true, type: "received" },
    ],
  },
  {
    id: "c-7", name: "Aisha Khan", role: "Peer", avatar: "AK",
    online: true, lastMessage: "I'll share the notes after the class!", lastTime: "2 hrs ago", unread: 0,
    messages: [
      { id: "m27", senderId: "c-7", senderName: "Aisha Khan", text: "Hey, do you have notes from yesterday's networking lecture?", time: "9:30 AM", read: true, type: "received" },
      { id: "m28", senderId: "me", senderName: "You", text: "Yes! I'll scan and send them over.", time: "9:45 AM", read: true, type: "sent" },
      { id: "m29", senderId: "c-7", senderName: "Aisha Khan", text: "I'll share the notes after the class!", time: "9:50 AM", read: true, type: "received" },
    ],
  },
];

const ROLE_CONFIG: Record<Role, { color: string; icon: React.ElementType; badge: string }> = {
  Teacher: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: GraduationCap, badge: "Teacher" },
  Counselor: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: HeartPulse, badge: "Counselor" },
  Peer: { color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400", icon: UserCircle, badge: "Peer" },
};

// -------------------- Component --------------------

export function LiveChatPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [startChatOpen, setStartChatOpen] = useState(false);
  const [startChatSearch, setStartChatSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalUnread = useMemo(() => MOCK_CONTACTS.reduce((sum, c) => sum + c.unread, 0), []);
  const activeChats = useMemo(() => MOCK_CONTACTS.filter((c) => c.online).length, []);
  const onlineTutors = useMemo(() => MOCK_CONTACTS.filter((c) => (c.role === "Teacher" || c.role === "Counselor") && c.online).length, []);

  const filteredContacts = useMemo(() => {
    return MOCK_CONTACTS.filter((c) => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (roleFilter !== "all" && c.role !== roleFilter) return false;
      return true;
    });
  }, [searchQuery, roleFilter]);

  const selectedChat = useMemo(() => {
    return selectedChatId ? MOCK_CONTACTS.find((c) => c.id === selectedChatId) : null;
  }, [selectedChatId]);

  // Auto scroll on chat change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatId, selectedChat?.messages.length]);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChatId) return;
    setMessageInput("");
  };

  const searchableUsers = [
    { id: "su-1", name: "Prof. David Kim", role: "Teacher" as Role, online: true },
    { id: "su-2", name: "Dr. Rachel Green", role: "Counselor" as Role, online: false },
    { id: "su-3", name: "Noah Williams", role: "Peer" as Role, online: true },
    { id: "su-4", name: "Prof. Lisa Chang", role: "Teacher" as Role, online: false },
    { id: "su-5", name: "Emma Davis", role: "Peer" as Role, online: true },
  ].filter((u) => !startChatSearch || u.name.toLowerCase().includes(startChatSearch.toLowerCase()));

  return (
    <div className="space-y-4 page-transition">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Live Chat
          </h1>
          <p className="text-muted-foreground text-sm">Connect with teachers, counselors, and peers in real time</p>
        </div>
        <Dialog open={startChatOpen} onOpenChange={setStartChatOpen}>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => setStartChatOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />Start New Chat
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Start New Conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search users by name..." className="pl-9" value={startChatSearch} onChange={(e) => setStartChatSearch(e.target.value)} />
              </div>
              <ScrollArea className="max-h-64">
                <div className="space-y-1.5 pr-2">
                  {searchableUsers.map((user) => {
                    const rc = ROLE_CONFIG[user.role];
                    return (
                      <button
                        key={user.id}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        onClick={() => setStartChatOpen(false)}
                      >
                        <div className="relative">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <Circle className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-white dark:fill-muted stroke-2 ${user.online ? "fill-emerald-500 stroke-emerald-600" : "fill-gray-300 stroke-gray-400 dark:fill-gray-600 dark:stroke-gray-500"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <Badge className={`text-[10px] px-1.5 py-0 ${rc.color}`}>{rc.badge}</Badge>
                        </div>
                      </button>
                    );
                  })}
                  {searchableUsers.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No users found</p>
                  )}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline" size="sm">Cancel</Button></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Chats", value: activeChats, icon: MessageSquare, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Unread Messages", value: totalUnread, icon: MessageCircle, color: "text-amber-600 dark:text-amber-400" },
          { label: "Online Tutors", value: onlineTutors, icon: Users, color: "text-teal-600 dark:text-teal-400" },
          { label: "Avg Response Time", value: "~4 min", icon: Clock, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="stat-card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-lg font-bold mt-0.5">{s.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Layout */}
      <Card className="overflow-hidden">
        <div className="flex h-[calc(100vh-340px)] min-h-[500px]">
          {/* Sidebar - Contact List */}
          <div className={`w-full sm:w-80 lg:w-96 border-r flex flex-col bg-muted/20 ${selectedChatId ? "hidden sm:flex" : "flex"}`}>
            {/* Search and filter */}
            <div className="p-3 space-y-2 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-8 h-8 text-xs" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex gap-1.5">
                {(["all", "Teacher", "Counselor", "Peer"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`text-[10px] px-2 py-1 rounded-full transition-colors ${roleFilter === role ? "bg-emerald-600 text-white" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
                  >
                    {role === "all" ? "All" : role}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact list */}
            <ScrollArea className="flex-1">
              <div className="divide-y">
                <AnimatePresence>
                  {filteredContacts.map((contact) => {
                    const rc = ROLE_CONFIG[contact.role];
                    const isSelected = selectedChatId === contact.id;
                    return (
                      <motion.button
                        key={contact.id}
                        onClick={() => setSelectedChatId(contact.id)}
                        className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50 ${isSelected ? "bg-emerald-50 dark:bg-emerald-950/20" : ""}`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className={`text-xs font-medium ${rc.color}`}>
                              {contact.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <Circle className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 stroke-2 stroke-white dark:stroke-muted ${contact.online ? "fill-emerald-500" : "fill-gray-300 dark:fill-gray-600"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm font-medium truncate">{contact.name}</p>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">{contact.lastTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge className={`text-[9px] px-1 py-0 ${rc.color}`}>{rc.badge}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                        </div>
                        {contact.unread > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {contact.unread > 9 ? "9+" : contact.unread}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
                {filteredContacts.length === 0 && (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No conversations found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedChatId ? "hidden sm:flex" : "flex"}`}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b bg-background">
                  <button className="sm:hidden mr-1" onClick={() => setSelectedChatId(null)}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="relative">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className={`text-xs font-medium ${ROLE_CONFIG[selectedChat.role].color}`}>
                        {selectedChat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <Circle className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 stroke-2 stroke-white dark:stroke-muted ${selectedChat.online ? "fill-emerald-500" : "fill-gray-300 dark:fill-gray-600"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{selectedChat.name}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge className={`text-[9px] px-1 py-0 ${ROLE_CONFIG[selectedChat.role].color}`}>
                        {ROLE_CONFIG[selectedChat.role].badge}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {selectedChat.online ? "● Online" : "○ Offline"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-emerald-600">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 max-w-2xl mx-auto">
                    {selectedChat.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-2 max-w-[80%] ${msg.type === "sent" ? "flex-row-reverse" : ""}`}>
                          {/* Avatar */}
                          <Avatar className="w-7 h-7 flex-shrink-0 mt-auto">
                            <AvatarFallback className={`text-[9px] font-medium ${msg.type === "sent" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : ROLE_CONFIG[selectedChat.role].color}`}>
                              {msg.type === "sent" ? "YO" : selectedChat.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {/* Bubble */}
                          <div>
                            <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              msg.type === "sent"
                                ? "bg-emerald-600 text-white rounded-br-md"
                                : "bg-muted rounded-bl-md dark:bg-muted/80"
                            }`}>
                              {msg.text}
                            </div>
                            <div className={`flex items-center gap-1 mt-1 text-[10px] text-muted-foreground ${msg.type === "sent" ? "justify-end" : ""}`}>
                              <span>{msg.time}</span>
                              {msg.type === "sent" && (
                                msg.read
                                  ? <CheckCheck className="w-3 h-3 text-emerald-600" />
                                  : <Check className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-3 border-t bg-background">
                  <div className="flex items-center gap-2 max-w-2xl mx-auto">
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground flex-shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="relative flex-1">
                      <Input
                        placeholder="Type a message..."
                        className="pr-8 h-10 text-sm rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500/50"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      />
                      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground">
                        <Smile className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      className={`w-9 h-9 rounded-full flex-shrink-0 ${messageInput.trim() ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-muted text-muted-foreground"}`}
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <MessageCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground">Select a Conversation</h3>
                  <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs mx-auto">
                    Choose a contact from the list or start a new chat to begin messaging
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white mt-4" size="sm" onClick={() => setStartChatOpen(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" />Start New Chat
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
