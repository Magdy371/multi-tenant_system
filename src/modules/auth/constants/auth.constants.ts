/**
 * Auth Module — Shared Constants
 *
 * All magic numbers and string constants used across the auth module
 * are centralized here so they can be maintained in one place.
 */

/** Generic authentication error message — used by validateUser and JWT strategy */
export const GENERIC_AUTH_ERROR = 'Invalid credentials';

/** Maximum failed login attempts before account lockout */
export const MAX_LOGIN_ATTEMPTS = 20;

/** Lockout duration in minutes after too many failed login attempts */
export const LOCKOUT_DURATION_MINUTES = 15;

/** OTP configuration */
export const OTP_CONFIG = {
  /** Number of digits in the OTP */
  length: 6,
  /** OTP validity window in minutes */
  ttlMinutes: 10,
} as const;

/** Cookie configuration for refresh tokens */
export const COOKIE_CONFIG = {
  name: 'refresh_token',
  httpOnly: true,
  secure: true,
  path: '/',
  /** Cookie maxAge in ms (7 days) */
  maxAgeMs: 7 * 24 * 60 * 60 * 1000,
  /** sameSite policy – strict for production, lax for local dev */
  sameSite: (env?: string): 'strict' | 'lax' =>
    env === 'production' || env === 'staging' ? 'strict' : 'lax',
} as const;

/** Redis cache prefixes */
export const CACHE_PREFIXES = {
  REFRESH_TOKEN: 'refresh_token',
  SESSION: 'session',
  ABILITIES: 'user:abilities:',
  ACTIVE_TOKEN: 'active_token',
} as const;

/** Redis cache TTLs (in seconds) */
export const CACHE_TTLS = {
  /** 24 hours */
  ABILITIES: 86400,
  /** 7 days */
  REFRESH_TOKEN: 7 * 24 * 60 * 60,
  /** 1 day */
  ACTIVE_TOKEN: 1 * 24 * 60 * 60,
} as const;
