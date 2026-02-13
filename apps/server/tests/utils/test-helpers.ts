import { vi } from "vitest";

/**
 * Creates a mock Hono context for testing middleware and handlers
 */
export function createMockHonoContext(
	options: {
		method?: string;
		path?: string;
		headers?: Record<string, string>;
		body?: unknown;
	} = {},
) {
	const { method = "GET", path = "/", headers = {}, body } = options;

	return {
		req: {
			method,
			path,
			url: `http://localhost:3000${path}`,
			header: (name: string) => headers[name.toLowerCase()],
			headers: new Headers(headers),
			json: vi.fn().mockResolvedValue(body),
			text: vi.fn().mockResolvedValue(JSON.stringify(body)),
		},
		res: {
			status: 200,
			headers: new Headers(),
		},
		json: vi.fn((data, status = 200) => {
			return new Response(JSON.stringify(data), {
				status,
				headers: { "Content-Type": "application/json" },
			});
		}),
		text: vi.fn((data, status = 200) => {
			return new Response(data, { status });
		}),
		status: vi.fn().mockReturnThis(),
		header: vi.fn().mockReturnThis(),
		set: vi.fn(),
		get: vi.fn(),
	};
}

/**
 * Creates a mock database query builder for testing
 */
export function createMockQueryBuilder<T>(mockData: T[] = []) {
	const builder = {
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		and: vi.fn().mockReturnThis(),
		or: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		offset: vi.fn().mockReturnThis(),
		leftJoin: vi.fn().mockReturnThis(),
		innerJoin: vi.fn().mockReturnThis(),
		groupBy: vi.fn().mockReturnThis(),
		having: vi.fn().mockReturnThis(),
		execute: vi.fn().mockResolvedValue(mockData),
		// biome-ignore lint/suspicious/noThenProperty: intentional thenable mock for query builder compatibility
		then: vi.fn((resolve) => resolve(mockData)),
	};

	return builder;
}

/**
 * Creates a mock insert builder for testing
 */
export function createMockInsertBuilder<T>(returnData: T) {
	return {
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockReturnThis(),
		returning: vi.fn().mockResolvedValue([returnData]),
		onConflictDoNothing: vi.fn().mockReturnThis(),
		onConflictDoUpdate: vi.fn().mockReturnThis(),
	};
}

/**
 * Creates a mock update builder for testing
 */
export function createMockUpdateBuilder<T>(returnData: T) {
	return {
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		returning: vi.fn().mockResolvedValue([returnData]),
	};
}

/**
 * Creates a mock delete builder for testing
 */
export function createMockDeleteBuilder<T>(returnData: T) {
	return {
		delete: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		returning: vi.fn().mockResolvedValue([returnData]),
	};
}

/**
 * Waits for all pending promises to resolve
 */
export async function flushPromises() {
	await new Promise((resolve) => setTimeout(resolve, 0));
}
