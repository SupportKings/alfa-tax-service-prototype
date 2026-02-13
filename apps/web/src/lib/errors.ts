/**
 * Safe error logging utility.
 * NEVER log raw error objects — they can contain stack traces,
 * DB connection strings, and sensitive context.
 *
 * Usage:
 *   import { safeError, logError } from "@/lib/errors";
 *
 *   try { ... } catch (error) {
 *     logError("createClient", error);
 *     return { success: false, error: safeError(error) };
 *   }
 */

/** Extract a safe, user-facing message from any error */
export function safeError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "An unexpected error occurred";
}

/** Log error with context but without leaking sensitive details in production */
export function logError(context: string, error: unknown): void {
	if (process.env.NODE_ENV === "production") {
		// Production: log only the message, not the full stack
		console.error(`[${context}]`, safeError(error));
	} else {
		// Development: log everything for debugging
		console.error(`[${context}]`, error);
	}
}
