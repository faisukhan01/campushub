"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Lightbulb,
  Brain,
  FileText,
  MessageSquare,
} from "lucide-react";

// ---- Types ----

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ---- Mock AI Responses ----

const mockResponses: Record<string, string> = {
  summarize: `## 📝 Topic Summary

Here's a comprehensive summary of the topic:

**Key Points:**
• The core concept revolves around fundamental principles and their interconnections
• Understanding cause-and-effect relationships is essential for mastery
• Practical applications span multiple domains including engineering, science, and technology

**Important Takeaways:**
1. Master the foundational definitions first before advancing
2. Focus on understanding the "why" behind each principle
3. Practice with real-world examples to solidify knowledge

**Study Tips:**
- Create mind maps linking related concepts together
- Review material in 30-minute focused sessions (Pomodoro technique)
- Teach the concept to a peer to reinforce your own understanding`,

  flashcards: `## 🃏 Generated Flashcards

**Card 1:**
- **Q:** What is the fundamental theorem of calculus?
- **A:** It links differentiation and integration, showing they are inverse operations.

**Card 2:**
- **Q:** Explain polymorphism in OOP
- **A:** Polymorphism allows objects of different classes to be treated as objects of a common superclass.

**Card 3:**
- **Q:** State Ohm's Law
- **A:** V = IR — Voltage equals current multiplied by resistance.

**Card 4:**
- **Q:** What is photosynthesis?
- **A:** The process by which plants convert light energy, water, and CO₂ into glucose and oxygen.

**Card 5:**
- **Q:** Define entropy
- **A:** A measure of disorder or randomness in a thermodynamic system.

💡 *Tip: Review these daily using spaced repetition for best retention.*`,

  explain: `## 💡 Concept Explanation

Let me break this down step by step:

**Definition:**
This concept is a foundational principle that underpins more advanced topics in the field. It describes how entities interact and transform under specific conditions.

**How It Works:**
1. **Input Phase** — Identify and gather the necessary variables or data
2. **Transformation** — Apply the core algorithm or formula
3. **Output** — Analyze and interpret the results

**Real-world Analogy:**
Think of it like a post office sorting system — just as mail is organized by zip codes to reach the right destination, this concept systematically categorizes and processes information.

**Common Misconceptions:**
❌ "It only works in theory"
✅ It has proven applications in engineering, medicine, and finance

❌ "You need advanced math to understand it"
✅ The basics can be grasped with simple arithmetic and logic`,

  quiz: `## 📋 Generated Quiz

**Q1.** Which of the following best describes an "algorithm"?
a) A programming language
b) A step-by-step problem-solving procedure ✅
c) A type of computer hardware
d) A data storage format

---

**Q2.** What is the time complexity of binary search?
a) O(n)
b) O(n²)
c) O(log n) ✅
d) O(1)

---

**Q3.** True or False: A stack follows the FIFO principle.
❌ **False** — A stack follows LIFO (Last In, First Out)

---

**Q4.** Which data structure uses FIFO?
a) Stack
b) Queue ✅
c) Tree
d) Graph

---

**Score:** 4/4 Excellent! | 3/4 Good! | 2/4 Review needed`,

  "study plan": `## 📅 Personalized Study Plan

### Week 1: Foundation Building
- **Monday:** Review Chapters 1-2 notes (2 hrs)
- **Tuesday:** Practice problems Set A (1.5 hrs)
- **Wednesday:** Watch video lectures 1-3 (1 hr)
- **Thursday:** Study group discussion (1 hr)
- **Friday:** Self-assessment quiz (30 min)

### Week 2: Deep Dive
- **Monday:** Review Chapters 3-4 (2 hrs)
- **Tuesday:** Practice problems Set B (1.5 hrs)
- **Wednesday:** Work on assignment (2 hrs)
- **Thursday:** Focus on weak areas (1 hr)
- **Friday:** Full mock test (1.5 hrs)

### Week 3: Revision & Polish
- **Monday:** Comprehensive review (2 hrs)
- **Tuesday:** Past paper practice (2 hrs)
- **Wednesday:** Focus on difficult topics (1.5 hrs)
- **Thursday:** Final mock exam (1.5 hrs)
- **Friday:** Light review and rest

**Daily Tips:**
⏰ Use 25-min focused blocks (Pomodoro)
🧘 Take 5-min breaks between sessions
📝 Review notes before bed for better retention
🎯 Set a specific goal for each study session`,
};

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("summarize")) return mockResponses.summarize;
  if (lower.includes("flashcard")) return mockResponses.flashcards;
  if (lower.includes("explain") || lower.includes("concept")) return mockResponses.explain;
  if (lower.includes("quiz")) return mockResponses.quiz;
  if (lower.includes("study plan") || lower.includes("plan")) return mockResponses["study plan"];
  return `Great question! I'd recommend starting with the foundational concepts and building up from there.

**Here's how I can help:**
1. **Summarize Topic** — Get a concise overview of any subject
2. **Generate Flashcards** — Create study cards for quick revision
3. **Explain Concept** — Break down complex ideas simply
4. **Create Quiz** — Test your knowledge with practice questions
5. **Study Plan** — Build a personalized study schedule

Try clicking one of the quick actions below, or ask me a specific question about your coursework!`;
}

