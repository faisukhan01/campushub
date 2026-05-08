import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      routes: [
        {
          id: "r1",
          routeNumber: "R-01",
          name: "North Campus Express",
          stops: ["Central Station", "City Mall", "Park Avenue", "University Gate"],
          driverName: "Mike Johnson",
          driverPhone: "+1 555-0101",
          busNumber: "BUS-001",
          capacity: 45,
          occupied: 38,
          departureTime: "07:30 AM",
          arrivalTime: "08:15 AM",
          status: "Active",
        },
        {
          id: "r2",
          routeNumber: "R-02",
          name: "South Campus Route",
          stops: ["Metro Station", "Hospital Road", "Market Square", "Campus South Gate"],
          driverName: "David Brown",
          driverPhone: "+1 555-0102",
          busNumber: "BUS-002",
          capacity: 40,
          occupied: 32,
          departureTime: "07:45 AM",
          arrivalTime: "08:30 AM",
          status: "Active",
        },
        {
          id: "r3",
          routeNumber: "R-03",
          name: "East Side Connector",
          stops: ["Railway Station", "Tech Park", "Sports Complex", "Campus East Gate"],
          driverName: "Robert Wilson",
          driverPhone: "+1 555-0103",
          busNumber: "BUS-003",
          capacity: 50,
          occupied: 45,
          departureTime: "08:00 AM",
          arrivalTime: "08:45 AM",
          status: "Active",
        },
        {
          id: "r4",
          routeNumber: "R-04",
          name: "West End Shuttle",
          stops: ["Airport Road", "Industrial Area", "Residential Block", "Campus West Gate"],
          driverName: "James Taylor",
          driverPhone: "+1 555-0104",
          busNumber: "BUS-004",
          capacity: 35,
          occupied: 20,
          departureTime: "07:15 AM",
          arrivalTime: "08:00 AM",
          status: "Active",
        },
      ],
      tracking: [
        { busId: "b1", busNumber: "BUS-001", routeNumber: "R-01", nextStop: "Park Avenue", eta: "8 min", speed: 35 },
        { busId: "b2", busNumber: "BUS-002", routeNumber: "R-02", nextStop: "Market Square", eta: "12 min", speed: 28 },
        { busId: "b3", busNumber: "BUS-003", routeNumber: "R-03", nextStop: "Sports Complex", eta: "5 min", speed: 42 },
        { busId: "b4", busNumber: "BUS-004", routeNumber: "R-04", nextStop: "Residential Block", eta: "15 min", speed: 20 },
      ],
      requests: [
        { id: "tr1", studentName: "Ryan Patel", routeNumber: "R-01", pickupPoint: "City Mall", status: "Approved" },
        { id: "tr2", studentName: "Emily Chen", routeNumber: "R-02", pickupPoint: "Metro Station", status: "Approved" },
        { id: "tr3", studentName: "Alex Kumar", routeNumber: "R-03", pickupPoint: "Tech Park", status: "Pending" },
        { id: "tr4", studentName: "Sarah Williams", routeNumber: "R-01", pickupPoint: "Park Avenue", status: "Pending" },
        { id: "tr5", studentName: "Jordan Lee", routeNumber: "R-04", pickupPoint: "Airport Road", status: "Rejected" },
      ],
      summary: {
        totalRoutes: 4,
        activeBuses: 4,
        studentsUsing: 135,
        upcomingTrips: 4,
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch transport data" }, { status: 500 });
  }
}
