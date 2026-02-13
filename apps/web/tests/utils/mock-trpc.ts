import { vi } from "vitest";

/**
 * Creates a mock tRPC client for testing
 * Use this to mock tRPC queries and mutations in your tests
 *
 * @example
 * const mockTrpc = createMockTrpcClient({
 *   users: {
 *     list: vi.fn().mockResolvedValue([{ id: "1", name: "Test User" }]),
 *     create: vi.fn().mockResolvedValue({ id: "2", name: "New User" }),
 *   },
 * });
 */
export function createMockTrpcClient<T extends Record<string, unknown>>(
	procedures: T,
): T {
	return procedures;
}

/**
 * Creates a mock query result for React Query
 *
 * @example
 * const mockResult = createMockQueryResult({ data: [{ id: "1" }] });
 */
export function createMockQueryResult<T>(options: {
	data?: T;
	error?: Error | null;
	isLoading?: boolean;
	isError?: boolean;
	isSuccess?: boolean;
	isFetching?: boolean;
}) {
	return {
		data: options.data ?? undefined,
		error: options.error ?? null,
		isLoading: options.isLoading ?? false,
		isError: options.isError ?? false,
		isSuccess: options.isSuccess ?? true,
		isFetching: options.isFetching ?? false,
		isPending: options.isLoading ?? false,
		status: options.isLoading
			? "pending"
			: options.isError
				? "error"
				: "success",
		refetch: vi.fn(),
		fetchStatus: options.isFetching ? "fetching" : "idle",
	};
}

/**
 * Creates a mock mutation result for React Query
 *
 * @example
 * const mockMutation = createMockMutationResult();
 */
export function createMockMutationResult<TData = unknown, TError = Error>() {
	return {
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
		data: undefined as TData | undefined,
		error: null as TError | null,
		isLoading: false,
		isPending: false,
		isError: false,
		isSuccess: false,
		isIdle: true,
		status: "idle" as const,
		reset: vi.fn(),
	};
}
