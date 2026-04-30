"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store/app-store";
import {
  Bus,
  MapPin,
  Clock,
  Users,
  Plus,
  Navigation,
  Route,
  CalendarDays,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wrench,
} from "lucide-react";

// ---- Types ----

interface TransportRoute {
  id: string;
  routeNumber: string;
  name: string;
  stops: string[];
  driverName: string;
  driverPhone: string;
  busNumber: string;
  capacity: number;
  occupied: number;
  departureTime: string;
  arrivalTime: string;
  status: "Active" | "Inactive";
}

interface TransportRequest {
  id: string;
  studentName: string;
  studentId: string;
  routeId: string;
  routeNumber: string;
  pickupPoint: string;
  status: "Pending" | "Approved" | "Rejected";
  requestDate: string;
}

interface BusTracking {
  busId: string;
  busNumber: string;
  routeNumber: string;
  lat: number;
  lng: number;
  nextStop: string;
  eta: string;
  speed: number;
}

// ---- Mock Data ----

const mockRoutes: TransportRoute[] = [
  {
    id: "r1", routeNumber: "R-01", name: "North Campus Express",
    stops: ["Central Station", "City Mall", "Park Avenue", "University Gate"],
    driverName: "Mike Johnson", driverPhone: "+1 555-0101",
    busNumber: "BUS-001", capacity: 45, occupied: 38,
    departureTime: "07:30 AM", arrivalTime: "08:15 AM", status: "Active",
  },
  {
    id: "r2", routeNumber: "R-02", name: "South Campus Route",
    stops: ["Metro Station", "Hospital Road", "Market Square", "Campus South Gate"],
    driverName: "David Brown", driverPhone: "+1 555-0102",
    busNumber: "BUS-002", capacity: 40, occupied: 32,
    departureTime: "07:45 AM", arrivalTime: "08:30 AM", status: "Active",
  },
  {
    id: "r3", routeNumber: "R-03", name: "East Side Connector",
    stops: ["Railway Station", "Tech Park", "Sports Complex", "Campus East Gate"],
    driverName: "Robert Wilson", driverPhone: "+1 555-0103",
    busNumber: "BUS-003", capacity: 50, occupied: 45,
    departureTime: "08:00 AM", arrivalTime: "08:45 AM", status: "Active",
  },
  {
    id: "r4", routeNumber: "R-04", name: "West End Shuttle",
    stops: ["Airport Road", "Industrial Area", "Residential Block", "Campus West Gate"],
    driverName: "James Taylor", driverPhone: "+1 555-0104",
    busNumber: "BUS-004", capacity: 35, occupied: 20,
    departureTime: "07:15 AM", arrivalTime: "08:00 AM", status: "Active",
  },
  {
    id: "r5", routeNumber: "R-05", name: "Weekend Shopping Run",
    stops: ["Campus Main Gate", "Shopping District", "Entertainment Plaza"],
    driverName: "Chris Evans", driverPhone: "+1 555-0105",
    busNumber: "BUS-005", capacity: 40, occupied: 0,
    departureTime: "10:00 AM", arrivalTime: "12:00 PM", status: "Inactive",
  },
];

const mockRequests: TransportRequest[] = [
  { id: "tr1", studentName: "Ryan Patel", studentId: "STU-001", routeId: "r1", routeNumber: "R-01", pickupPoint: "City Mall", status: "Approved", requestDate: "2025-01-10" },
  { id: "tr2", studentName: "Emily Chen", studentId: "STU-002", routeId: "r2", routeNumber: "R-02", pickupPoint: "Metro Station", status: "Approved", requestDate: "2025-01-08" },
  { id: "tr3", studentName: "Alex Kumar", studentId: "STU-003", routeId: "r3", routeNumber: "R-03", pickupPoint: "Tech Park", status: "Pending", requestDate: "2025-01-15" },
  { id: "tr4", studentName: "Sarah Williams", studentId: "STU-004", routeId: "r1", routeNumber: "R-01", pickupPoint: "Park Avenue", status: "Pending", requestDate: "2025-01-16" },
  { id: "tr5", studentName: "Jordan Lee", studentId: "STU-005", routeId: "r4", routeNumber: "R-04", pickupPoint: "Airport Road", status: "Rejected", requestDate: "2025-01-12" },
  { id: "tr6", studentName: "Priya Sharma", studentId: "STU-006", routeId: "r2", routeNumber: "R-02", pickupPoint: "Hospital Road", status: "Approved", requestDate: "2025-01-09" },
];

