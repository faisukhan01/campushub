/**
 * Security utilities for protecting sensitive routes and data
 */

import { NextRequest } from 'next/server';

// ─── Middleware-injected auth context ────────────────────────────────────────

/**
 * Read the authenticated user context that the middleware (proxy.ts) injected
 * into the request headers after verifying the per-tab JWT (or NextAuth cookie).
 *
 * Route handlers MUST use this instead of calling getToken() / getServerSession()
 * directly.  By the time a handler runs, the middleware has already:
 *   1. Verified the Authorization: Bearer <tab-jwt> header (or cookie fallback)
 *   2. Written the verified identity into x-user-* request headers
 *
 * Those headers cannot be spoofed by the client because the middleware
 * overwrites them with values it derives from the verified JWT.
 *
 * Returns null only if the route somehow bypassed the middleware (shouldn't
 * happen for any route under /api/ except /api/auth/*).
 */
export function getRouteToken(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const role   = request.headers.get('x-user-role');

  if (!userId || !role) return null;

  return {
    userId,
    role,
    sub: userId,                                                   // NextAuth-compat alias
    instituteId: request.headers.get('x-user-institute-id') || undefined,
    branchId:    request.headers.get('x-user-branch-id')    || undefined,
  };
}

// ─── SuperAdmin access helper ─────────────────────────────────────────────────

/**
 * Rate limiting store (in-memory for development, use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiter to prevent brute force attacks
 * @param identifier - Unique identifier (IP address or user ID)
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Verify SuperAdmin access with enhanced security.
 *
 * Reads the verified identity from middleware-injected headers — no cookie
 * or re-verification needed, since the middleware already validated the JWT.
 */
export function verifySuperAdminAccess(request: NextRequest): {
  authorized: boolean;
  userId?: string;
  email?: string;
  error?: string;
} {
  const token = getRouteToken(request);

  if (!token) {
    return { authorized: false, error: 'Unauthorized - No session' };
  }

  if (token.role !== 'SuperAdmin') {
    console.warn(`[SECURITY] Unauthorized SuperAdmin access attempt:`, {
      userId: token.userId,
      role: token.role,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      timestamp: new Date().toISOString(),
    });
    return { authorized: false, error: 'Forbidden - Insufficient permissions' };
  }

  // Rate limiting for SuperAdmin actions
  const identifier = `superadmin_${token.userId}`;
  const rateCheck = rateLimit(identifier, 100, 60 * 1000); // 100 requests per minute

  if (!rateCheck.allowed) {
    console.warn(`[SECURITY] Rate limit exceeded for SuperAdmin:`, {
      userId: token.userId,
      resetTime: new Date(rateCheck.resetTime).toISOString(),
    });
    return { authorized: false, error: 'Rate limit exceeded' };
  }

  return { authorized: true, userId: token.userId };
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;]/g, '') // Remove semicolons
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Log security events
 */
export function logSecurityEvent(event: {
  type: 'login' | 'logout' | 'access_denied' | 'suspicious_activity' | 'data_access';
  userId?: string;
  email?: string;
  ip?: string;
  details?: string;
}) {
  console.log(`[SECURITY EVENT] ${event.type.toUpperCase()}`, {
    ...event,
    timestamp: new Date().toISOString(),
  });
}
