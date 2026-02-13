import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock getUser before importing useUser
const mockGetUser = vi.fn();
vi.mock("@/queries/getUser", () => ({
	getUser: () => mockGetUser(),
}));

import { useUser } from "@/hooks/useUser";

describe("useUser", () => {
	let queryClient: QueryClient;

	const createWrapper = () => {
		return ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					gcTime: 0,
				},
			},
		});
		mockGetUser.mockReset();
	});

	it("returns loading state initially", () => {
		mockGetUser.mockReturnValue(new Promise(() => {})); // Never resolves

		const { result } = renderHook(() => useUser(), {
			wrapper: createWrapper(),
		});

		expect(result.current.isPending).toBe(true);
		expect(result.current.user).toBeUndefined();
	});

	it("returns user data when authenticated", async () => {
		const mockUser = {
			user: {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
				role: "admin",
			},
		};

		mockGetUser.mockResolvedValue(mockUser);

		const { result } = renderHook(() => useUser(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isPending).toBe(false);
		});

		expect(result.current.user).toEqual(mockUser.user);
		expect(result.current.role).toBe("admin");
	});

	it("returns undefined user when not authenticated", async () => {
		mockGetUser.mockResolvedValue(null);

		const { result } = renderHook(() => useUser(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isPending).toBe(false);
		});

		expect(result.current.user).toBeUndefined();
		expect(result.current.role).toBeUndefined();
	});

	it("extracts role from user session", async () => {
		const mockUser = {
			user: {
				id: "user-123",
				email: "test@example.com",
				name: "Test User",
				role: "agent",
			},
		};

		mockGetUser.mockResolvedValue(mockUser);

		const { result } = renderHook(() => useUser(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(result.current.isPending).toBe(false);
		});

		expect(result.current.role).toBe("agent");
	});

	it("uses correct query key", async () => {
		mockGetUser.mockResolvedValue({ user: { id: "123" } });

		renderHook(() => useUser(), {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(queryClient.getQueryData(["user"])).toBeDefined();
		});
	});
});
