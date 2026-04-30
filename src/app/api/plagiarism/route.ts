import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const data = {
      stats: {
        totalScans: 5,
        flaggedCount: 2,
        averageSimilarity: 21,
        cleanRate: 40,
      },
      history: [
        { id: "h1", date: "2025-01-15", student: "Ryan Patel", assignment: "ML Research Paper", course: "CS401", similarity: 32, status: "Flagged" },
        { id: "h2", date: "2025-01-14", student: "Priya Sharma", assignment: "Data Analysis Report", course: "CS301", similarity: 8, status: "Clean" },
        { id: "h3", date: "2025-01-13", student: "Alex Johnson", assignment: "Network Design Doc", course: "CS303", similarity: 15, status: "Completed" },
        { id: "h4", date: "2025-01-12", student: "Sarah Kim", assignment: "DB Schema Design", course: "CS302", similarity: 45, status: "Flagged" },
        { id: "h5", date: "2025-01-11", student: "David Lee", assignment: "OS Process Report", course: "CS201", similarity: 5, status: "Clean" },
      ],
      latestResult: {
        overallScore: 32,
        internetSources: 18,
        internalDb: 10,
        publications: 4,
        sources: [
          { id: "s1", title: "Introduction to Machine Learning - Stanford CS229", similarity: 18, snippet: "Machine learning algorithms are computational methods that allow computers to learn patterns from data", url: "https://cs229.stanford.edu" },
          { id: "s2", title: "Internal Submission - CS401 Assignment 3 (2024)", similarity: 10, snippet: "These algorithms use statistical techniques to identify patterns and make decisions", url: "#" },
          { id: "s3", title: "IEEE Paper: ML in Education (2023)", similarity: 4, snippet: "The field has grown rapidly in recent years", url: "https://ieeexplore.ieee.org" },
        ],
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch plagiarism data" }, { status: 500 });
  }
}
