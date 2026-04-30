"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useAppStore } from "@/store/app-store";
import {
  Building2,
  BedDouble,
  Users,
  Wrench,
  DoorOpen,
  Wifi,
  WashingMachine,
  UtensilsCrossed,
  Dumbbell,
  ShowerHead,
  BookOpen,
  Tv,
  Car,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Bed,
} from "lucide-react";

// ---- Types ----

type RoomStatus = "Vacant" | "Partial" | "Full" | "Maintenance";

interface Occupant {
  name: string;
  bed: string;
  department: string;
  checkInDate: string;
}

interface HostelRoom {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupants: Occupant[];
  status: RoomStatus;
  roomType: string;
  rent: number;
  facilities: string[];
}

interface RoomRequest {
  id: string;
  studentName: string;
  type: "Room Change" | "Maintenance";
  currentRoom: string;
  description: string;
  status: "Pending" | "Approved" | "In Progress" | "Resolved";
  date: string;
}

interface HostelFacility {
  name: string;
  icon: React.ElementType;
  available: boolean;
  description: string;
}

// ---- Mock Data ----

const mockRooms: HostelRoom[] = [
  {
    id: "rm1", roomNumber: "101", floor: 1, capacity: 4,
    occupants: [
      { name: "Ryan Patel", bed: "A", department: "Computer Science", checkInDate: "2024-08-15" },
      { name: "Alex Kumar", bed: "B", department: "Computer Science", checkInDate: "2024-08-15" },
      { name: "Jordan Lee", bed: "C", department: "Electrical Engg", checkInDate: "2024-08-16" },
    ],
    status: "Partial", roomType: "4-Bed Shared", rent: 2000,
    facilities: ["WiFi", "AC", "Attached Bathroom"],
  },
  {
    id: "rm2", roomNumber: "102", floor: 1, capacity: 4,
    occupants: [
      { name: "Emily Chen", bed: "A", department: "Mechanical Engg", checkInDate: "2024-08-15" },
      { name: "Sarah Williams", bed: "B", department: "Civil Engg", checkInDate: "2024-08-15" },
      { name: "Priya Sharma", bed: "C", department: "Computer Science", checkInDate: "2024-08-16" },
      { name: "Meera Patel", bed: "D", department: "Electronics", checkInDate: "2024-08-16" },
    ],
    status: "Full", roomType: "4-Bed Shared", rent: 2000,
    facilities: ["WiFi", "AC", "Attached Bathroom"],
  },
  {
    id: "rm3", roomNumber: "103", floor: 1, capacity: 2,
    occupants: [],
    status: "Vacant", roomType: "2-Bed Shared", rent: 3000,
    facilities: ["WiFi", "AC", "Attached Bathroom", "Balcony"],
  },
  {
    id: "rm4", roomNumber: "201", floor: 2, capacity: 2,
    occupants: [
      { name: "David Kim", bed: "A", department: "Computer Science", checkInDate: "2024-08-15" },
    ],
    status: "Partial", roomType: "2-Bed Shared", rent: 3000,
    facilities: ["WiFi", "AC", "Attached Bathroom"],
  },
  {
    id: "rm5", roomNumber: "202", floor: 2, capacity: 4,
    occupants: [],
    status: "Maintenance", roomType: "4-Bed Shared", rent: 2000,
    facilities: ["WiFi", "AC", "Attached Bathroom"],
  },
  {
    id: "rm6", roomNumber: "203", floor: 2, capacity: 2,
    occupants: [
      { name: "Lisa Wang", bed: "A", department: "Data Science", checkInDate: "2024-08-15" },
      { name: "Tom Harris", bed: "B", department: "Physics", checkInDate: "2024-08-15" },
    ],
    status: "Full", roomType: "2-Bed Shared", rent: 3000,
    facilities: ["WiFi", "AC", "Attached Bathroom", "Study Table"],
  },
  {
    id: "rm7", roomNumber: "301", floor: 3, capacity: 1,
    occupants: [],
    status: "Vacant", roomType: "Single Room", rent: 5000,
    facilities: ["WiFi", "AC", "Attached Bathroom", "Balcony", "Mini Fridge"],
  },
  {
    id: "rm8", roomNumber: "302", floor: 3, capacity: 1,
    occupants: [
      { name: "Chris Johnson", bed: "A", department: "MBA", checkInDate: "2024-08-15" },
    ],
    status: "Full", roomType: "Single Room", rent: 5000,
    facilities: ["WiFi", "AC", "Attached Bathroom", "Balcony", "Mini Fridge"],
  },
];

