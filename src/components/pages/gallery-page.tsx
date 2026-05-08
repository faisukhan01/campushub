"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/app-store";
import {
  Image as ImageIcon,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Eye,
  Calendar,
  MapPin,
  Users,
  FolderOpen,
  Plus,
  Tag,
  ChevronLeft,
  X,
} from "lucide-react";

// ---- Types ----

type PhotoCategory = "Cultural" | "Sports" | "Academic" | "Technical" | "Festival";

interface Photo {
  id: string;
  title: string;
  category: PhotoCategory;
  date: string;
  album: string;
  likes: number;
  comments: number;
  description: string;
  gradient: string;
}

interface Album {
  id: string;
  title: string;
  photoCount: number;
  dateRange: string;
  creator: string;
  coverGradient: string;
}

interface CampusEvent {
  id: string;
  title: string;
  type: PhotoCategory;
  date: string;
  location: string;
  organizer: string;
  description: string;
  isPast: boolean;
  attendees: number;
}

// ---- Mock Data ----

const CATEGORIES: PhotoCategory[] = ["Cultural", "Sports", "Academic", "Technical", "Festival"];

const GRADIENTS = [
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-purple-400 to-violet-500",
  "from-teal-400 to-cyan-500",
  "from-orange-400 to-red-500",
  "from-lime-400 to-green-500",
];

const mockPhotos: Photo[] = [
  { id: "p1", title: "Annual Cultural Night", category: "Cultural", date: "2025-01-15", album: "Cultural Fest 2025", likes: 234, comments: 18, description: "Students performing traditional dance at the annual cultural night celebration.", gradient: GRADIENTS[0] },
  { id: "p2", title: "Inter-College Basketball Final", category: "Sports", date: "2025-01-12", album: "Sports Meet 2025", likes: 189, comments: 12, description: "The final match between Greenfield and Riverside colleges.", gradient: GRADIENTS[1] },
  { id: "p3", title: "Research Paper Presentation", category: "Academic", date: "2025-01-10", album: "Tech Conference", likes: 156, comments: 8, description: "Dr. Sarah Chen presenting the latest AI research findings.", gradient: GRADIENTS[2] },
  { id: "p4", title: "Hackathon Winners", category: "Technical", date: "2025-01-08", album: "Hackathon 2025", likes: 312, comments: 24, description: "Team CodeBreakers winning the 48-hour hackathon challenge.", gradient: GRADIENTS[3] },
  { id: "p5", title: "Diwali Celebrations", category: "Festival", date: "2024-11-01", album: "Diwali 2024", likes: 445, comments: 32, description: "Campus decorated with lights and rangoli for Diwali celebrations.", gradient: GRADIENTS[4] },
  { id: "p6", title: "Science Exhibition", category: "Academic", date: "2025-01-05", album: "Science Expo", likes: 178, comments: 15, description: "Students showcasing innovative science projects at the annual exhibition.", gradient: GRADIENTS[5] },
  { id: "p7", title: "Cricket Tournament", category: "Sports", date: "2024-12-20", album: "Sports Meet 2025", likes: 267, comments: 19, description: "Action shots from the inter-department cricket tournament.", gradient: GRADIENTS[6] },
  { id: "p8", title: "Music Concert", category: "Cultural", date: "2024-12-15", album: "Cultural Fest 2025", likes: 398, comments: 28, description: "The college band performing at the winter music concert.", gradient: GRADIENTS[7] },
  { id: "p9", title: "Robotics Workshop", category: "Technical", date: "2025-01-03", album: "Tech Workshop", likes: 145, comments: 10, description: "Hands-on robotics workshop conducted by industry experts.", gradient: GRADIENTS[0] },
  { id: "p10", title: "Holi Festival", category: "Festival", date: "2024-03-25", album: "Holi 2024", likes: 523, comments: 41, description: "Colorful Holi celebrations on campus with students and faculty.", gradient: GRADIENTS[1] },
  { id: "p11", title: "Art Exhibition", category: "Cultural", date: "2025-01-11", album: "Art Gallery", likes: 198, comments: 14, description: "Student artwork displayed at the annual art exhibition.", gradient: GRADIENTS[2] },
  { id: "p12", title: "Track and Field Events", category: "Sports", date: "2024-12-18", album: "Sports Meet 2025", likes: 211, comments: 16, description: "Athletes competing in the 100m sprint at the sports meet.", gradient: GRADIENTS[3] },
  { id: "p13", title: "AI Lab Inauguration", category: "Academic", date: "2024-12-10", album: "Campus Development", likes: 167, comments: 11, description: "Inauguration of the new AI and Machine Learning research lab.", gradient: GRADIENTS[4] },
  { id: "p14", title: "Coding Competition", category: "Technical", date: "2025-01-07", album: "Hackathon 2025", likes: 234, comments: 20, description: "Participants solving algorithmic challenges during the coding competition.", gradient: GRADIENTS[5] },
  { id: "p15", title: "Christmas Celebrations", category: "Festival", date: "2024-12-25", album: "Christmas 2024", likes: 378, comments: 29, description: "Christmas tree lighting and carol singing at the campus amphitheater.", gradient: GRADIENTS[6] },
  { id: "p16", title: "Drama Performance", category: "Cultural", date: "2025-01-14", album: "Cultural Fest 2025", likes: 289, comments: 22, description: "Theatre club performing Shakespeare&apos;s &quot;A Midsummer Night&apos;s Dream&quot;.", gradient: GRADIENTS[7] },
];

