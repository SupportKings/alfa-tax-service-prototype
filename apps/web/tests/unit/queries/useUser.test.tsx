import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Create a mock function that will be referenced in the mock
const mockGetUserFn = vi.fn();

// Mock the getUser server action
vi.mock("@/queries/getUser", () => ({
	getUser: (...args: unknown[]) => mockGetUserFn(...args),
}));

// Import after mocks are set up
import { useUser } from "@/queries/useUser";

function createTestQueryClient() {
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

function createWrapper(queryClient?: QueryClient) {
	const client = queryClient ?? createTestQueryClient();
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={client}>{children}</QueryClientProvider>
		);
	};
}

describe("useUser", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("initial state", () => {
		it("starts in loading state", () => {
			mockGetUserFn.mockReturnValue(new Promise(() => {})); // Never resolving promise

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			expect(result.current.isLoading).toBe(true);
			expect(result.current.data).toBeUndefined();
			expect(result.current.error).toBeNull();
		});
	});

	describe("successful data fetching", () => {
		it("returns user data on success", async () => {
			const mockUserData = {
				session: {
					id: "session-123",
					userId: "user-123",
					expiresAt: new Date("2024-12-31"),
				},
				user: {
					id: "user-123",
					name: "Test User",
					email: "test@example.com",
					emailVerified: true,
					role: "user",
				},
			};

			mockGetUserFn.mockResolvedValue(mockUserData);

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data).toEqual(mockUserData);
			expect(result.current.error).toBeNull();
		});

		it("returns null when user is not authenticated", async () => {
			mockGetUserFn.mockResolvedValue(null);

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data).toBeNull();
			expect(result.current.error).toBeNull();
		});

		it("returns admin user data correctly", async () => {
			const mockAdminData = {
				session: {
					id: "admin-session",
					userId: "admin-user",
				},
				user: {
					id: "admin-user",
					name: "Admin User",
					email: "admin@example.com",
					role: "admin",
				},
			};

			mockGetUserFn.mockResolvedValue(mockAdminData);

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data?.user?.role).toBe("admin");
		});
	});

	describe("error handling", () => {
		it("handles errors from getUser", async () => {
			const testError = new Error("Failed to fetch user");
			mockGetUserFn.mockRejectedValue(testError);

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.error).toEqual(testError);
			expect(result.current.data).toBeUndefined();
		});

		it("handles network errors", async () => {
			const networkError = new Error("Network request failed");
			mockGetUserFn.mockRejectedValue(networkError);

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.error?.message).toBe("Network request failed");
		});

		it("handles auth service errors", async () => {
			const authError = new Error("Auth service unavailable");
			mockGetUserFn.mockRejectedValue(authError);

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.error?.message).toBe("Auth service unavailable");
		});
	});

	describe("query behavior", () => {
		it("uses 'user' as the query key", async () => {
			mockGetUserFn.mockResolvedValue({ user: { id: "1" } });

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			const queryState = queryClient.getQueryState(["user"]);
			expect(queryState).toBeDefined();
			expect(queryState?.status).toBe("success");
		});

		it("calls getUser function", async () => {
			mockGetUserFn.mockResolvedValue({ user: { id: "1" } });

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(mockGetUserFn).toHaveBeenCalled();
		});

		it("caches the result", async () => {
			mockGetUserFn.mockResolvedValue({ user: { id: "1" } });

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			const cachedData = queryClient.getQueryData(["user"]);
			expect(cachedData).toEqual({ user: { id: "1" } });
		});
	});

	describe("return value structure", () => {
		it("returns data, isLoading, and error properties", async () => {
			mockGetUserFn.mockResolvedValue({ user: { id: "1" } });

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			// Check that the hook returns the expected shape
			expect(result.current).toHaveProperty("data");
			expect(result.current).toHaveProperty("isLoading");
			expect(result.current).toHaveProperty("error");
		});

		it("isLoading transitions from true to false on success", async () => {
			mockGetUserFn.mockResolvedValue({ user: { id: "1" } });

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			// Initially loading
			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			// After success, not loading
			expect(result.current.isLoading).toBe(false);
		});

		it("isLoading transitions from true to false on error", async () => {
			mockGetUserFn.mockRejectedValue(new Error("Failed"));

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			// Initially loading
			expect(result.current.isLoading).toBe(true);

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			// After error, not loading
			expect(result.current.isLoading).toBe(false);
		});
	});

	describe("E2E user data", () => {
		it("handles E2E mock session data", async () => {
			const e2eMockSession = {
				session: {
					id: "e2e-test-session",
					userId: "e2e-test-user",
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
					createdAt: new Date(),
					updatedAt: new Date(),
					ipAddress: "127.0.0.1",
					userAgent: "Playwright",
					impersonatedBy: null,
				},
				user: {
					id: "e2e-test-user",
					name: "E2E Test User",
					email: "e2e@test.com",
					emailVerified: true,
					image: null,
					createdAt: new Date(),
					updatedAt: new Date(),
					role: "admin",
				},
			};

			mockGetUserFn.mockResolvedValue(e2eMockSession);

			const { result } = renderHook(() => useUser(), {
				wrapper: createWrapper(queryClient),
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.data?.user?.id).toBe("e2e-test-user");
			expect(result.current.data?.user?.name).toBe("E2E Test User");
			expect(result.current.data?.user?.email).toBe("e2e@test.com");
			expect(result.current.data?.user?.role).toBe("admin");
			expect(result.current.data?.session?.userAgent).toBe("Playwright");
		});
	});
});
