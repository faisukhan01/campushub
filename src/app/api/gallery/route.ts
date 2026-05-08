import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const data = {
      stats: {
        totalEvents: 6,
        totalPhotos: 16,
        totalAlbums: 8,
        thisMonth: 8,
      },
      photos: [
        { id: "p1", title: "Annual Cultural Night", category: "Cultural", date: "2025-01-15", album: "Cultural Fest 2025", likes: 234, comments: 18 },
        { id: "p2", title: "Inter-College Basketball Final", category: "Sports", date: "2025-01-12", album: "Sports Meet 2025", likes: 189, comments: 12 },
        { id: "p3", title: "Research Paper Presentation", category: "Academic", date: "2025-01-10", album: "Tech Conference", likes: 156, comments: 8 },
        { id: "p4", title: "Hackathon Winners", category: "Technical", date: "2025-01-08", album: "Hackathon 2025", likes: 312, comments: 24 },
        { id: "p5", title: "Diwali Celebrations", category: "Festival", date: "2024-11-01", album: "Diwali 2024", likes: 445, comments: 32 },
        { id: "p6", title: "Science Exhibition", category: "Academic", date: "2025-01-05", album: "Science Expo", likes: 178, comments: 15 },
        { id: "p7", title: "Cricket Tournament", category: "Sports", date: "2024-12-20", album: "Sports Meet 2025", likes: 267, comments: 19 },
        { id: "p8", title: "Music Concert", category: "Cultural", date: "2024-12-15", album: "Cultural Fest 2025", likes: 398, comments: 28 },
        { id: "p9", title: "Robotics Workshop", category: "Technical", date: "2025-01-03", album: "Tech Workshop", likes: 145, comments: 10 },
        { id: "p10", title: "Holi Festival", category: "Festival", date: "2024-03-25", album: "Holi 2024", likes: 523, comments: 41 },
        { id: "p11", title: "Art Exhibition", category: "Cultural", date: "2025-01-11", album: "Art Gallery", likes: 198, comments: 14 },
        { id: "p12", title: "Track and Field Events", category: "Sports", date: "2024-12-18", album: "Sports Meet 2025", likes: 211, comments: 16 },
        { id: "p13", title: "AI Lab Inauguration", category: "Academic", date: "2024-12-10", album: "Campus Development", likes: 167, comments: 11 },
        { id: "p14", title: "Coding Competition", category: "Technical", date: "2025-01-07", album: "Hackathon 2025", likes: 234, comments: 20 },
        { id: "p15", title: "Christmas Celebrations", category: "Festival", date: "2024-12-25", album: "Christmas 2024", likes: 378, comments: 29 },
        { id: "p16", title: "Drama Performance", category: "Cultural", date: "2025-01-14", album: "Cultural Fest 2025", likes: 289, comments: 22 },
      ],
      albums: [
        { id: "a1", title: "Cultural Fest 2025", photoCount: 156, dateRange: "Jan 10-15, 2025", creator: "Media Club" },
        { id: "a2", title: "Sports Meet 2025", photoCount: 234, dateRange: "Dec 15-22, 2024", creator: "Sports Dept" },
        { id: "a3", title: "Tech Conference", photoCount: 89, dateRange: "Jan 8-10, 2025", creator: "CS Department" },
        { id: "a4", title: "Hackathon 2025", photoCount: 112, dateRange: "Jan 5-7, 2025", creator: "ACM Chapter" },
        { id: "a5", title: "Diwali 2024", photoCount: 78, dateRange: "Oct 30 - Nov 2, 2024", creator: "Cultural Committee" },
        { id: "a6", title: "Science Expo", photoCount: 67, dateRange: "Jan 3-5, 2025", creator: "Science Club" },
        { id: "a7", title: "Art Gallery", photoCount: 45, dateRange: "Jan 9-12, 2025", creator: "Art Club" },
        { id: "a8", title: "Campus Development", photoCount: 34, dateRange: "Nov 2024 - Jan 2025", creator: "Admin" },
      ],
      events: [
        { id: "ev1", title: "Spring Cultural Festival", type: "Cultural", date: "2025-02-15", location: "Main Auditorium", organizer: "Cultural Committee", isPast: false, attendees: 450 },
        { id: "ev2", title: "Inter-College Tech Quiz", type: "Technical", date: "2025-02-20", location: "Seminar Hall A", organizer: "ACM Chapter", isPast: false, attendees: 180 },
        { id: "ev3", title: "Annual Sports Day", type: "Sports", date: "2025-03-01", location: "Sports Complex", organizer: "Sports Department", isPast: false, attendees: 600 },
        { id: "ev4", title: "Research Symposium", type: "Academic", date: "2025-03-10", location: "Conference Center", organizer: "Research Cell", isPast: false, attendees: 200 },
        { id: "ev5", title: "Holi Colors Festival", type: "Festival", date: "2025-03-14", location: "Campus Grounds", organizer: "Student Council", isPast: false, attendees: 800 },
        { id: "ev6", title: "New Year Gala 2025", type: "Cultural", date: "2025-01-01", location: "Open Air Theater", organizer: "Student Council", isPast: true, attendees: 700 },
      ],
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch gallery data" }, { status: 500 });
  }
}
