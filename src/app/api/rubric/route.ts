import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const data = {
      rubrics: [
        {
          id: "r1", title: "Essay Writing Rubric", subject: "English Literature",
          description: "Assessment rubric for analytical essay writing assignments.",
          criteria: ["Thesis & Argument", "Content & Evidence", "Organization", "Language & Grammar", "Citations & Format"],
          levels: ["Excellent (4)", "Good (3)", "Satisfactory (2)", "Needs Improvement (1)"],
          totalPoints: 20, lastModified: "2025-01-15", createdBy: "Prof. Emily Rodriguez",
        },
        {
          id: "r2", title: "Lab Report Assessment", subject: "Physics",
          description: "Standard rubric for evaluating laboratory experiment reports.",
          criteria: ["Hypothesis", "Methodology", "Data Analysis", "Conclusion", "Presentation"],
          levels: ["Excellent (4)", "Good (3)", "Satisfactory (2)", "Needs Improvement (1)"],
          totalPoints: 20, lastModified: "2025-01-12", createdBy: "Dr. Sarah Chen",
        },
        {
          id: "r3", title: "Group Project Evaluation", subject: "Software Engineering",
          description: "Team-based project assessment covering technical and collaboration skills.",
          criteria: ["Technical Quality", "Teamwork", "Documentation", "Presentation", "Innovation"],
          levels: ["Excellent (4)", "Good (3)", "Satisfactory (2)", "Needs Improvement (1)"],
          totalPoints: 20, lastModified: "2025-01-10", createdBy: "Prof. Emily Rodriguez",
        },
      ],
      templates: [
        {
          id: "t1", title: "Essay Writing", subject: "English / Humanities",
          description: "Comprehensive rubric for analytical and argumentative essays",
          criteria: ["Thesis & Argument", "Content & Evidence", "Organization", "Language & Grammar", "Citations"],
        },
        {
          id: "t2", title: "Presentation", subject: "General / Communication",
          description: "Assessment for oral presentations and slide decks",
          criteria: ["Content Knowledge", "Delivery & Presence", "Visual Aids", "Engagement", "Time Management"],
        },
        {
          id: "t3", title: "Lab Report", subject: "Sciences / Engineering",
          description: "Standard rubric for science and engineering lab reports",
          criteria: ["Hypothesis", "Methodology", "Data Analysis", "Conclusion", "Presentation"],
        },
        {
          id: "t4", title: "Group Project", subject: "Any / Interdisciplinary",
          description: "Team-based project evaluation with collaboration metrics",
          criteria: ["Technical Quality", "Teamwork", "Documentation", "Presentation", "Innovation"],
        },
        {
          id: "t5", title: "Debate / Discussion", subject: "Social Sciences / Language",
          description: "Assessment for structured debates and class discussions",
          criteria: ["Argument Strength", "Evidence & Support", "Counter-arguments", "Communication Skills", "Respect & Etiquette"],
        },
      ],
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch rubric data" }, { status: 500 });
  }
}
