/**
 * Security utilities for protecting sensitive routes and data
 */

import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
 * Verify SuperAdmin access with enhanced security
 */
export async function verifySuperAdminAccess(request: NextRequest): Promise<{
  authorized: boolean;
  userId?: string;
  email?: string;
  error?: string;
}> {
  try {
    // Get authentication token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return { authorized: false, error: 'Unauthorized - No token' };
    }

    // Verify SuperAdmin role
    if (token.role !== 'SuperAdmin') {
      // Log unauthorized access attempt
      console.warn(`[SECURITY] Unauthorized SuperAdmin access attempt:`, {
        userId: token.userId,
        email: token.email,
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
        email: token.email,
        resetTime: new Date(rateCheck.resetTime).toISOString(),
      });
      return { authorized: false, error: 'Rate limit exceeded' };
    }

    return {
      authorized: true,
      userId: token.userId as string,
      email: token.email as string,
    };
  } catch (error) {
    console.error('[SECURITY] Error verifying SuperAdmin access:', error);
    return { authorized: false, error: 'Internal security error' };
  }
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
