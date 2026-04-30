"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/app-store";
import {
  mockConversations,
  mockMessages,
} from "@/lib/mock-data";
import type { Message } from "@/types";
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  Paperclip,
  MoreVertical,
  Circle,
} from "lucide-react";

// ---- Helpers ----

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getRoleColor(role: string) {
  switch (role) {
    case "Teacher":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Parent":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400";
    case "Student":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// ---- Component ----

export function MessagesPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Filter conversations for parent
  const isParentView = currentRole === "Parent";
  const parentConversations = isParentView
    ? mockConversations.filter((c) =>
        c.participants.some((p) => p.userId === currentUser?.id)
      )
    : mockConversations;

  const filteredConversations = useMemo(() => {
    let result = parentConversations;
    if (searchQuery) {
      result = result.filter((c) =>
        c.participants.some((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    return result;
  }, [parentConversations, searchQuery]);

  const selectedConversation = useMemo(
    () => parentConversations.find((c) => c.id === selectedConversationId),
    [parentConversations, selectedConversationId]
  );

  const otherParticipant = useMemo(() => {
    if (!selectedConversation) return null;
    return selectedConversation.participants.find(
      (p) => p.userId !== currentUser?.id
    );
  }, [selectedConversation, currentUser?.id]);

  // Get messages for selected conversation
  const conversationMessages = useMemo(() => {
    if (!selectedConversation || !otherParticipant) return [];
    const allMsgs = [
      ...mockMessages.filter(
        (m) =>
          (m.senderId === currentUser?.id && m.receiverId === otherParticipant.userId) ||
          (m.receiverId === currentUser?.id && m.senderId === otherParticipant.userId)
      ),
      ...localMessages.filter((m) => m.type === "Direct"),
    ];
    return allMsgs.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [selectedConversation, otherParticipant, currentUser?.id, localMessages]);

  const unreadTotal = useMemo(() => {
    return parentConversations.reduce((s, c) => s + c.unreadCount, 0);
  }, [parentConversations]);

  const handleSend = () => {
    if (!messageInput.trim() || !selectedConversation || !otherParticipant) return;

    const newMessage: Message = {
      id: `msg-local-${Date.now()}`,
      senderId: currentUser?.id ?? "u-parent-001",
      senderName: currentUser?.name ?? "Parent",
      receiverId: otherParticipant.userId,
      receiverName: otherParticipant.name,
      content: messageInput.trim(),
      type: "Direct",
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          {isParentView
            ? "Communicate with teachers and school administration"
            : `${unreadTotal} unread conversation${unreadTotal !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm h-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No conversations</p>
            ) : (
              filteredConversations.map((conv) => {
                const other = conv.participants.find(
                  (p) => p.userId !== currentUser?.id
                );
                if (!other) return null;
                const isSelected = selectedConversationId === conv.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-0 ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/30"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={`text-xs font-semibold ${
                            isSelected
                              ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"
                              : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          {getInitials(other.name)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${isSelected ? "text-emerald-700 dark:text-emerald-300" : ""}`}>
                          {other.name}
                        </p>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {conv.lastMessage ? formatDate(conv.lastMessage.createdAt) : ""}
                        </span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {conv.lastMessage?.content ?? "No messages yet"}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] mt-1 ${getRoleColor(other.role)}`}
                      >
                        {other.role}
                      </Badge>
                    </div>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {selectedConversation && otherParticipant ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b px-4 pt-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">
                        {getInitials(otherParticipant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{otherParticipant.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${getRoleColor(otherParticipant.role)}`}
                        >
                          {otherParticipant.role}
                        </Badge>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" />
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversationMessages.length > 0 ? (
                  conversationMessages.map((msg) => {
                    const isFromMe = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${isFromMe ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <Avatar className="h-7 w-7 flex-shrink-0 mt-auto">
                          <AvatarFallback className="text-[10px] bg-muted">
                            {getInitials(msg.senderName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[70%]">
                          <div
                            className={`rounded-2xl px-3 py-2.5 text-sm ${
                              isFromMe
                                ? "bg-emerald-600 text-white rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                          <div
                            className={`flex items-center gap-1 mt-0.5 ${
                              isFromMe ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span
                              className={`text-[10px] ${
                                isFromMe ? "text-emerald-500" : "text-muted-foreground"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </span>
                            {isFromMe && (
                              <span className="text-emerald-500">
                                {msg.isRead ? (
                                  <CheckCheck className="w-3.5 h-3.5" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm">Start a conversation</p>
                    <p className="text-xs mt-1">Send a message to get started</p>
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="border-t px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    className="h-9 w-9 flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-1">Select a Conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the left to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
