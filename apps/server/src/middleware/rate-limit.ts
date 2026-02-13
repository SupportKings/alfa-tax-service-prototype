/**
 * Rate limiting middleware for Hono
 *
 * Usage:
 * ```typescript
 * import { rateLimiter, createRateLimiter } from '@/middleware/rate-limit';
 *
 * // Default rate limiter (100 requests per minute)
 * app.use('/api/*', rateLimiter());
 *
 * // Custom rate limiter
 * app.use('/api/auth/*', createRateLimiter({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 5, // 5 requests per window
 * }));
 * ```
 */

import type { Context, Next } from "hono";

interface RateLimitOptions {
	/** Time window in milliseconds (default: 60000 = 1 minute) */
	windowMs?: number;
	/** Maximum requests per window (default: 100) */
	max?: number;
	/** Message to return when rate limited */
	message?: string;
	/** Key generator function (default: IP-based) */
	keyGenerator?: (c: Context) => string;
	/** Skip rate limiting for certain requests */
	skip?: (c: Context) => boolean;
	/** Handler called when rate limit is exceeded */
	onRateLimited?: (c: Context, retryAfter: number) => Response;
}

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

// In-memory store (use Redis for distributed systems)
const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of store.entries()) {
		if (entry.resetTime < now) {
			store.delete(key);
		}
	}
}, 60 * 1000); // Cleanup every minute

function getClientIP(c: Context): string {
	// Check common headers for proxied IPs
	const forwarded = c.req.header("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}

	const realIP = c.req.header("x-real-ip");
	if (realIP) {
		return realIP;
	}

	// Fallback to a default identifier
	return "unknown";
}

export function createRateLimiter(options: RateLimitOptions = {}) {
	const {
		windowMs = 60 * 1000,
		max = 100,
		message = "Too many requests, please try again later.",
		keyGenerator = (c: Context) => getClientIP(c),
		skip = () => false,
		onRateLimited,
	} = options;

	return async (c: Context, next: Next) => {
		// Skip rate limiting if skip function returns true
		if (skip(c)) {
			return next();
		}

		const key = keyGenerator(c);
		const now = Date.now();

		let entry = store.get(key);

		if (!entry || entry.resetTime < now) {
			// Create new entry
			entry = {
				count: 0,
				resetTime: now + windowMs,
			};
		}

		entry.count++;
		store.set(key, entry);

		// Add rate limit headers
		const remaining = Math.max(0, max - entry.count);
		const resetSeconds = Math.ceil((entry.resetTime - now) / 1000);

		c.header("X-RateLimit-Limit", String(max));
		c.header("X-RateLimit-Remaining", String(remaining));
		c.header("X-RateLimit-Reset", String(resetSeconds));

		// Check if rate limited
		if (entry.count > max) {
			c.header("Retry-After", String(resetSeconds));

			if (onRateLimited) {
				return onRateLimited(c, resetSeconds);
			}

			return c.json(
				{
					error: "Too Many Requests",
					message,
					retryAfter: resetSeconds,
				},
				429,
			);
		}

		return next();
	};
}

// Default rate limiter (100 requests per minute)
export const rateLimiter = () => createRateLimiter();

// Stricter rate limiter for auth endpoints (5 per 15 minutes)
export const authRateLimiter = () =>
	createRateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 5,
		message: "Too many authentication attempts. Please try again later.",
	});

// Relaxed rate limiter for public endpoints (1000 per minute)
export const publicRateLimiter = () =>
	createRateLimiter({
		windowMs: 60 * 1000,
		max: 1000,
	});
