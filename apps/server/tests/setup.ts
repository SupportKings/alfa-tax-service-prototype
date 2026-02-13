import { vi } from "vitest";

// Mock environment variables for testing
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
process.env.CORS_ORIGIN = "http://localhost:3001";

// Mock database connection for tests
vi.mock("../src/db", () => ({
	db: {
		query: vi.fn(),
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		insert: vi.fn().mockReturnThis(),
		values: vi.fn().mockReturnThis(),
		update: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		returning: vi.fn().mockReturnThis(),
		execute: vi.fn().mockResolvedValue([]),
	},
}));

// Global test utilities
global.testUtils = {
	/**
	 * Creates a mock context for tRPC procedures
	 */
	createMockContext: () => ({
		db: {
			query: vi.fn(),
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
		},
		user: null,
		session: null,
	}),

	/**
	 * Creates an authenticated mock context
	 */
	createAuthenticatedContext: (userId = "test-user-id") => ({
		db: {
			query: vi.fn(),
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
		},
		user: {
			id: userId,
			email: "test@example.com",
			name: "Test User",
		},
		session: {
			id: "test-session-id",
			userId,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		},
	}),
};

// Extend global types
declare global {
	var testUtils: {
		createMockContext: () => {
			db: {
				query: ReturnType<typeof vi.fn>;
				select: ReturnType<typeof vi.fn>;
				from: ReturnType<typeof vi.fn>;
				where: ReturnType<typeof vi.fn>;
			};
			user: null;
			session: null;
		};
		createAuthenticatedContext: (userId?: string) => {
			db: {
				query: ReturnType<typeof vi.fn>;
				select: ReturnType<typeof vi.fn>;
				from: ReturnType<typeof vi.fn>;
				where: ReturnType<typeof vi.fn>;
			};
			user: {
				id: string;
				email: string;
				name: string;
			};
			session: {
				id: string;
				userId: string;
				expiresAt: Date;
			};
		};
	};
}