const mockAlbums: Album[] = [
  { id: "a1", title: "Cultural Fest 2025", photoCount: 156, dateRange: "Jan 10-15, 2025", creator: "Media Club", coverGradient: GRADIENTS[0] },
  { id: "a2", title: "Sports Meet 2025", photoCount: 234, dateRange: "Dec 15-22, 2024", creator: "Sports Dept", coverGradient: GRADIENTS[1] },
  { id: "a3", title: "Tech Conference", photoCount: 89, dateRange: "Jan 8-10, 2025", creator: "CS Department", coverGradient: GRADIENTS[2] },
  { id: "a4", title: "Hackathon 2025", photoCount: 112, dateRange: "Jan 5-7, 2025", creator: "ACM Chapter", coverGradient: GRADIENTS[3] },
  { id: "a5", title: "Diwali 2024", photoCount: 78, dateRange: "Oct 30 - Nov 2, 2024", creator: "Cultural Committee", coverGradient: GRADIENTS[4] },
  { id: "a6", title: "Science Expo", photoCount: 67, dateRange: "Jan 3-5, 2025", creator: "Science Club", coverGradient: GRADIENTS[5] },
  { id: "a7", title: "Art Gallery", photoCount: 45, dateRange: "Jan 9-12, 2025", creator: "Art Club", coverGradient: GRADIENTS[6] },
  { id: "a8", title: "Campus Development", photoCount: 34, dateRange: "Nov 2024 - Jan 2025", creator: "Admin", coverGradient: GRADIENTS[7] },
];

const mockEvents: CampusEvent[] = [
  { id: "ev1", title: "Spring Cultural Festival", type: "Cultural", date: "2025-02-15", location: "Main Auditorium", organizer: "Cultural Committee", description: "Three-day cultural extravaganza with music, dance, and drama performances.", isPast: false, attendees: 450 },
  { id: "ev2", title: "Inter-College Tech Quiz", type: "Technical", date: "2025-02-20", location: "Seminar Hall A", organizer: "ACM Chapter", description: "Annual technical quiz competition with participants from 12 colleges.", isPast: false, attendees: 180 },
  { id: "ev3", title: "Annual Sports Day", type: "Sports", date: "2025-03-01", location: "Sports Complex", organizer: "Sports Department", description: "Full-day sports event with track and field, team games, and prize ceremony.", isPast: false, attendees: 600 },
  { id: "ev4", title: "Research Symposium", type: "Academic", date: "2025-03-10", location: "Conference Center", organizer: "Research Cell", description: "Two-day symposium featuring guest lectures and paper presentations.", isPast: false, attendees: 200 },
  { id: "ev5", title: "Holi Colors Festival", type: "Festival", date: "2025-03-14", location: "Campus Grounds", organizer: "Student Council", description: "Celebrate Holi with colors, music, and traditional sweets.", isPast: false, attendees: 800 },
  { id: "ev6", title: "New Year Gala 2025", type: "Cultural", date: "2025-01-01", location: "Open Air Theater", organizer: "Student Council", description: "New Year celebration with live music and fireworks.", isPast: true, attendees: 700 },
];

