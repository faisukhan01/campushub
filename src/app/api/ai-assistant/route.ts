import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A non-empty 'message' string is required." },
        { status: 400 }
      );
    }

    const lowerMessage = message.toLowerCase();

    let response: string;
    let type: string;

    if (lowerMessage.includes("summarize")) {
      type = "summary";
      response = `Here's a concise summary of your recent academic activity:

**Overall Performance**: You're maintaining a strong GPA of 3.7 this semester.

**Course Progress**:
- Machine Learning: 85% (Mid-term completed, A grade)
- Data Structures: 78% (4 assignments submitted, 1 pending)
- Operating Systems: 65% attendance (⚠️ Below required 75%)
- Computer Networks: 82% (All materials reviewed)
- Software Engineering: Project Phase 1 submitted, pending peer reviews

**Upcoming Deadlines**:
- Data Structures Assignment 4: Tomorrow
- Peer Reviews (3 submissions): January 25
- End-Semester Exams: Starting February 15

**Action Items**: Improve OS attendance immediately, submit pending DS assignment, and prepare for peer reviews.`;
    } else if (lowerMessage.includes("flashcard")) {
      type = "flashcard";
      response = `Here are flashcards based on your current courses:

**Card 1** - Machine Learning
Q: What is the difference between supervised and unsupervised learning?
A: Supervised learning uses labeled data to train models (classification, regression), while unsupervised learning finds patterns in unlabeled data (clustering, dimensionality reduction).

**Card 2** - Data Structures
Q: What is the time complexity of BFS and DFS?
A: Both BFS and DFS have O(V + E) time complexity where V = vertices and E = edges. BFS uses a queue (space O(V)), DFS uses a stack (space O(V) worst case).

**Card 3** - Operating Systems
Q: What is a deadlock? Name the four necessary conditions.
A: A deadlock is when processes are blocked waiting for each other. Four conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.

**Card 4** - Computer Networks
Q: How does TCP ensure reliable data transfer?
A: Through sequence numbers, acknowledgments, checksums, retransmission (ARQ), flow control (sliding window), and congestion control.

**Card 5** - Software Engineering
Q: What are the SOLID principles?
A: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.`;
    } else if (lowerMessage.includes("quiz")) {
      type = "quiz";
      response = `Here's a practice quiz based on your enrolled courses:

**Question 1** (Machine Learning)
Which of the following is NOT a regularization technique?
A) L1 Regularization (Lasso)
B) L2 Regularization (Ridge)
C) Dropout
D) Batch Normalization
✅ Correct Answer: D

**Question 2** (Data Structures)
What data structure would you use to implement a priority queue efficiently?
A) Array
B) Linked List
C) Binary Heap
D) Stack
✅ Correct Answer: C

**Question 3** (Operating Systems)
Which scheduling algorithm may cause starvation?
A) Round Robin
B) SJF (Shortest Job First)
C) FCFS (First Come First Served)
D) All of the above
✅ Correct Answer: B

**Question 4** (Computer Networks)
Which layer of the OSI model handles routing?
A) Data Link Layer
B) Network Layer
C) Transport Layer
D) Application Layer
✅ Correct Answer: B

**Question 5** (Software Engineering)
In Agile methodology, what is the recommended duration of a sprint?
A) 1 day
B) 1-4 weeks
C) 3 months
D) 6 months
✅ Correct Answer: B`;
    } else if (lowerMessage.includes("explain")) {
      type = "explanation";
      response = `Sure! Here's a detailed explanation:

**Topic: Neural Networks and Backpropagation**

A neural network is a computational model inspired by biological neurons in the brain. Here's how it works:

**Architecture**:
- **Input Layer**: Receives raw data features (e.g., pixel values for images, word embeddings for text)
- **Hidden Layers**: Perform computations through weighted connections. Each neuron applies: output = activation(Σ(weights × inputs) + bias)
- **Output Layer**: Produces the final prediction (classification, regression, etc.)

**Forward Propagation**:
Data flows from input → hidden layers → output. Each neuron computes a weighted sum of its inputs and passes it through an activation function (ReLU, Sigmoid, Tanh).

**Backpropagation** (Learning):
1. Calculate the error (loss) between predicted and actual output
2. Compute gradients of the loss with respect to each weight using the chain rule
3. Update weights in the opposite direction of gradients: weight -= learning_rate × gradient

**Key Concepts**:
- **Learning Rate**: Controls how big the weight updates are (too high = unstable, too low = slow)
- **Epoch**: One complete pass through the training data
- **Batch Size**: Number of samples processed before updating weights
- **Overfitting**: When the model memorizes training data but fails on new data (addressed by regularization)

Would you like me to explain any specific part in more detail?`;
    } else if (lowerMessage.includes("plan")) {
      type = "study_plan";
      response = `Here's a personalized study plan for your upcoming exams:

## 📅 4-Week Exam Preparation Plan

**Week 1 (Jan 20 - Jan 26): Foundation & Review**
- Monday: Data Structures - Review trees, graphs, sorting algorithms (3 hrs)
- Tuesday: Operating Systems - Process management, memory management (3 hrs)
- Wednesday: Machine Learning - Review mid-term topics, neural networks (2 hrs)
- Thursday: Data Structures - Practice BFS/DFS problems on LeetCode (2 hrs)
- Friday: Complete pending DS Assignment 4 ⚠️
- Saturday: Software Engineering - Review design patterns, UML (2 hrs)
- Sunday: Peer reviews (3 submissions) + Buffer time

**Week 2 (Jan 27 - Feb 2): Deep Dive**
- Monday-Wednesday: Computer Networks - OSI model, TCP/IP, protocols (6 hrs total)
- Thursday-Friday: Operating Systems - File systems, I/O management, deadlock (4 hrs)
- Saturday: Machine Learning - Practice with real datasets (3 hrs)
- Sunday: Course registration for Semester 7

**Week 3 (Feb 3 - Feb 9): Practice & Revision**
- Daily: Solve previous year question papers (2 hrs/day)
- Focus on weak areas identified from practice tests
- Form study groups for collaborative learning
- Attend all OS lectures (critical for attendance)

**Week 4 (Feb 10 - Feb 14): Final Sprint**
- Monday: Full revision of Data Structures (exam Feb 15)
- Tuesday: Light review + Rest before first exam
- Wednesday: DS Exam Day
- Thursday: Quick OS revision (exam Feb 18)
- Rest well before each exam!

**Daily Habits**:
- ⏰ 2 hours of focused study (Pomodoro technique)
- 📝 Create summary notes for each topic
- 🧪 Practice 5 problems daily on coding platforms
- 😴 Ensure 7-8 hours of sleep
- 💧 Stay hydrated and take regular breaks`;
    } else {
      type = "general";
      response = `Hello! I'm your AI Study Assistant. Here's how I can help you with your studies:

**📚 Study Tools I Offer:**
- **Summarize** - Get a summary of your recent academic activity and progress
- **Flashcard** - Generate study flashcards for your enrolled courses
- **Quiz** - Create practice quizzes to test your knowledge
- **Explain** - Get detailed explanations of complex topics
- **Study Plan** - Get a personalized study schedule for your exams

**💡 Quick Tips for Effective Studying:**
1. Use the Pomodoro technique: 25 min focus + 5 min break
2. Active recall beats passive reading - test yourself often
3. Spaced repetition helps retain information longer
4. Teach concepts to others to solidify understanding
5. Take care of your physical health - sleep, exercise, and nutrition matter

**📊 Your Current Status:**
- You're enrolled in 5 courses this semester
- You have 1 pending assignment (Data Structures)
- End-semester exams begin February 15

Just type a message with any of the keywords above (summarize, flashcard, quiz, explain, plan) and I'll provide personalized help for your courses!`;
    }

    return NextResponse.json({ response, type });
  } catch (error) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