const mockRequests: RoomRequest[] = [
  { id: "req1", studentName: "Alex Kumar", type: "Room Change", currentRoom: "101", description: "Request to change to a 2-bed room due to study requirements.", status: "Pending", date: "2025-01-15" },
  { id: "req2", studentName: "Ryan Patel", type: "Maintenance", currentRoom: "101", description: "Air conditioning unit not cooling properly.", status: "In Progress", date: "2025-01-12" },
  { id: "req3", studentName: "Emily Chen", type: "Maintenance", currentRoom: "102", description: "Leaking faucet in bathroom.", status: "Resolved", date: "2025-01-08" },
  { id: "req4", studentName: "David Kim", type: "Room Change", currentRoom: "201", description: "Would like to move to a single room on 3rd floor.", status: "Approved", date: "2025-01-10" },
  { id: "req5", studentName: "Priya Sharma", type: "Maintenance", currentRoom: "102", description: "WiFi connection very weak in room.", status: "Pending", date: "2025-01-16" },
  { id: "req6", studentName: "Jordan Lee", type: "Maintenance", currentRoom: "101", description: "Window latch is broken.", status: "Pending", date: "2025-01-17" },
];

const mockFacilities: HostelFacility[] = [
  { name: "WiFi", icon: Wifi, available: true, description: "High-speed internet across all floors" },
  { name: "Laundry", icon: WashingMachine, available: true, description: "Coin-operated washing machines" },
  { name: "Cafeteria", icon: UtensilsCrossed, available: true, description: "Breakfast, lunch, and dinner service" },
  { name: "Gym", icon: Dumbbell, available: true, description: "24/7 fitness center with equipment" },
  { name: "Hot Water", icon: ShowerHead, available: true, description: "24/7 hot water supply" },
  { name: "Study Hall", icon: BookOpen, available: true, description: "Quiet study area with AC" },
  { name: "Common Room TV", icon: Tv, available: true, description: "Recreation area with TV and games" },
  { name: "Parking", icon: Car, available: false, description: "Limited parking for residents" },
];

// ---- Helpers ----

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getStatusBadge(status: RoomStatus) {
  switch (status) {
    case "Vacant":
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">Vacant</Badge>;
    case "Partial":
      return <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0 text-[10px]">Partial</Badge>;
    case "Full":
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px]">Full</Badge>;
    case "Maintenance":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 text-[10px]">Maintenance</Badge>;
  }
}

function getRequestStatusBadge(status: string) {
  switch (status) {
    case "Approved":
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">Approved</Badge>;
    case "In Progress":
      return <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-0 text-[10px]">In Progress</Badge>;
    case "Resolved":
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">Resolved</Badge>;
    case "Pending":
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-[10px]">Pending</Badge>;
    default:
      return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
  }
}

// ---- Main Component ----

