import { db } from "./db";

export async function logSuperAdminAccess(
  userId: string | null,
  action: string,
  success: boolean,
  ipAddress?: string,
  details?: string
) {
  try {
    // Only log if we have a valid institute context
    // For SuperAdmin, we'll use a default institute or create a system log
    const systemLog = {
      userId: userId || undefined,
      instituteId: "system", // You may need to adjust this based on your schema
      action: `SUPERADMIN_${action}`,
      entity: "SuperAdmin",
      entityId: userId || "anonymous",
      details: JSON.stringify({
        success,
        timestamp: new Date().toISOString(),
        ipAddress,
        additionalInfo: details,
      }),
      ipAddress: ipAddress || "unknown",
      createdAt: new Date(),
    };

    // Log to console for now (you can extend this to database)
    console.log("[SUPER ADMIN AUDIT]", systemLog);

    // Optionally save to database if your schema supports it
    // await db.auditLog.create({ data: systemLog });
  } catch (error) {
    console.error("Failed to log super admin access:", error);
  }
}
