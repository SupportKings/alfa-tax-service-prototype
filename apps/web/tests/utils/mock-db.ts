import { vi } from "vitest";

/**
 * Mock Supabase client response type
 */
export interface MockSupabaseResponse<T> {
	data: T | null;
	error: { message: string; code?: string } | null;
	count?: number | null;
}

/**
 * Mock Supabase query builder
 */
export interface MockQueryBuilder<_T> {
	select: ReturnType<typeof vi.fn>;
	insert: ReturnType<typeof vi.fn>;
	update: ReturnType<typeof vi.fn>;
	delete: ReturnType<typeof vi.fn>;
	eq: ReturnType<typeof vi.fn>;
	neq: ReturnType<typeof vi.fn>;
	in: ReturnType<typeof vi.fn>;
	is: ReturnType<typeof vi.fn>;
	not: ReturnType<typeof vi.fn>;
	ilike: ReturnType<typeof vi.fn>;
	like: ReturnType<typeof vi.fn>;
	or: ReturnType<typeof vi.fn>;
	order: ReturnType<typeof vi.fn>;
	range: ReturnType<typeof vi.fn>;
	limit: ReturnType<typeof vi.fn>;
	single: ReturnType<typeof vi.fn>;
	maybeSingle: ReturnType<typeof vi.fn>;
	// Terminal methods that return promises
	then: ReturnType<typeof vi.fn>;
}

/**
 * Creates a chainable mock query builder for Supabase
 */
export function createMockQueryBuilder<T>(
	response: MockSupabaseResponse<T>,
): MockQueryBuilder<T> {
	const builder: MockQueryBuilder<T> = {
		select: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		neq: vi.fn().mockReturnThis(),
		in: vi.fn().mockReturnThis(),
		is: vi.fn().mockReturnThis(),
		not: vi.fn().mockReturnThis(),
		ilike: vi.fn().mockReturnThis(),
		like: vi.fn().mockReturnThis(),
		or: vi.fn().mockReturnThis(),
		order: vi.fn().mockReturnThis(),
		range: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		single: vi.fn().mockResolvedValue(response),
		maybeSingle: vi.fn().mockResolvedValue(response),
		// biome-ignore lint/suspicious/noThenProperty: needed for Promise-like interface
		then: vi.fn((resolveCallback) => resolveCallback(response)),
	};

	// Make all chainable methods return the builder for chaining
	for (const key of Object.keys(builder) as Array<keyof MockQueryBuilder<T>>) {
		if (key !== "single" && key !== "maybeSingle" && key !== "then") {
			(builder[key] as ReturnType<typeof vi.fn>).mockReturnValue(builder);
		}
	}

	return builder;
}

/**
 * Creates a mock Supabase client for testing server actions
 */
export function createMockSupabaseClient() {
	const queryBuilders = new Map<string, MockQueryBuilder<unknown>>();

	const from = vi.fn((table: string) => {
		if (!queryBuilders.has(table)) {
			// Default to empty response
			queryBuilders.set(
				table,
				createMockQueryBuilder({ data: null, error: null }),
			);
		}
		const builder = queryBuilders.get(table);
		if (!builder) {
			throw new Error(`Query builder not found for table: ${table}`);
		}
		return builder;
	});

	return {
		from,
		/**
		 * Set mock response for a specific table
		 */
		setTableResponse: <T>(table: string, response: MockSupabaseResponse<T>) => {
			queryBuilders.set(table, createMockQueryBuilder(response));
		},
		/**
		 * Get the query builder for a specific table (for assertions)
		 */
		getTableBuilder: (table: string) => queryBuilders.get(table),
		/**
		 * Reset all mocks
		 */
		reset: () => {
			queryBuilders.clear();
			from.mockClear();
		},
	};
}

/**
 * Type for the mock Supabase client
 */
export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;

/**
 * Helper to create a successful response
 */
export function mockDbSuccess<T>(
	data: T,
	count?: number,
): MockSupabaseResponse<T> {
	return { data, error: null, count };
}

/**
 * Helper to create an error response
 */
export function mockDbError<T = null>(
	message: string,
	code?: string,
): MockSupabaseResponse<T> {
	return { data: null, error: { message, code } };
}

/**
 * Helper to create a not found response (for .single() queries)
 */
export function mockDbNotFound<T = null>(): MockSupabaseResponse<T> {
	return { data: null, error: { message: "Row not found", code: "PGRST116" } };
}

/**
 * Mock the @/utils/supabase/server module
 *
 * @example
 * ```typescript
 * const mockClient = createMockSupabaseClient();
 * vi.mock("@/utils/supabase/server", () => mockSupabaseServerModule(mockClient));
 * ```
 */
export function mockSupabaseServerModule(mockClient: MockSupabaseClient) {
	return {
		createClient: vi.fn().mockResolvedValue(mockClient),
	};
}

/**
 * Creates mock data for database records with common fields
 */
export function createMockDbRecord(overrides: Record<string, unknown> = {}) {
	return {
		id: "test-uuid-1234",
		created_at: new Date("2024-01-01").toISOString(),
		updated_at: new Date("2024-01-01").toISOString(),
		is_deleted: false,
		deleted_at: null,
		...overrides,
	};
}
