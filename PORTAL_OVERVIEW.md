# CampusHub - School Management Portal

## Overview

CampusHub is a professional B2B SaaS platform designed specifically for schools, academies, and educational institutes. The platform enables efficient management of students, teachers, courses, attendance, marks, and administrative operations.

## User Roles & Hierarchy

### 1. **Super Admin (Platform Owner)**
- **You** - The platform owner
- **Access**: Complete platform oversight
- **Capabilities**:
  - Track all institutes using the portal
  - Monitor all branches across institutes
  - View total teachers and students
  - Track login analytics and system health
  - Manage subscriptions and billing
  - Platform-wide analytics and reporting

### 2. **Institute Admin (Main Campus)**
- **Who**: Major educational institutions that purchase the portal
- **Access**: All branches under their institute
- **Capabilities**:
  - Manage multiple branches
  - Provide portal access to sub-branches
  - View consolidated reports across branches
  - Manage institute-level settings
  - Monitor fee collection and performance
  - Assign branch administrators

### 3. **Branch Admin (Sub-Branch)**
- **Who**: Individual school branches/campuses
- **Access**: Their specific branch only
- **Capabilities**:
  - Add and manage students
  - Add and manage teachers
  - Assign courses to teachers
  - Assign courses to students
  - Manage class sections (e.g., Class 10-A, 10-B)
  - View branch-specific reports
  - Monitor attendance and fee collection

### 4. **Teacher**
- **Who**: Teaching staff
- **Access**: Their assigned classes/sections only
- **Capabilities**:
  - View assigned sections (e.g., Class 10-A, Class 9-B)
  - Mark attendance for each section
  - Upload course materials (PDFs, videos, documents)
  - Enter marks/grades for students
  - Post announcements to students
  - View student performance
  - Manage assignments and quizzes

### 5. **Student**
- **Who**: Enrolled students
- **Access**: Their own academic data only
- **Capabilities**:
  - View subject cards on dashboard
  - Check attendance percentage
  - View marks and results
  - Access course materials
  - View upcoming quizzes and tests
  - Read announcements from teachers
  - View diary entries (homework, notes)
  - Check fee ledger

## Key Features

### For Students
- **Dashboard**: Clean subject cards showing all enrolled courses
- **Attendance Tracking**: Overall and subject-wise attendance percentage
- **Marks System**: View marks (no GPA - marks-based system)
- **Course Materials**: Access PDFs, videos, and documents uploaded by teachers
- **Announcements**: Receive important updates from teachers
- **Diary**: View daily topics, homework, and notes
- **Upcoming Events**: See quizzes, tests, and exams

### For Teachers
- **Section Management**: Manage multiple sections (e.g., Class 10-A, 10-B, 9-A, 9-B)
- **Attendance Marking**: Mark attendance for each section separately
- **Material Upload**: Upload course materials for students
- **Marks Entry**: Enter marks for assignments, quizzes, and tests
- **Announcements**: Post announcements to specific sections
- **Student Overview**: View student performance and attendance

### For Branch Admin
- **Student Management**: Enroll students and assign them to classes
- **Teacher Management**: Add teachers and assign them courses
- **Course Assignment**: Assign subjects to both teachers and students
- **Class Organization**: Manage class levels and sections
- **Reports**: View branch-specific performance reports
- **Fee Management**: Track fee collection and pending payments

### For Institute Admin
- **Branch Overview**: Monitor all branches under the institute
- **Consolidated Reports**: View institute-wide analytics
- **User Management**: Manage branch admins and access control
- **Performance Tracking**: Compare branch performance
- **Fee Collection**: Monitor fee collection across branches

### For Super Admin
- **Institute Tracking**: Monitor all institutes using the platform
- **Login Analytics**: Track active users and login patterns
- **System Health**: Monitor platform performance and uptime
- **Subscription Management**: Manage institute subscriptions
- **Platform Analytics**: View growth trends and usage statistics

## School Subjects Supported

The platform is designed for school and college students with the following subjects:

- **English**
- **Mathematics**
- **Physics**
- **Chemistry**
- **Biology**
- **Islamiat**
- **Quran**
- **Pakistan Studies**
- **Urdu**
- **Computer Science**

Each subject has:
- Unique icon and color coding
- Dedicated course materials section
- Attendance tracking
- Marks/grades management
- Announcements and diary

## Technical Architecture

### Frontend
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Animations**: Framer Motion

### Backend
- **Database**: SQLite (via Prisma ORM)
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js (ready for implementation)

### Key Technologies
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Database Schema Highlights

### User Model
- Supports all 5 roles (SuperAdmin, InstituteAdmin, BranchAdmin, Teacher, Student)
- Institute and branch associations
- Employee ID for teachers
- Roll number and section for students

### Course Model
- Subject-based (not credit-based)
- Class level and section support
- Icon and color for visual identification
- Teacher and student assignments

### Attendance System
- Session-based attendance
- Support for Present, Absent, Late, Excused
- Course-wise and overall tracking

### Marks System
- Marks-based (not GPA)
- Support for quizzes, tests, and exams
- Assignment submissions and grading

## Design Philosophy

### B2B SaaS Focused
- Professional, clean interface
- Minimal but essential features
- Scalable for multiple institutes
- Role-based access control
- Subscription-based model

### School-Centric
- Designed for K-12 and college students
- Marks-based assessment (no GPA)
- Section-based class organization
- Subject cards for easy navigation
- Diary and homework tracking

### User Experience
- Intuitive dashboards for each role
- Quick access to frequently used features
- Visual subject identification (icons + colors)
- Responsive design for all devices
- Dark mode support

## Sample Data

The portal includes comprehensive mock data for demonstration:
- 8 subjects for students (Class 10-A)
- 4 sections for teachers (Class 10-A, 10-B, 9-A, 9-B)
- 4 institutes for super admin
- Attendance records, marks, and materials
- Announcements and diary entries

## Getting Started

### Installation
```bash
npm install
# or
bun install
```

### Database Setup
```bash
npm run db:push
npm run db:generate
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm run start
```

## Role-Based Navigation

Each role has a customized navigation menu:

**Super Admin**: Institutes, Branches, Users, Subscriptions, Analytics, Reports, Settings

**Institute Admin**: Branches, Users, Courses, Fee Management, Reports, Announcements, Settings

**Branch Admin**: Students, Teachers, Courses, Attendance, Fees, Timetable, Announcements, Reports, Settings

**Teacher**: My Classes, Mark Attendance, Assignments, Enter Marks, My Students, My Schedule, Announcements, Messages

**Student**: My Subjects, Assignments, My Marks, My Attendance, My Schedule, Fee Ledger, Announcements, Messages

## Future Enhancements

- Real-time notifications
- Mobile app (React Native)
- Parent portal (optional)
- Online exam system
- Video conferencing integration
- SMS/Email notifications
- Advanced analytics and AI insights
- Multi-language support

## Support

For questions or support, contact the platform owner (Super Admin).

---

**Built with ❤️ for schools, academies, and educational institutes**
