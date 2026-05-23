"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    toast.success("Support ticket submitted. We'll get back to you soon.");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6 page-transition">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">Contact the platform support team</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-emerald-600" />
              Submit a Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Briefly describe your issue" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail…" rows={5} />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Quick Links</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              "How to add a new branch?",
              "How to reset a user password?",
              "How to add courses and assign teachers?",
              "How to create student accounts?",
              "How to view attendance reports?",
            ].map((q) => (
              <div key={q} className="flex items-start gap-2 text-sm p-3 rounded-lg border hover:bg-muted/40 cursor-pointer transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                {q}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