// ---- Quick Actions ----

const quickActions = [
  { icon: FileText, label: "Summarize Topic", prompt: "Summarize this topic for me" },
  { icon: Brain, label: "Generate Flashcards", prompt: "Generate flashcards for revision" },
  { icon: Lightbulb, label: "Explain Concept", prompt: "Explain this concept in detail" },
  { icon: BookOpen, label: "Create Quiz", prompt: "Create a quiz to test my knowledge" },
  { icon: Sparkles, label: "Study Plan", prompt: "Create a study plan for my exams" },
];

// ---- Suggested Prompts ----

const suggestedPrompts = [
  "Summarize Data Structures & Algorithms",
  "Generate flashcards for Machine Learning",
  "Explain the concept of recursion",
  "Create a quiz for Operating Systems",
  "Build a study plan for midterms",
  "Help me understand neural networks",
];

// ---- Typing Indicator ----

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted dark:bg-muted/80 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ---- Message Bubble ----

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 items-end ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
        <AvatarFallback
          className={`rounded-lg text-white ${
            isUser
              ? "bg-emerald-500"
              : "bg-gradient-to-br from-emerald-500 to-teal-500"
          }`}
        >
          {isUser ? (
            <MessageSquare className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className={`max-w-[75%] space-y-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            isUser
              ? "bg-emerald-500 text-white rounded-br-md"
              : "bg-muted dark:bg-muted/80 rounded-bl-md"
          }`}
        >
          <div
            className="whitespace-pre-wrap [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_hr]:border-border [&_hr]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-3 [&_blockquote]:italic"
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/## (.*)/g, '<h2 class="text-base font-bold mb-2">$1</h2>')
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/- (.*)/g, "<li class='ml-4'>$1</li>")
                .replace(/^\d+\. (.*)/gm, "<li class='ml-4 list-decimal'>$1</li>")
                .replace(/---/g, '<hr class="border-border my-3">')
                .replace(
                  /❌/g,
                  '<span class="text-red-500">❌</span>'
                )
                .replace(
                  /✅/g,
                  '<span class="text-emerald-500">✅</span>'
                ),
            }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

// ---- Main Component ----

export function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages or typing state change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // AI responds after 1.5s delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: getMockResponse(text.trim()),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestion = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            AI Study Assistant
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your personal AI-powered study companion
          </p>
        </div>
        <Badge variant="outline" className="gap-1 w-fit">
          <Bot className="w-3 h-3 text-emerald-500" />
          CampusAI v2.0
        </Badge>
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              onClick={() => sendMessage(action.prompt)}
              disabled={isTyping}
            >
              <Icon className="w-3.5 h-3.5 text-emerald-500" />
              {action.label}
            </Button>
          );
        })}
      </div>

      {/* Chat Card */}
      <Card className="flex flex-col h-[550px] sm:h-[650px]">
        <CardContent className="flex-1 flex flex-col min-h-0 p-0">
          {/* Messages Area with ScrollArea */}
          {messages.length === 0 && !isTyping ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Hi there! 👋</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                I&apos;m your AI Study Assistant. I can help you summarize topics, create
                flashcards, explain concepts, generate quizzes, and build study plans.
              </p>
              <div className="w-full max-w-lg space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Try asking:
                </p>
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    className="w-full justify-start text-sm h-auto py-2.5 px-4 text-left"
                    onClick={() => handleSuggestion(prompt)}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 mr-2 flex-shrink-0" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollRef}>
              <div className="space-y-4 pr-2">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            </ScrollArea>
          )}

          {/* Input Area */}
          <div className="border-t p-3 sm:p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your studies..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground mt-2 px-1">
              AI responses are for study purposes. Press Enter to send.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
