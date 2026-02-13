import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type {
	RenderHookOptions,
	RenderHookResult,
} from "@testing-library/react";
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

/**
 * Creates a test QueryClient with optimized settings for testing
 */
export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
				staleTime: 0,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

/**
 * Creates a wrapper component with QueryClientProvider
 */
export function createQueryWrapper(queryClient?: QueryClient) {
	const client = queryClient ?? createTestQueryClient();

	return function QueryWrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={client}>{children}</QueryClientProvider>
		);
	};
}

/**
 * Renders a hook with QueryClient context
 */
export function renderQueryHook<TResult, TProps>(
	hook: (props: TProps) => TResult,
	options?: Omit<RenderHookOptions<TProps>, "wrapper"> & {
		queryClient?: QueryClient;
	},
): RenderHookResult<TResult, TProps> & { queryClient: QueryClient } {
	const queryClient = options?.queryClient ?? createTestQueryClient();
	const wrapper = createQueryWrapper(queryClient);

	const result = renderHook(hook, {
		...options,
		wrapper,
	});

	return { ...result, queryClient };
}

/**
 * Wait for a query to succeed
 */
export async function waitForQuerySuccess<T>(
	result: { current: { isSuccess: boolean; data?: T } },
	timeout = 5000,
): Promise<void> {
	await waitFor(() => expect(result.current.isSuccess).toBe(true), {
		timeout,
	});
}

/**
 * Wait for a query to fail
 */
export async function waitForQueryError(
	result: { current: { isError: boolean } },
	timeout = 5000,
): Promise<void> {
	await waitFor(() => expect(result.current.isError).toBe(true), {
		timeout,
	});
}

/**
 * Wait for a mutation to succeed
 */
export async function waitForMutationSuccess(
	result: { current: { isSuccess: boolean } },
	timeout = 5000,
): Promise<void> {
	await waitFor(() => expect(result.current.isSuccess).toBe(true), {
		timeout,
	});
}

/**
 * Wait for a query to be in pending state
 */
export async function waitForQueryPending(
	result: { current: { isPending: boolean } },
	timeout = 5000,
): Promise<void> {
	await waitFor(() => expect(result.current.isPending).toBe(true), {
		timeout,
	});
}

/**
 * Mock query data for use in tests
 */
export interface MockQueryState<TData, TError = Error> {
	data?: TData;
	error?: TError | null;
	isLoading: boolean;
	isPending: boolean;
	isError: boolean;
	isSuccess: boolean;
	isFetching: boolean;
	status: "pending" | "error" | "success";
}

/**
 * Creates a mock query result in loading state
 */
export function createLoadingQueryState<TData>(): MockQueryState<TData> {
	return {
		data: undefined,
		error: null,
		isLoading: true,
		isPending: true,
		isError: false,
		isSuccess: false,
		isFetching: true,
		status: "pending",
	};
}

/**
 * Creates a mock query result in success state
 */
export function createSuccessQueryState<TData>(
	data: TData,
): MockQueryState<TData> {
	return {
		data,
		error: null,
		isLoading: false,
		isPending: false,
		isError: false,
		isSuccess: true,
		isFetching: false,
		status: "success",
	};
}

/**
 * Creates a mock query result in error state
 */
export function createErrorQueryState<TData, TError = Error>(
	error: TError,
): MockQueryState<TData, TError> {
	return {
		data: undefined,
		error,
		isLoading: false,
		isPending: false,
		isError: true,
		isSuccess: false,
		isFetching: false,
		status: "error",
	};
}

/**
 * Mock mutation state
 */
export interface MockMutationState<
	TData,
	TError = Error,
	TVariables = unknown,
> {
	data?: TData;
	error?: TError | null;
	variables?: TVariables;
	isPending: boolean;
	isError: boolean;
	isSuccess: boolean;
	isIdle: boolean;
	status: "idle" | "pending" | "error" | "success";
	mutate: ReturnType<typeof vi.fn>;
	mutateAsync: ReturnType<typeof vi.fn>;
	reset: ReturnType<typeof vi.fn>;
}

/**
 * Creates a mock mutation result in idle state
 */
export function createIdleMutationState<
	TData,
	TVariables = unknown,
>(): MockMutationState<TData, Error, TVariables> {
	return {
		data: undefined,
		error: null,
		variables: undefined,
		isPending: false,
		isError: false,
		isSuccess: false,
		isIdle: true,
		status: "idle",
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
		reset: vi.fn(),
	};
}

/**
 * Creates a mock mutation result in pending state
 */
export function createPendingMutationState<TData, TVariables = unknown>(
	variables?: TVariables,
): MockMutationState<TData, Error, TVariables> {
	return {
		data: undefined,
		error: null,
		variables,
		isPending: true,
		isError: false,
		isSuccess: false,
		isIdle: false,
		status: "pending",
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
		reset: vi.fn(),
	};
}

/**
 * Creates a mock mutation result in success state
 */
export function createSuccessMutationState<TData, TVariables = unknown>(
	data: TData,
	variables?: TVariables,
): MockMutationState<TData, Error, TVariables> {
	return {
		data,
		error: null,
		variables,
		isPending: false,
		isError: false,
		isSuccess: true,
		isIdle: false,
		status: "success",
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
		reset: vi.fn(),
	};
}

/**
 * Creates a mock mutation result in error state
 */
export function createErrorMutationState<TData, TVariables = unknown>(
	error: Error,
	variables?: TVariables,
): MockMutationState<TData, Error, TVariables> {
	return {
		data: undefined,
		error,
		variables,
		isPending: false,
		isError: true,
		isSuccess: false,
		isIdle: false,
		status: "error",
		mutate: vi.fn(),
		mutateAsync: vi.fn(),
		reset: vi.fn(),
	};
}

/**
 * Creates a deferred promise for testing async operations
 */
export function createDeferredPromise<T>() {
	let resolve: ((value: T) => void) | undefined;
	let reject: ((reason?: unknown) => void) | undefined;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	if (!resolve || !reject) {
		throw new Error("Promise executor did not initialize resolve/reject");
	}

	return {
		promise,
		resolve,
		reject,
	};
}

/**
 * Helper to mock a query function that returns data
 */
export function mockQueryFn<T>(data: T) {
	return vi.fn().mockResolvedValue(data);
}

/**
 * Helper to mock a query function that throws an error
 */
export function mockQueryFnError(error: Error | string) {
	const err = typeof error === "string" ? new Error(error) : error;
	return vi.fn().mockRejectedValue(err);
}
