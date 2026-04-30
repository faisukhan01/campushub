"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/store/app-store";
import {
  Pen,
  Eraser,
  Square,
  Circle,
  Type,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  FileDown,
  Link2,
  Send,
  Eye,
  EyeOff,
  Layers,
  Users,
  MessageSquare,
  PenTool,
  ChevronDown,
  Undo2,
  Redo2,
  ImageIcon,
} from "lucide-react";

// ---- Mock Data ----

const tools = [
  { id: "pen", label: "Pen", icon: Pen },
  { id: "eraser", label: "Eraser", icon: Eraser },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "text", label: "Text", icon: Type },
  { id: "line", label: "Line", icon: Minus },
] as const;

const colors = [
  { id: "red", label: "Red", value: "bg-red-500", hex: "#ef4444" },
  { id: "blue", label: "Blue", value: "bg-blue-500", hex: "#3b82f6" },
  { id: "green", label: "Green", value: "bg-emerald-500", hex: "#10b981" },
  { id: "amber", label: "Amber", value: "bg-amber-500", hex: "#f59e0b" },
  { id: "purple", label: "Purple", value: "bg-purple-500", hex: "#a855f7" },
  { id: "black", label: "Black", value: "bg-gray-900 dark:bg-gray-100", hex: "#111827" },
  { id: "white", label: "White", value: "bg-white border border-gray-300", hex: "#ffffff" },
  { id: "gray", label: "Gray", value: "bg-gray-400", hex: "#9ca3af" },
] as const;

const strokeWidths = [
  { id: "thin", label: "Thin", value: "2px" },
  { id: "medium", label: "Medium", value: "4px" },
  { id: "thick", label: "Thick", value: "8px" },
] as const;

const collaborators = [
  { id: "u1", name: "You", initials: "RP", color: "bg-emerald-500", online: true },
  { id: "u2", name: "Aisha Khan", initials: "AK", color: "bg-blue-500", online: true },
  { id: "u3", name: "James Miller", initials: "JM", color: "bg-amber-500", online: true },
  { id: "u4", name: "Sophia M.", initials: "SM", color: "bg-purple-500", online: false },
];

const chatMessages = [
  { id: "m1", user: "Aisha Khan", initials: "AK", color: "bg-blue-500", text: "I've added the flowchart on the left side.", time: "2:30 PM" },
  { id: "m2", user: "James Miller", initials: "JM", color: "bg-amber-500", text: "Looks great! Should we add more detail to the decision box?", time: "2:32 PM" },
  { id: "m3", user: "You", initials: "RP", color: "bg-emerald-500", text: "Yes, I'll work on that now.", time: "2:33 PM" },
];

const layers = [
  { id: "l1", name: "Background", visible: true, active: false },
  { id: "l2", name: "Drawing 1", visible: true, active: true },
  { id: "l3", name: "Text Layer", visible: true, active: false },
];

// ---- Helpers ----

// ---- Main Component ----

export function WhiteboardPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const [activeTool, setActiveTool] = useState<string>("pen");
  const [activeColor, setActiveColor] = useState<string>("emerald");
  const [activeStroke, setActiveStroke] = useState<string>("medium");
  const [zoom, setZoom] = useState(100);
  const [chatInput, setChatInput] = useState("");
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    l1: true,
    l2: true,
    l3: true,
  });

  const toggleLayer = (id: string) => {
    setLayerVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="page-transition space-y-0 h-[calc(100vh-10rem)] flex flex-col -m-4 sm:-m-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mr-1">
            <PenTool className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/* Drawing Tools */}
          <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5">
            {tools.map((tool) => (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      activeTool === tool.id
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Color Picker */}
          <div className="flex items-center gap-1">
            {colors.map((color) => (
              <button
                key={color.id}
                className={`w-5 h-5 rounded-full ${color.value} transition-transform hover:scale-110 ${
                  activeColor === color.id ? "ring-2 ring-offset-1 ring-emerald-500 dark:ring-offset-background scale-110" : ""
                }`}
                onClick={() => setActiveColor(color.id)}
                title={color.label}
              />
            ))}
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Stroke Width */}
          <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5">
            {strokeWidths.map((sw) => (
              <Button
                key={sw.id}
                variant="ghost"
                size="sm"
                className={`h-8 px-2 text-[10px] ${
                  activeStroke === sw.id
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveStroke(sw.id)}
              >
                <div className={`rounded-full bg-current ${sw.id === "thin" ? "w-4 h-[2px]" : sw.id === "medium" ? "w-4 h-[4px]" : "w-4 h-[8px]"}`} />
              </Button>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2 text-xs">
                <ImageIcon className="w-3.5 h-3.5" /> Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs">
                <FileDown className="w-3.5 h-3.5" /> Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-xs">
                <Link2 className="w-3.5 h-3.5" /> Share Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Area: Canvas + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 bg-muted/30 border-r relative flex items-center justify-center">
          <div className="text-center text-muted-foreground/50 p-8">
            <PenTool className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium opacity-40">Whiteboard Area</p>
            <p className="text-sm mt-1 opacity-30">Select a tool and start drawing</p>
          </div>

          {/* Floating zoom controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur rounded-lg border p-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs font-medium w-12 text-center tabular-nums">{zoom}%</span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Separator orientation="vertical" className="h-5 mx-0.5" />
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom(100)}>
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 lg:w-72 hidden sm:flex flex-col border-l bg-background">
          <ScrollArea className="flex-1">
            {/* Collaborators */}
            <div className="p-3 border-b">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Collaborators
              </h3>
              <div className="space-y-2">
                {collaborators.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className={`${user.color} text-white text-[10px] font-semibold`}>
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
                        user.online ? "bg-emerald-500" : "bg-gray-400"
                      }`} />
                    </div>
                    <span className="text-xs font-medium flex-1">{user.name}</span>
                    <div className={`w-2 h-2 rounded-full ${user.color}`} title="Cursor color" />
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="p-3 border-b">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </h3>
              <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                {chatMessages.map((msg) => (
                  <div key={msg.id}>
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className={`${msg.color} text-white text-[7px]`}>
                          {msg.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] font-semibold">{msg.user}</span>
                      <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-5 mt-0.5">{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Input
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="h-7 text-xs"
                />
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Layers */}
            <div className="p-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Layers
              </h3>
              <div className="space-y-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      layer.active
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <button
                      className="w-5 h-5 flex items-center justify-center"
                      onClick={() => toggleLayer(layer.id)}
                    >
                      {layerVisibility[layer.id] !== false ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground/40" />
                      )}
                    </button>
                    <span className={`text-xs font-medium flex-1 ${layer.active ? "text-emerald-700 dark:text-emerald-400" : ""}`}>
                      {layer.name}
                    </span>
                    {layer.active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-1.5 border-t bg-background text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Undo2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Redo2 className="w-3.5 h-3.5" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-0.5" />
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-red-500 hover:text-red-600">
            <Trash2 className="w-3 h-3" /> Clear All
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span>Page 1 of 3</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="font-medium tabular-nums">{zoom}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {collaborators.filter((c) => c.online).length} online
          </span>
        </div>
      </div>
    </div>
  );
}
