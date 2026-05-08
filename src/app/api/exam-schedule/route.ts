import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const now = new Date();
    const getDayOffset = (d: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() + d);
      return date.toISOString().split("T")[0];
    };

    const data = {
      upcoming: 6,
      thisWeek: 2,
      totalSubjects: 4,
      averageScore: 78,
      exams: [
        { id: "e1", subject: "Data Structures & Algorithms", subjectCode: "CS201", type: "Midterm", date: getDayOffset(-2), startTime: "09:00 AM", endTime: "11:00 AM", duration: "2h", room: "Hall A-101", seat: "R3-C5", status: "Completed", totalMarks: 50 },
        { id: "e2", subject: "Operating Systems", subjectCode: "CS301", type: "Midterm", date: getDayOffset(-1), startTime: "02:00 PM", endTime: "04:00 PM", duration: "2h", room: "Hall B-203", seat: "R5-C8", status: "Completed", totalMarks: 50 },
        { id: "e3", subject: "Machine Learning", subjectCode: "CS401", type: "Quiz", date: getDayOffset(0), startTime: "10:00 AM", endTime: "11:00 AM", duration: "1h", room: "Room C-105", seat: "R2-C3", status: "In Progress", totalMarks: 20 },
        { id: "e4", subject: "Database Management", subjectCode: "CS302", type: "Practical", date: getDayOffset(1), startTime: "09:00 AM", endTime: "12:00 PM", duration: "3h", room: "Lab D-301", seat: "WS-12", status: "Upcoming", totalMarks: 40 },
        { id: "e5", subject: "Computer Networks", subjectCode: "CS303", type: "Final", date: getDayOffset(2), startTime: "09:00 AM", endTime: "12:00 PM", duration: "3h", room: "Hall A-101", seat: "R1-C1", status: "Upcoming", totalMarks: 100 },
        { id: "e6", subject: "Software Engineering", subjectCode: "CS402", type: "Midterm", date: getDayOffset(3), startTime: "02:00 PM", endTime: "04:00 PM", duration: "2h", room: "Hall B-203", seat: "R4-C6", status: "Upcoming", totalMarks: 50 },
        { id: "e7", subject: "Data Structures & Algorithms", subjectCode: "CS201", type: "Final", date: getDayOffset(5), startTime: "09:00 AM", endTime: "12:00 PM", duration: "3h", room: "Hall A-101", seat: "R3-C5", status: "Upcoming", totalMarks: 100 },
        { id: "e8", subject: "Operating Systems", subjectCode: "CS301", type: "Final", date: getDayOffset(7), startTime: "02:00 PM", endTime: "05:00 PM", duration: "3h", room: "Hall A-102", seat: "R5-C8", status: "Upcoming", totalMarks: 100 },
      ],
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch exam schedule data" }, { status: 500 });
  }
}
