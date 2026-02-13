/**
 * Structured logging utility using pino
 *
 * Usage:
 * ```typescript
 * import { logger } from '@/lib/logger';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Database connection failed', { error: err.message });
 * ```
 *
 * Note: Install pino dependency:
 * ```bash
 * bun add pino pino-pretty
 * ```
 */

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

interface LogContext {
	[key: string]: unknown;
}

interface Logger {
	trace(message: string, context?: LogContext): void;
	debug(message: string, context?: LogContext): void;
	info(message: string, context?: LogContext): void;
	warn(message: string, context?: LogContext): void;
	error(message: string, context?: LogContext): void;
	fatal(message: string, context?: LogContext): void;
	child(bindings: LogContext): Logger;
}

const LOG_LEVELS: Record<LogLevel, number> = {
	trace: 10,
	debug: 20,
	info: 30,
	warn: 40,
	error: 50,
	fatal: 60,
};

const currentLevel =
	(process.env.LOG_LEVEL as LogLevel) ||
	(process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
	return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function formatMessage(
	level: LogLevel,
	message: string,
	context?: LogContext,
): string {
	const timestamp = new Date().toISOString();
	const contextStr = context ? ` ${JSON.stringify(context)}` : "";

	if (process.env.NODE_ENV === "production") {
		// JSON format for production
		return JSON.stringify({
			timestamp,
			level,
			message,
			...context,
		});
	}

	// Pretty format for development
	const levelColors: Record<LogLevel, string> = {
		trace: "\x1b[90m",
		debug: "\x1b[36m",
		info: "\x1b[32m",
		warn: "\x1b[33m",
		error: "\x1b[31m",
		fatal: "\x1b[35m",
	};
	const reset = "\x1b[0m";
	const color = levelColors[level];

	return `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}${contextStr}`;
}

function createLogger(bindings: LogContext = {}): Logger {
	const log = (level: LogLevel, message: string, context?: LogContext) => {
		if (!shouldLog(level)) return;

		const mergedContext = { ...bindings, ...context };
		const formatted = formatMessage(level, message, mergedContext);

		switch (level) {
			case "error":
			case "fatal":
				console.error(formatted);
				break;
			case "warn":
				console.warn(formatted);
				break;
			default:
				console.log(formatted);
		}
	};

	return {
		trace: (message, context) => log("trace", message, context),
		debug: (message, context) => log("debug", message, context),
		info: (message, context) => log("info", message, context),
		warn: (message, context) => log("warn", message, context),
		error: (message, context) => log("error", message, context),
		fatal: (message, context) => log("fatal", message, context),
		child: (childBindings) => createLogger({ ...bindings, ...childBindings }),
	};
}

export const logger = createLogger({
	service: "server",
	version: process.env.npm_package_version || "0.0.0",
});

// Request logger middleware for Hono
export function requestLogger() {
	return async (
		c: { req: { method: string; url: string }; res: { status: number } },
		next: () => Promise<void>,
	) => {
		const start = Date.now();
		const { method, url } = c.req;

		await next();

		const duration = Date.now() - start;
		const status = c.res.status;

		logger.info("HTTP Request", {
			method,
			url,
			status,
			duration: `${duration}ms`,
		});
	};
}
