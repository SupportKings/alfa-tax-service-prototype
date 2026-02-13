import { vi } from "vitest";

/**
 * Mock user object for testing
 */
export interface MockUser {
	id: string;
	email: string;
	name: string | null;
	image: string | null;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Mock session object for testing
 */
export interface MockSession {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
	ipAddress: string | null;
	userAgent: string | null;
}

/**
 * Creates a mock authenticated user for testing
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
	return {
		id: "test-user-id",
		email: "test@example.com",
		name: "Test User",
		image: null,
		emailVerified: true,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		...overrides,
	};
}

/**
 * Creates a mock session for testing
 */
export function createMockSession(
	overrides: Partial<MockSession> = {},
): MockSession {
	return {
		id: "test-session-id",
		userId: "test-user-id",
		token: "test-token",
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		ipAddress: "127.0.0.1",
		userAgent: "test-agent",
		...overrides,
	};
}

/**
 * Creates mock auth hooks for testing
 *
 * @example
 * vi.mock("@/lib/auth-client", () => createMockAuthHooks());
 */
export function createMockAuthHooks(
	options: {
		isAuthenticated?: boolean;
		user?: MockUser | null;
		session?: MockSession | null;
	} = {},
) {
	const {
		isAuthenticated = true,
		user = isAuthenticated ? createMockUser() : null,
		session = isAuthenticated ? createMockSession() : null,
	} = options;

	return {
		useSession: vi.fn().mockReturnValue({
			data: isAuthenticated ? { user, session } : null,
			isPending: false,
			error: null,
		}),
		signIn: {
			email: vi.fn().mockResolvedValue({ error: null }),
		},
		signOut: vi.fn().mockResolvedValue({ error: null }),
		authClient: {
			signIn: {
				email: vi.fn().mockResolvedValue({ error: null }),
			},
			signOut: vi.fn().mockResolvedValue({ error: null }),
			useSession: vi.fn().mockReturnValue({
				data: isAuthenticated ? { user, session } : null,
				isPending: false,
				error: null,
			}),
		},
	};
}

/**
 * Helper to mock unauthenticated state
 */
export function mockUnauthenticated() {
	return createMockAuthHooks({ isAuthenticated: false });
}

/**
 * Helper to mock authenticated state with custom user
 */
export function mockAuthenticated(userOverrides: Partial<MockUser> = {}) {
	const user = createMockUser(userOverrides);
	const session = createMockSession({ userId: user.id });
	return createMockAuthHooks({ isAuthenticated: true, user, session });
}