export function HostelPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoom, setSelectedRoom] = useState<HostelRoom | null>(null);
  const [showRoomDetail, setShowRoomDetail] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState<"Room Change" | "Maintenance">("Maintenance");
  const [filterFloor, setFilterFloor] = useState("all");

  const isAdmin = currentRole === "SuperAdmin" || currentRole === "InstituteAdmin" || currentRole === "BranchAdmin";

  const totalRooms = mockRooms.length;
  const occupiedRooms = mockRooms.filter((r) => r.status === "Full" || r.status === "Partial").length;
  const vacantRooms = mockRooms.filter((r) => r.status === "Vacant").length;
  const maintenanceRequests = mockRequests.filter((r) => r.type === "Maintenance" && r.status !== "Resolved").length;

  const filteredRooms = useMemo(() => {
    if (filterFloor === "all") return mockRooms;
    return mockRooms.filter((r) => r.floor === Number(filterFloor));
  }, [filterFloor]);

  const openRoomDetail = (room: HostelRoom) => {
    setSelectedRoom(room);
    setShowRoomDetail(true);
  };

  // ---- Student View ----
  if (currentRole === "Student" || currentRole === "Parent") {
    const myRoom = mockRooms[0]; // Room 101

    return (
      <div className="page-transition space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Hostel Room</h1>
            <p className="text-muted-foreground text-sm">Block A &middot; Greenfield Main Campus</p>
          </div>
          <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-fit" onClick={() => { setRequestType("Maintenance"); setShowRequestDialog(true); }}>
            <Plus className="w-4 h-4" /> Submit Request
          </Button>
        </div>

        {/* My Room Card */}
        <Card className="card-premium">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">Room {myRoom.roomNumber}</h2>
                  {getStatusBadge(myRoom.status)}
                </div>
                <p className="text-sm text-muted-foreground">{myRoom.roomType} &middot; Floor {myRoom.floor} &middot; ${myRoom.rent}/month</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            {/* Occupants */}
            <p className="text-xs font-medium text-muted-foreground mb-2">Roommates ({myRoom.occupants.length}/{myRoom.capacity})</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {Array.from({ length: myRoom.capacity }).map((_, i) => {
                const occupant = myRoom.occupants[i];
                const isYou = occupant?.name === "Ryan Patel";
                return (
                  <div key={i} className={`p-3 rounded-xl border text-center ${isYou ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20" : occupant ? "border-border" : "border-dashed border-muted-foreground/20"}`}>
                    {occupant ? (
                      <>
                        <Avatar className="h-10 w-10 mx-auto mb-2">
                          <AvatarFallback className={`text-xs font-semibold ${isYou ? "bg-emerald-500 text-white" : "bg-muted"}`}>
                            {getInitials(occupant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-semibold truncate">{occupant.name}</p>
                        <p className="text-[10px] text-muted-foreground">Bed {occupant.bed}</p>
                        {isYou && <Badge className="mt-1 text-[8px] bg-emerald-500 text-white border-0">You</Badge>}
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-muted/50 flex items-center justify-center">
                          <Bed className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-xs text-muted-foreground">Empty</p>
                        <p className="text-[10px] text-muted-foreground">Bed {String.fromCharCode(65 + i)}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Facilities */}
            <div className="flex flex-wrap gap-2">
              {myRoom.facilities.map((f) => (
                <Badge key={f} variant="outline" className="text-[10px] gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> {f}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Facilities Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Hostel Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mockFacilities.map((facility) => {
                const Icon = facility.icon;
                return (
                  <div key={facility.name} className="flex items-center gap-3 p-3 rounded-xl border">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      facility.available ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      <Icon className={`w-4 h-4 ${facility.available ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{facility.name}</p>
                      <p className={`text-[10px] ${facility.available ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {facility.available ? "Available" : "Unavailable"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* My Requests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRequests.filter((r) => ["Ryan Patel", "Alex Kumar", "Jordan Lee"].includes(r.studentName)).map((req) => (
                <div key={req.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    req.type === "Room Change" ? "bg-sky-100 dark:bg-sky-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                  }`}>
                    {req.type === "Room Change" ? <DoorOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" /> : <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{req.type}</p>
                      {getRequestStatusBadge(req.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Room {req.currentRoom} &middot; {req.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Request Dialog */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Request Type</Label>
                <Select value={requestType} onValueChange={(v) => setRequestType(v as "Room Change" | "Maintenance")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance Request</SelectItem>
                    <SelectItem value="Room Change">Room Change Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your request in detail..." rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Cancel</Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setShowRequestDialog(false)}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ---- Admin View ----
  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hostel Management</h1>
          <p className="text-muted-foreground text-sm">Room allocation, maintenance, and facilities</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Select value={filterFloor} onValueChange={setFilterFloor}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="All Floors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Rooms", value: totalRooms, icon: DoorOpen, color: "bg-emerald-500" },
          { label: "Occupied", value: occupiedRooms, icon: Users, color: "bg-teal-500" },
          { label: "Vacant", value: vacantRooms, icon: BedDouble, color: "bg-amber-500" },
          { label: "Maint. Requests", value: maintenanceRequests, icon: Wrench, color: "bg-red-500" },
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
          <TabsTrigger value="overview">Room Overview</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        {/* Room Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredRooms.map((room) => {
              const occupancyPct = Math.round((room.occupants.length / room.capacity) * 100);
              return (
                <Card
                  key={room.id}
                  className={`card-premium cursor-pointer ${room.status === "Maintenance" ? "opacity-70" : ""}`}
                  onClick={() => openRoomDetail(room)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold">{room.roomNumber}</h3>
                      {getStatusBadge(room.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{room.roomType} &middot; Floor {room.floor}</p>

                    {/* Bed Icons */}
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: room.capacity }).map((_, i) => {
                        const isOccupied = i < room.occupants.length;
                        return (
                          <Bed key={i} className={`w-4 h-4 ${isOccupied ? "text-emerald-500" : "text-muted-foreground/30"}`} />
                        );
                      })}
                      <span className="text-[10px] text-muted-foreground ml-1">{room.occupants.length}/{room.capacity}</span>
                    </div>

                    <Progress value={occupancyPct} className="h-1.5 mb-2" />

                    {/* Occupant Avatars */}
                    <div className="flex -space-x-1.5">
                      {room.occupants.slice(0, 4).map((occ) => (
                        <Avatar key={occ.name + occ.bed} className="w-6 h-6 border-2 border-background">
                          <AvatarFallback className="text-[8px] font-semibold bg-muted">{getInitials(occ.name)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Room Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Student</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Room</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Bed</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Department</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Check-in</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRooms.flatMap((room) =>
                      room.occupants.map((occ) => (
                        <tr key={`${room.id}-${occ.bed}`} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-2 font-medium">{occ.name}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className="text-xs">{room.roomNumber}</Badge>
                          </td>
                          <td className="py-3 px-2">{occ.bed}</td>
                          <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{occ.department}</td>
                          <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{occ.checkInDate}</td>
                          <td className="py-3 px-2">
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-[10px]">
                              Active
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">All Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRequests.map((req) => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      req.type === "Room Change" ? "bg-sky-100 dark:bg-sky-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                    }`}>
                      {req.type === "Room Change" ? <DoorOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" /> : <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-medium">{req.studentName}</p>
                        <Badge variant="outline" className="text-[10px]">{req.type}</Badge>
                        {getRequestStatusBadge(req.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{req.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Room {req.currentRoom} &middot; {req.date}</p>
                    </div>
                    {isAdmin && req.status === "Pending" && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="h-7 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facilities Tab */}
        <TabsContent value="facilities" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mockFacilities.map((facility) => {
              const Icon = facility.icon;
              return (
                <Card key={facility.name} className="card-premium">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        facility.available ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        <Icon className={`w-5 h-5 ${facility.available ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{facility.name}</p>
                        <Badge className={`text-[10px] border-0 ${facility.available ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {facility.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{facility.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Room Detail Dialog */}
      <Dialog open={showRoomDetail} onOpenChange={setShowRoomDetail}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Room {selectedRoom?.roomNumber}
              {selectedRoom && getStatusBadge(selectedRoom.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-[10px] text-muted-foreground">Floor</p>
                  <p className="text-lg font-bold">{selectedRoom.floor}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-[10px] text-muted-foreground">Type</p>
                  <p className="text-sm font-bold">{selectedRoom.roomType}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-[10px] text-muted-foreground">Rent</p>
                  <p className="text-lg font-bold">${selectedRoom.rent}</p>
                </div>
              </div>

              <div className="section-divider" />

              <div>
                <p className="text-sm font-semibold mb-2">Occupants ({selectedRoom.occupants.length}/{selectedRoom.capacity})</p>
                <div className="space-y-2">
                  {Array.from({ length: selectedRoom.capacity }).map((_, i) => {
                    const occ = selectedRoom.occupants[i];
                    return (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg border">
                        {occ ? (
                          <>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                {getInitials(occ.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{occ.name}</p>
                              <p className="text-[10px] text-muted-foreground">{occ.department}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px]">Bed {occ.bed}</Badge>
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                              <Bed className="w-4 h-4 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-muted-foreground">Bed {String.fromCharCode(65 + i)} - Empty</p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="section-divider" />

              <div>
                <p className="text-sm font-semibold mb-2">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.facilities.map((f) => (
                    <Badge key={f} variant="outline" className="text-xs gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoomDetail(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
