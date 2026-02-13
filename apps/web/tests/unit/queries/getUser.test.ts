import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Create mock functions
const mockCookies = vi.fn();
const mockHeaders = vi.fn();
const mockGetSession = vi.fn();

// Mock modules - use inline functions to avoid hoisting issues
vi.mock("next/headers", () => ({
	cookies: vi.fn(() => mockCookies()),
	headers: vi.fn(() => mockHeaders()),
}));

vi.mock("@/lib/auth", () => ({
	auth: {
		api: {
			getSession: vi.fn((...args) => mockGetSession(...args)),
		},
	},
}));

// Import after mocks are set up
import { getUser } from "@/queries/getUser";

describe("getUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("E2E test bypass", () => {
		it("returns mock session when E2E_TEST cookie is true", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "true" }),
			});

			const result = await getUser();

			expect(result).toBeDefined();
			expect(result?.user?.id).toBe("e2e-test-user");
			expect(result?.user?.name).toBe("E2E Test User");
			expect(result?.user?.email).toBe("e2e@test.com");
			expect(result?.user?.role).toBe("admin");
			expect(result?.session?.id).toBe("e2e-test-session");
			expect(result?.session?.userId).toBe("e2e-test-user");
		});

		it("does not call auth.api.getSession when E2E_TEST cookie is true", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "true" }),
			});

			await getUser();

			expect(mockGetSession).not.toHaveBeenCalled();
		});
	});

	describe("normal session retrieval", () => {
		it("calls auth.api.getSession with headers when E2E_TEST cookie is not set", async () => {
			const mockHeadersValue = { authorization: "Bearer token" };
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue(undefined),
			});
			mockHeaders.mockResolvedValue(mockHeadersValue);
			mockGetSession.mockResolvedValue({
				session: { id: "real-session" },
				user: { id: "real-user", name: "Real User" },
			});

			const result = await getUser();

			expect(mockGetSession).toHaveBeenCalledWith({
				headers: mockHeadersValue,
			});
			expect(result?.session?.id).toBe("real-session");
			expect(result?.user?.id).toBe("real-user");
		});

		it("calls auth.api.getSession with headers when E2E_TEST cookie is false", async () => {
			const mockHeadersValue = { authorization: "Bearer token" };
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "false" }),
			});
			mockHeaders.mockResolvedValue(mockHeadersValue);
			mockGetSession.mockResolvedValue({
				session: { id: "session-123" },
				user: { id: "user-123", name: "Test User" },
			});

			const result = await getUser();

			expect(mockGetSession).toHaveBeenCalledWith({
				headers: mockHeadersValue,
			});
			expect(result?.session?.id).toBe("session-123");
		});

		it("returns null when no session exists", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue(undefined),
			});
			mockHeaders.mockResolvedValue({});
			mockGetSession.mockResolvedValue(null);

			const result = await getUser();

			expect(result).toBeNull();
		});

		it("returns session with full user data", async () => {
			const mockSession = {
				session: {
					id: "session-full",
					userId: "user-full",
					expiresAt: new Date("2024-12-31"),
					createdAt: new Date("2024-01-01"),
					updatedAt: new Date("2024-06-15"),
					ipAddress: "192.168.1.1",
					userAgent: "Mozilla/5.0",
					impersonatedBy: null,
				},
				user: {
					id: "user-full",
					name: "Full User",
					email: "full@example.com",
					emailVerified: true,
					image: "https://example.com/avatar.jpg",
					createdAt: new Date("2024-01-01"),
					updatedAt: new Date("2024-06-15"),
					role: "user",
				},
			};

			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue(undefined),
			});
			mockHeaders.mockResolvedValue({});
			mockGetSession.mockResolvedValue(mockSession);

			const result = await getUser();

			expect(result).toEqual(mockSession);
			expect(result?.user?.email).toBe("full@example.com");
			expect(result?.user?.emailVerified).toBe(true);
			expect(result?.session?.ipAddress).toBe("192.168.1.1");
		});
	});

	describe("production environment", () => {
		it("skips E2E bypass entirely in production", async () => {
			vi.stubEnv("NODE_ENV", "production");

			const mockHeadersValue = { authorization: "Bearer token" };
			mockHeaders.mockResolvedValue(mockHeadersValue);
			mockGetSession.mockResolvedValue({
				session: { id: "prod-session" },
				user: { id: "prod-user" },
			});

			// Even with E2E cookie, production should go through normal auth
			// cookies() is still called by the module but E2E branch is skipped
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "true" }),
			});

			const result = await getUser();

			expect(mockGetSession).toHaveBeenCalled();
			expect(result?.session?.id).toBe("prod-session");

			vi.unstubAllEnvs();
		});
	});

	describe("error handling", () => {
		it("propagates errors from auth.api.getSession", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue(undefined),
			});
			mockHeaders.mockResolvedValue({});
			mockGetSession.mockRejectedValue(new Error("Auth service unavailable"));

			await expect(getUser()).rejects.toThrow("Auth service unavailable");
		});

		it("propagates errors from cookies()", async () => {
			mockCookies.mockRejectedValue(new Error("Cookie access denied"));

			await expect(getUser()).rejects.toThrow("Cookie access denied");
		});

		it("propagates errors from headers()", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue(undefined),
			});
			mockHeaders.mockRejectedValue(new Error("Headers access denied"));

			await expect(getUser()).rejects.toThrow("Headers access denied");
		});
	});

	describe("E2E mock session structure", () => {
		it("has correct session structure with all required fields", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "true" }),
			});

			const result = await getUser();

			expect(result?.session).toHaveProperty("id");
			expect(result?.session).toHaveProperty("userId");
			expect(result?.session).toHaveProperty("expiresAt");
			expect(result?.session).toHaveProperty("createdAt");
			expect(result?.session).toHaveProperty("updatedAt");
			expect(result?.session).toHaveProperty("ipAddress");
			expect(result?.session).toHaveProperty("userAgent");
			expect(result?.session).toHaveProperty("impersonatedBy");
		});

		it("has correct user structure with all required fields", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "true" }),
			});

			const result = await getUser();

			expect(result?.user).toHaveProperty("id");
			expect(result?.user).toHaveProperty("name");
			expect(result?.user).toHaveProperty("email");
			expect(result?.user).toHaveProperty("emailVerified");
			expect(result?.user).toHaveProperty("image");
			expect(result?.user).toHaveProperty("createdAt");
			expect(result?.user).toHaveProperty("updatedAt");
			expect(result?.user).toHaveProperty("role");
		});

		it("has session expiry in the future", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "true" }),
			});

			const result = await getUser();

			expect(result?.session?.expiresAt).toBeDefined();
			expect(result?.session?.expiresAt.getTime()).toBeGreaterThan(Date.now());
		});

		it("has emailVerified set to true for E2E user", async () => {
			mockCookies.mockResolvedValue({
				get: vi.fn().mockReturnValue({ value: "true" }),
			});

			const result = await getUser();

			expect(result?.user?.emailVerified).toBe(true);
		});
	});
});
