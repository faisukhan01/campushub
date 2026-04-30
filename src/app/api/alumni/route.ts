import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      alumni: [
        {
          id: "al1",
          name: "Aarav Mehta",
          batch: "2020",
          department: "Computer Science",
          degree: "B.Tech",
          currentCompany: "Google",
          role: "Senior Software Engineer",
          location: "Mountain View, CA",
          bio: "Full-stack developer specializing in distributed systems.",
          achievements: ["Published 3 research papers", "Google Peer Bonus Award 2023"],
        },
        {
          id: "al2",
          name: "Sneha Reddy",
          batch: "2019",
          department: "Electronics",
          degree: "B.Tech",
          currentCompany: "Apple",
          role: "Hardware Engineer",
          location: "Cupertino, CA",
          bio: "Hardware design engineer working on next-gen consumer electronics.",
          achievements: ["Apple Innovation Award", "3 patents filed"],
        },
        {
          id: "al3",
          name: "Rahul Sharma",
          batch: "2018",
          department: "MBA",
          degree: "MBA",
          currentCompany: "McKinsey & Co",
          role: "Engagement Manager",
          location: "New York, NY",
          bio: "Management consultant specializing in digital transformation.",
          achievements: ["McKinsey Partner Track", "TEDx Speaker"],
        },
        {
          id: "al4",
          name: "Priya Nair",
          batch: "2021",
          department: "Data Science",
          degree: "M.Tech",
          currentCompany: "Netflix",
          role: "ML Engineer",
          location: "Los Gatos, CA",
          bio: "Machine learning engineer building recommendation systems.",
          achievements: ["Best Paper Award at NeurIPS", "Netflix Innovation Award"],
        },
        {
          id: "al5",
          name: "Vikram Singh",
          batch: "2017",
          department: "Mechanical Engg",
          degree: "B.Tech",
          currentCompany: "Tesla",
          role: "Engineering Manager",
          location: "Austin, TX",
          bio: "Leading battery engineering team for Tesla Energy products.",
          achievements: ["Tesla Impact Award", "Forbes 30 Under 30"],
        },
        {
          id: "al6",
          name: "Ananya Gupta",
          batch: "2020",
          department: "Computer Science",
          degree: "B.Tech",
          currentCompany: "Microsoft",
          role: "Product Manager",
          location: "Seattle, WA",
          bio: "Product manager at Microsoft Azure.",
          achievements: ["Microsoft Gold Award", "Startup advisor to 5 companies"],
        },
      ],
      events: [
        { id: "ev1", title: "Annual Alumni Reunion 2025", date: "2025-03-15", time: "6:00 PM", location: "Campus Main Auditorium", type: "Reunion", attendees: 350 },
        { id: "ev2", title: "Tech Talk: AI in Industry", date: "2025-02-20", time: "3:00 PM", location: "Virtual (Zoom)", type: "Seminar", attendees: 120 },
        { id: "ev3", title: "Startup Networking Mixer", date: "2025-02-28", time: "7:00 PM", location: "The Grand Hotel", type: "Networking", attendees: 85 },
        { id: "ev4", title: "Career Mentorship Program", date: "2025-03-01", time: "10:00 AM", location: "Career Center", type: "Workshop", attendees: 60 },
      ],
      successStories: [
        { id: "ss1", name: "Vikram Singh", batch: "2017", role: "Engineering Manager", company: "Tesla", quote: "The hands-on lab experience at Greenfield prepared me for real-world engineering challenges.", achievement: "Forbes 30 Under 30" },
        { id: "ss2", name: "Sneha Reddy", batch: "2019", role: "Hardware Engineer", company: "Apple", quote: "My professors encouraged me to think beyond the syllabus.", achievement: "MIT Tech Review 35 Under 35" },
        { id: "ss3", name: "Rahul Sharma", batch: "2018", role: "Engagement Manager", company: "McKinsey", quote: "The analytical rigor we practiced in class directly translates to my work.", achievement: "Led digital transformation for Fortune 500 companies" },
        { id: "ss4", name: "Priya Nair", batch: "2021", role: "ML Engineer", company: "Netflix", quote: "Greenfield's research culture sparked my love for machine learning.", achievement: "Best Paper at NeurIPS" },
      ],
      summary: {
        totalAlumni: 6,
        thisYearGrads: 1,
        employedPct: 100,
        topCompanies: 6,
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch alumni data" }, { status: 500 });
  }
}
