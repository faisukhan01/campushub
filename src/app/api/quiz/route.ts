import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      quiz: {
        id: "quiz-1",
        title: "Data Structures & Algorithms",
        courseCode: "CS201",
        courseName: "Data Structures & Algorithms",
        duration: 30,
        totalPoints: 20,
        status: "active",
        questions: [
          {
            id: 1,
            type: "mcq",
            question: "Which data structure uses LIFO (Last In, First Out) principle?",
            options: [
              { id: "a", text: "Queue" },
              { id: "b", text: "Stack" },
              { id: "c", text: "Linked List" },
              { id: "d", text: "Array" },
            ],
            correctAnswer: "b",
            points: 2,
          },
          {
            id: 2,
            type: "truefalse",
            question: "In a binary search tree, the left child of a node always has a greater value than the node itself.",
            options: [
              { id: "true", text: "True" },
              { id: "false", text: "False" },
            ],
            correctAnswer: "false",
            points: 1,
          },
          {
            id: 3,
            type: "mcq",
            question: "What is the time complexity of accessing an element in a hash table with a good hash function?",
            options: [
              { id: "a", text: "O(n)" },
              { id: "b", text: "O(log n)" },
              { id: "c", text: "O(1) average case" },
              { id: "d", text: "O(n log n)" },
            ],
            correctAnswer: "c",
            points: 2,
          },
          {
            id: 4,
            type: "shortanswer",
            question: "What is the difference between a process and a thread in operating systems?",
            correctAnswer: "A process is an independent program in execution with its own memory space, while a thread is a lightweight sub-process that shares memory space with other threads of the same process.",
            points: 3,
          },
          {
            id: 5,
            type: "mcq",
            question: "Which sorting algorithm has the best average-case time complexity?",
            options: [
              { id: "a", text: "Bubble Sort - O(n²)" },
              { id: "b", text: "Merge Sort - O(n log n)" },
              { id: "c", text: "Selection Sort - O(n²)" },
              { id: "d", text: "Insertion Sort - O(n²)" },
            ],
            correctAnswer: "b",
            points: 2,
          },
          {
            id: 6,
            type: "truefalse",
            question: "TCP (Transmission Control Protocol) is a connectionless protocol.",
            options: [
              { id: "true", text: "True" },
              { id: "false", text: "False" },
            ],
            correctAnswer: "false",
            points: 1,
          },
          {
            id: 7,
            type: "mcq",
            question: "Which layer of the OSI model is responsible for routing?",
            options: [
              { id: "a", text: "Data Link Layer" },
              { id: "b", text: "Transport Layer" },
              { id: "c", text: "Network Layer" },
              { id: "d", text: "Application Layer" },
            ],
            correctAnswer: "c",
            points: 2,
          },
          {
            id: 8,
            type: "shortanswer",
            question: "Explain the concept of virtual memory in operating systems.",
            correctAnswer: "Virtual memory is a memory management technique that creates an illusion of a large, contiguous address space by using both RAM and secondary storage.",
            points: 3,
          },
          {
            id: 9,
            type: "mcq",
            question: "What does ACID stand for in database management systems?",
            options: [
              { id: "a", text: "Atomicity, Consistency, Isolation, Durability" },
              { id: "b", text: "Access, Control, Integrity, Data" },
              { id: "c", text: "Asynchronous, Concurrent, Independent, Distributed" },
              { id: "d", text: "Authentication, Control, Identity, Distribution" },
            ],
            correctAnswer: "a",
            points: 2,
          },
          {
            id: 10,
            type: "truefalse",
            question: "In normalized databases, third normal form (3NF) eliminates transitive dependencies.",
            options: [
              { id: "true", text: "True" },
              { id: "false", text: "False" },
            ],
            correctAnswer: "true",
            points: 1,
          },
        ],
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch quiz data" }, { status: 500 });
  }
}