const mockTracking: BusTracking[] = [
  { busId: "b1", busNumber: "BUS-001", routeNumber: "R-01", lat: 40.7128, lng: -74.006, nextStop: "Park Avenue", eta: "8 min", speed: 35 },
  { busId: "b2", busNumber: "BUS-002", routeNumber: "R-02", lat: 40.7282, lng: -73.7949, nextStop: "Market Square", eta: "12 min", speed: 28 },
  { busId: "b3", busNumber: "BUS-003", routeNumber: "R-03", lat: 40.7489, lng: -73.9680, nextStop: "Sports Complex", eta: "5 min", speed: 42 },
  { busId: "b4", busNumber: "BUS-004", routeNumber: "R-04", lat: 40.6892, lng: -74.0445, nextStop: "Residential Block", eta: "15 min", speed: 20 },
];

// ---- Helpers ----

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ---- Main Component ----

export function TransportPage() {
  const currentRole = useAppStore((s) => s.currentUser?.role);
  const currentUser = useAppStore((s) => s.currentUser);
  const [activeTab, setActiveTab] = useState("routes");
  const [showAddRouteDialog, setShowAddRouteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = currentRole === "SuperAdmin" || currentRole === "InstituteAdmin" || currentRole === "BranchAdmin";

  const totalRoutes = mockRoutes.length;
  const activeBuses = mockRoutes.filter((r) => r.status === "Active").length;
  const totalStudents = mockRoutes.reduce((acc, r) => acc + r.occupied, 0);
  const upcomingTrips = mockRoutes.filter((r) => r.status === "Active").length;

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((r) =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // ---- Student View ----
  if (currentRole === "Student" || currentRole === "Parent") {
    const myRoute = mockRoutes[0];
    const myBus = mockTracking[0];

    return (
      <div className="page-transition space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Transport</h1>
          <p className="text-muted-foreground text-sm">Your assigned bus route and live tracking</p>
        </div>

        {/* My Route Card */}
        <Card className="card-premium">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">
                    {myRoute.routeNumber}
                  </Badge>
                  <Badge className="bg-emerald-500 text-white border-0 text-[10px]">{myRoute.status}</Badge>
                </div>
                <h2 className="text-lg font-semibold">{myRoute.name}</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Bus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            {/* Stops */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Route Stops</p>
              <div className="flex items-center gap-1 flex-wrap">
                {myRoute.stops.map((stop, i) => (
                  <span key={stop} className="flex items-center gap-1">
                    <span className="px-2 py-1 rounded-md bg-muted text-xs">{stop}</span>
                    {i < myRoute.stops.length - 1 && (
                      <span className="text-muted-foreground text-xs">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Bus Number</p>
                <p className="text-sm font-semibold">{myRoute.busNumber}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Driver</p>
                <p className="text-sm font-semibold">{myRoute.driverName}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Departure</p>
                <p className="text-sm font-semibold">{myRoute.departureTime}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Arrival</p>
                <p className="text-sm font-semibold">{myRoute.arrivalTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Tracking */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-500" />
              Live Bus Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Map Placeholder */}
            <div className="w-full h-48 sm:h-64 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-dashed border-emerald-200 dark:border-emerald-800 mb-4 flex items-center justify-center relative overflow-hidden">
              {/* Grid lines for map feel */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-emerald-500" style={{ top: `${(i + 1) * 12.5}%` }} />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-emerald-500" style={{ left: `${(i + 1) * 8.3}%` }} />
                ))}
              </div>
              {/* Bus dots */}
              {mockTracking.filter((b) => b.routeNumber === "R-01").map((bus) => (
                <div
                  key={bus.busId}
                  className="absolute flex flex-col items-center"
                  style={{ top: "40%", left: "60%" }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse-slow">
                    <Bus className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 bg-white dark:bg-gray-800 px-1 rounded">{bus.busNumber}</span>
                </div>
              ))}
              {/* Stops as dots */}
              {myRoute.stops.map((stop, i) => (
                <div
                  key={stop}
                  className="absolute"
                  style={{ top: `${20 + i * 20}%`, left: `${20 + i * 15}%` }}
                >
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-emerald-500 shadow-sm" />
                  <span className="text-[8px] ml-1.5 text-emerald-700 dark:text-emerald-300 whitespace-nowrap font-medium">{stop}</span>
                </div>
              ))}
              <div className="text-center relative z-10">
                <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Simulated map view</p>
              </div>
            </div>

            {/* Bus Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Next Stop</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{myBus.nextStop}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">ETA</p>
                <p className="text-sm font-semibold">{myBus.eta}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Speed</p>
                <p className="text-sm font-semibold">{myBus.speed} km/h</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground">Occupancy</p>
                <p className="text-sm font-semibold">{myRoute.occupied}/{myRoute.capacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---- Admin View ----
  return (
    <div className="page-transition space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transport Management</h1>
          <p className="text-muted-foreground text-sm">Manage bus routes, tracking, and student requests</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setShowAddRouteDialog(true)}>
              <Plus className="w-4 h-4" /> Add Route
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Routes", value: totalRoutes, icon: Route, color: "bg-emerald-500" },
          { label: "Active Buses", value: activeBuses, icon: Bus, color: "bg-teal-500" },
          { label: "Students Using", value: totalStudents, icon: Users, color: "bg-amber-500" },
          { label: "Upcoming Trips", value: upcomingTrips, icon: CalendarDays, color: "bg-sky-500" },
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
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        {/* Routes Tab */}
        <TabsContent value="routes" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRoutes.map((route) => {
              const occupancyPct = Math.round((route.occupied / route.capacity) * 100);
              return (
                <Card key={route.id} className="card-premium">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs font-bold">
                          {route.routeNumber}
                        </Badge>
                        <Badge className={`text-[10px] border-0 ${route.status === "Active" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                          {route.status}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{route.busNumber}</Badge>
                    </div>
                    <h3 className="text-base font-semibold mb-2">{route.name}</h3>

                    {/* Stops */}
                    <div className="flex items-center gap-1 flex-wrap mb-3">
                      {route.stops.map((stop, i) => (
                        <span key={stop} className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{stop}</span>
                          {i < route.stops.length - 1 && <MapPin className="w-3 h-3 text-emerald-400" />}
                        </span>
                      ))}
                    </div>

                    {/* Occupancy */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className="font-medium">{route.occupied}/{route.capacity} ({occupancyPct}%)</span>
                      </div>
                      <Progress value={occupancyPct} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Driver:</span>
                        <span className="font-medium">{route.driverName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium">{route.departureTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="mt-4">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium whitespace-nowrap">Route:</Label>
                <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Routes</SelectItem>
                    {mockRoutes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.routeNumber} - {r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-4">
              <div className="w-full h-64 sm:h-80 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-dashed border-emerald-200 dark:border-emerald-800 mb-4 flex items-center justify-center relative overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 opacity-10">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full h-px bg-emerald-500" style={{ top: `${(i + 1) * 12.5}%` }} />
                  ))}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full w-px bg-emerald-500" style={{ left: `${(i + 1) * 8.3}%` }} />
                  ))}
                </div>
                {/* Bus indicators */}
                {mockTracking
                  .filter((b) => selectedRouteId === "all" || b.routeNumber === mockRoutes.find((r) => r.id === selectedRouteId)?.routeNumber)
                  .map((bus, i) => (
                    <div
                      key={bus.busId}
                      className="absolute flex flex-col items-center"
                      style={{ top: `${25 + i * 18}%`, left: `${30 + i * 12}%` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse-slow">
                        <Bus className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[9px] font-bold mt-0.5 bg-white dark:bg-gray-800 px-1 rounded">{bus.busNumber}</span>
                    </div>
                  ))}
                <div className="text-center relative z-10">
                  <Navigation className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Live Tracking Map</p>
                  <p className="text-xs text-muted-foreground">Real-time bus positions</p>
                </div>
              </div>

              {/* Bus Status Table */}
              <div className="space-y-2">
                {mockTracking
                  .filter((b) => selectedRouteId === "all" || b.routeNumber === mockRoutes.find((r) => r.id === selectedRouteId)?.routeNumber)
                  .map((bus) => (
                    <div key={bus.busId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <Bus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{bus.busNumber} <Badge variant="outline" className="text-[10px] ml-1">{bus.routeNumber}</Badge></p>
                          <p className="text-xs text-muted-foreground">Next: {bus.nextStop}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">ETA: {bus.eta}</p>
                        <p className="text-xs text-muted-foreground">{bus.speed} km/h</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Transport Requests</CardTitle>
                <Input
                  placeholder="Search student or route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px] h-8 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Student</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Route</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Pickup</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                      {isAdmin && <th className="text-left py-3 px-2 font-medium text-muted-foreground">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2 font-medium">{req.studentName}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="text-xs">{req.routeNumber}</Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{req.pickupPoint}</td>
                        <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{req.requestDate}</td>
                        <td className="py-3 px-2">
                          <Badge className={`text-[10px] border-0 ${
                            req.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            req.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {req.status}
                          </Badge>
                        </td>
                        {isAdmin && req.status === "Pending" && (
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-7 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="card-premium cursor-pointer" onClick={() => setShowAddRouteDialog(true)}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                  <Route className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Add / Edit Route</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Create new routes or modify existing ones</p>
                </div>
              </CardContent>
            </Card>
            <Card className="card-premium cursor-pointer" onClick={() => setShowAssignDialog(true)}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Assign Driver</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Assign drivers to routes and buses</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Route Dialog */}
      <Dialog open={showAddRouteDialog} onOpenChange={setShowAddRouteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Route Number</Label>
              <Input placeholder="e.g., R-06" />
            </div>
            <div className="space-y-2">
              <Label>Route Name</Label>
              <Input placeholder="e.g., Downtown Express" />
            </div>
            <div className="space-y-2">
              <Label>Stops (comma separated)</Label>
              <Input placeholder="Stop 1, Stop 2, Stop 3..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                  <SelectContent>
                    {mockRoutes.map((r) => (
                      <SelectItem key={r.id} value={r.driverName}>{r.driverName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bus</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select bus" /></SelectTrigger>
                  <SelectContent>
                    {mockRoutes.map((r) => (
                      <SelectItem key={r.id} value={r.busNumber}>{r.busNumber}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Departure Time</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>Arrival Time</Label>
                <Input type="time" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRouteDialog(false)}>Cancel</Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setShowAddRouteDialog(false)}>Add Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Driver Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Route</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select route" /></SelectTrigger>
                <SelectContent>
                  {mockRoutes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.routeNumber} - {r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Driver</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                <SelectContent>
                  {mockRoutes.map((r) => (
                    <SelectItem key={r.id} value={r.driverName}>{r.driverName} ({r.driverPhone})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bus Number</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select bus" /></SelectTrigger>
                <SelectContent>
                  {mockRoutes.map((r) => (
                    <SelectItem key={r.id} value={r.busNumber}>{r.busNumber} (Cap: {r.capacity})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setShowAssignDialog(false)}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
