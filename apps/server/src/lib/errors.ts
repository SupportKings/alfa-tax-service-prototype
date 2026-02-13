/**
 * Safe error logging utility for the server.
 * NEVER log raw error objects in production — they can contain
 * stack traces, DB connection strings, and sensitive context.
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
		console.error(`[${context}]`, safeError(error));
	} else {
		console.error(`[${context}]`, error);
	}
}