// ---- Helpers ----

function getCategoryColor(cat: PhotoCategory): string {
  switch (cat) {
    case "Cultural": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0";
    case "Sports": return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0";
    case "Academic": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0";
    case "Technical": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0";
    case "Festival": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-0";
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---- Main Component ----

export function GalleryPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const [activeTab, setActiveTab] = useState("gallery");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState("");

  const filteredPhotos = selectedCategory === "all" ? mockPhotos : mockPhotos.filter((p) => p.category === selectedCategory);

  const toggleLike = (photoId: string) => {
    setLikedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  const totalPhotos = mockPhotos.length;
  const totalEvents = mockEvents.length;
  const totalAlbums = mockAlbums.length;
  const thisMonthPhotos = mockPhotos.filter((p) => {
    const d = new Date(p.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Event Gallery</h1>
            <p className="text-sm text-muted-foreground">Browse campus photos, albums, and upcoming events</p>
          </div>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-fit">
              <Plus className="w-4 h-4" /> Upload Photo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Camera className="w-5 h-5 text-emerald-500" />Upload Photo</DialogTitle>
              <DialogDescription>Share your campus moments with the community</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click or drag a photo here to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input placeholder="Enter photo title..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Album</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select album" /></SelectTrigger>
                  <SelectContent>
                    {mockAlbums.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea placeholder="Describe this photo..." rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tags</label>
                <Input placeholder="Add tags separated by commas..." />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setUploadOpen(false)}>Upload</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: totalEvents, icon: Calendar, color: "bg-emerald-500" },
          { label: "Total Photos", value: totalPhotos, icon: Camera, color: "bg-teal-500" },
          { label: "Albums", value: totalAlbums, icon: FolderOpen, color: "bg-amber-500" },
          { label: "This Month", value: thisMonthPhotos, icon: ImageIcon, color: "bg-sky-500" },
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* Gallery Grid Tab */}
        <TabsContent value="gallery" className="mt-4 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={selectedCategory === "all" ? "default" : "outline"} className="cursor-pointer text-xs" onClick={() => setSelectedCategory("all")}>All</Badge>
            {CATEGORIES.map((cat) => (
              <Badge key={cat} variant={selectedCategory === cat ? "default" : "outline"} className={`cursor-pointer text-xs ${selectedCategory === cat ? "" : ""}`} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </Badge>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredPhotos.map((photo, idx) => {
              const isLiked = likedPhotos.has(photo.id);
              const heightClass = idx % 3 === 0 ? "h-56" : idx % 3 === 1 ? "h-44" : "h-48";
              return (
                <div key={photo.id} className="group">
                  <div className={`relative rounded-xl overflow-hidden ${heightClass} cursor-pointer`} onClick={() => setSelectedPhoto(photo)}>
                    <div className={`w-full h-full bg-gradient-to-br ${photo.gradient} flex items-center justify-center`}>
                      <Camera className="w-10 h-10 text-white/40" />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white" onClick={(e) => { e.stopPropagation(); setSelectedPhoto(photo); }}>
                          <Eye className="w-4 h-4 text-gray-800" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white" onClick={(e) => { e.stopPropagation(); }}>
                          <Share2 className="w-4 h-4 text-gray-800" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white" onClick={(e) => { e.stopPropagation(); }}>
                          <Download className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>
                    </div>
                    {/* Info Overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-white/80 text-[10px]">
                        <span className="flex items-center gap-1"><Heart className={`w-3 h-3 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />{photo.likes + (isLiked ? 1 : 0)}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{photo.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Photo Detail Dialog */}
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-2xl">
              {selectedPhoto && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-emerald-500" />
                      {selectedPhoto.title}
                    </DialogTitle>
                    <DialogDescription>
                      <Badge className={`text-[10px] ${getCategoryColor(selectedPhoto.category)}`}>{selectedPhoto.category}</Badge>
                      <span className="text-xs text-muted-foreground ml-2">{formatDate(selectedPhoto.date)}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`rounded-xl bg-gradient-to-br ${selectedPhoto.gradient} h-64 flex items-center justify-center`}>
                      <Camera className="w-16 h-16 text-white/30" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-1">Description</h3>
                        <p className="text-xs text-muted-foreground">{selectedPhoto.description}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <button className={`flex items-center gap-1 ${likedPhotos.has(selectedPhoto.id) ? "text-red-500" : "text-muted-foreground"}`} onClick={() => toggleLike(selectedPhoto.id)}>
                          <Heart className={`w-4 h-4 ${likedPhotos.has(selectedPhoto.id) ? "fill-red-500" : ""}`} />
                          <span className="text-xs">{selectedPhoto.likes + (likedPhotos.has(selectedPhoto.id) ? 1 : 0)}</span>
                        </button>
                        <span className="flex items-center gap-1 text-muted-foreground"><MessageCircle className="w-4 h-4" /><span className="text-xs">{selectedPhoto.comments}</span></span>
                        <span className="text-xs text-muted-foreground">Album: {selectedPhoto.album}</span>
                      </div>
                      <div className="section-divider" />
                      <div>
                        <h4 className="text-xs font-semibold mb-2">Comments</h4>
                        <ScrollArea className="h-32">
                          <div className="space-y-2">
                            {["Great shot! 📸", "Amazing event!", "Love this photo ❤️", "Brings back memories!"].map((c, i) => (
                              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                                <div className="w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <div>
                                  <p className="text-xs font-medium">User {i + 1}</p>
                                  <p className="text-[11px] text-muted-foreground">{c}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="flex items-center gap-2 mt-2">
                          <Input placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="text-xs h-8" />
                          <Button size="sm" className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3">Post</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="albums" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockAlbums.map((album) => (
              <Card key={album.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedAlbum(album)}>
                <CardContent className="p-0 overflow-hidden">
                  <div className={`h-40 bg-gradient-to-br ${album.coverGradient} flex items-center justify-center relative`}>
                    <FolderOpen className="w-12 h-12 text-white/30" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-800 border-0 text-[10px]">{album.photoCount} photos</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{album.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{album.dateRange}</p>
                    <p className="text-xs text-muted-foreground">by {album.creator}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Album Detail Dialog */}
          <Dialog open={!!selectedAlbum} onOpenChange={() => setSelectedAlbum(null)}>
            <DialogContent className="max-w-3xl">
              {selectedAlbum && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-emerald-500" />
                      {selectedAlbum.title}
                    </DialogTitle>
                    <DialogDescription>{selectedAlbum.dateRange} · {selectedAlbum.photoCount} photos · by {selectedAlbum.creator}</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Array.from({ length: Math.min(selectedAlbum.photoCount, 12) }).map((_, i) => (
                      <div key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                        <Camera className="w-6 h-6 text-white/30" />
                      </div>
                    ))}
                    {selectedAlbum.photoCount > 12 && (
                      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{selectedAlbum.photoCount - 12} more</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">Upcoming ({mockEvents.filter((e) => !e.isPast).length})</Badge>
            <Badge variant="outline" className="text-xs">Past ({mockEvents.filter((e) => e.isPast).length})</Badge>
          </div>

          {mockEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${GRADIENTS[mockEvents.indexOf(event) % GRADIENTS.length]} flex flex-col items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-lg font-bold leading-none">{new Date(event.date + "T00:00:00").getDate()}</span>
                    <span className="text-white/80 text-[10px]">{new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                      </div>
                      <Badge className={`text-[10px] flex-shrink-0 ${getCategoryColor(event.type)}`}>{event.type}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(event.date)}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.attendees} attending</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {!event.isPast ? (
                        <Button size="sm" className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white">RSVP</Button>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Eye className="w-3 h-3" />View Gallery</Button>
                      )}
                      <span className="text-[10px] text-muted-foreground">by {event.organizer}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
