import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      rooms: [
        { id: "rm1", roomNumber: "101", floor: 1, capacity: 4, occupants: 3, status: "Partial", roomType: "4-Bed Shared", rent: 2000 },
        { id: "rm2", roomNumber: "102", floor: 1, capacity: 4, occupants: 4, status: "Full", roomType: "4-Bed Shared", rent: 2000 },
        { id: "rm3", roomNumber: "103", floor: 1, capacity: 2, occupants: 0, status: "Vacant", roomType: "2-Bed Shared", rent: 3000 },
        { id: "rm4", roomNumber: "201", floor: 2, capacity: 2, occupants: 1, status: "Partial", roomType: "2-Bed Shared", rent: 3000 },
        { id: "rm5", roomNumber: "202", floor: 2, capacity: 4, occupants: 0, status: "Maintenance", roomType: "4-Bed Shared", rent: 2000 },
        { id: "rm6", roomNumber: "203", floor: 2, capacity: 2, occupants: 2, status: "Full", roomType: "2-Bed Shared", rent: 3000 },
        { id: "rm7", roomNumber: "301", floor: 3, capacity: 1, occupants: 0, status: "Vacant", roomType: "Single Room", rent: 5000 },
        { id: "rm8", roomNumber: "302", floor: 3, capacity: 1, occupants: 1, status: "Full", roomType: "Single Room", rent: 5000 },
      ],
      allocations: [
        { studentName: "Ryan Patel", room: "101", bed: "A", department: "Computer Science", checkInDate: "2024-08-15", status: "Active" },
        { studentName: "Alex Kumar", room: "101", bed: "B", department: "Computer Science", checkInDate: "2024-08-15", status: "Active" },
        { studentName: "Jordan Lee", room: "101", bed: "C", department: "Electrical Engg", checkInDate: "2024-08-16", status: "Active" },
        { studentName: "Emily Chen", room: "102", bed: "A", department: "Mechanical Engg", checkInDate: "2024-08-15", status: "Active" },
        { studentName: "Sarah Williams", room: "102", bed: "B", department: "Civil Engg", checkInDate: "2024-08-15", status: "Active" },
        { studentName: "Priya Sharma", room: "102", bed: "C", department: "Computer Science", checkInDate: "2024-08-16", status: "Active" },
        { studentName: "David Kim", room: "201", bed: "A", department: "Computer Science", checkInDate: "2024-08-15", status: "Active" },
        { studentName: "Chris Johnson", room: "302", bed: "A", department: "MBA", checkInDate: "2024-08-15", status: "Active" },
      ],
      requests: [
        { id: "req1", studentName: "Alex Kumar", type: "Room Change", currentRoom: "101", description: "Request to change to a 2-bed room.", status: "Pending", date: "2025-01-15" },
        { id: "req2", studentName: "Ryan Patel", type: "Maintenance", currentRoom: "101", description: "AC not cooling properly.", status: "In Progress", date: "2025-01-12" },
        { id: "req3", studentName: "Emily Chen", type: "Maintenance", currentRoom: "102", description: "Leaking faucet in bathroom.", status: "Resolved", date: "2025-01-08" },
        { id: "req4", studentName: "David Kim", type: "Room Change", currentRoom: "201", description: "Move to single room on 3rd floor.", status: "Approved", date: "2025-01-10" },
      ],
      facilities: [
        { name: "WiFi", available: true },
        { name: "Laundry", available: true },
        { name: "Cafeteria", available: true },
        { name: "Gym", available: true },
        { name: "Hot Water", available: true },
        { name: "Study Hall", available: true },
        { name: "Common Room TV", available: true },
        { name: "Parking", available: false },
      ],
      summary: {
        totalRooms: 8,
        occupied: 5,
        vacant: 2,
        maintenanceRequests: 2,
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch hostel data" }, { status: 500 });
  }
}
