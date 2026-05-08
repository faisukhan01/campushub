#!/usr/bin/env node

/**
 * Clear Dummy Data Script
 * 
 * This script removes all dummy/seed data from the database while preserving:
 * - SuperAdmin users (if any exist)
 * - Database structure/schema
 * 
 * Usage: node scripts/clear-dummy-data.mjs
 */

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Step 1: Identify SuperAdmin users to preserve
    console.log('🔍 Checking for SuperAdmin users...');
    const superAdmins = await db.user.findMany({
      where: { role: 'SuperAdmin' }
    });
    
    const superAdminIds = superAdmins.map(u => u.id);
    console.log(`   Found ${superAdmins.length} SuperAdmin user(s) to preserve`);
    if (superAdmins.length > 0) {
      superAdmins.forEach(admin => {
        console.log(`   - ${admin.name} (${admin.email})`);
      });
    }
    console.log('');

    // Step 2: Delete all data in reverse dependency order
    console.log('🗑️  Deleting dummy data...\n');

    // Delete dependent records first
    console.log('   Deleting grades...');
    await db.grade.deleteMany();
    
    console.log('   Deleting quiz attempts...');
    await db.quizAttempt.deleteMany();
    
    console.log('   Deleting assessment questions...');
    await db.assessmentQuestion.deleteMany();
    
    console.log('   Deleting assessments...');
    await db.assessment.deleteMany();
    
    console.log('   Deleting assignment comments...');
    await db.assignmentComment.deleteMany();
    
    console.log('   Deleting submissions...');
    await db.submission.deleteMany();
    
    console.log('   Deleting assignments...');
    await db.assignment.deleteMany();
    
    console.log('   Deleting attendance records...');
    await db.attendanceRecord.deleteMany();
    
    console.log('   Deleting attendance sessions...');
    await db.attendanceSession.deleteMany();
    
    console.log('   Deleting timetable slots...');
    await db.timetableSlot.deleteMany();
    
    console.log('   Deleting course lessons...');
    await db.courseLesson.deleteMany();
    
    console.log('   Deleting course modules...');
    await db.courseModule.deleteMany();
    
    console.log('   Deleting enrollments...');
    await db.enrollment.deleteMany();
    
    console.log('   Deleting course teachers...');
    await db.courseTeacher.deleteMany();
    
    console.log('   Deleting courses...');
    await db.course.deleteMany();
    
    console.log('   Deleting messages...');
    await db.message.deleteMany();
    
    console.log('   Deleting notifications...');
    await db.notification.deleteMany();
    
    console.log('   Deleting fee payments...');
    await db.feePayment.deleteMany();
    
    console.log('   Deleting fee invoices...');
    await db.feeInvoice.deleteMany();
    
    console.log('   Deleting fee structures...');
    await db.feeStructure.deleteMany();
    
    console.log('   Deleting leave requests...');
    await db.leaveRequest.deleteMany();
    
    console.log('   Deleting support tickets...');
    await db.supportTicket.deleteMany();
    
    console.log('   Deleting document requests...');
    await db.documentRequest.deleteMany();
    
    console.log('   Deleting announcements...');
    await db.announcement.deleteMany();
    
    console.log('   Deleting audit logs...');
    await db.auditLog.deleteMany();
    
    console.log('   Deleting subscriptions...');
    await db.subscription.deleteMany();
    
    // Delete users except SuperAdmins
    console.log('   Deleting non-SuperAdmin users...');
    const deletedUsers = await db.user.deleteMany({
      where: {
        role: { not: 'SuperAdmin' }
      }
    });
    console.log(`   Deleted ${deletedUsers.count} user(s)`);
    
    console.log('   Deleting batches...');
    await db.batch.deleteMany();
    
    console.log('   Deleting programs...');
    await db.program.deleteMany();
    
    console.log('   Deleting terms...');
    await db.term.deleteMany();
    
    console.log('   Deleting academic years...');
    await db.academicYear.deleteMany();
    
    console.log('   Deleting departments...');
    await db.department.deleteMany();
    
    console.log('   Deleting branches...');
    await db.branch.deleteMany();
    
    console.log('   Deleting institutes...');
    await db.institute.deleteMany();

    console.log('\n✅ Database cleanup completed successfully!\n');
    
    // Step 3: Show summary
    console.log('📊 Summary:');
    console.log(`   - All dummy data has been removed`);
    console.log(`   - ${superAdmins.length} SuperAdmin user(s) preserved`);
    console.log(`   - Database schema intact`);
    console.log(`   - System ready for real data\n`);

    if (superAdmins.length === 0) {
      console.log('⚠️  WARNING: No SuperAdmin users found!');
      console.log('   You may want to create a SuperAdmin user using:');
      console.log('   node scripts/seed-superadmin.mjs\n');
    }

  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
