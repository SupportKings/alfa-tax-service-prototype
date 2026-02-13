import { describe, expect, it, vi } from "vitest";

interface MockedProcedure {
	handler: (...args: unknown[]) => unknown;
}

// Mock the tRPC setup before importing the router
vi.mock("../../../src/lib/trpc", () => {
	const createChain = () => ({
		query: vi.fn((handler) => ({
			_def: { query: true },
			handler,
		})),
		mutation: vi.fn((handler) => ({
			_def: { mutation: true },
			handler,
		})),
		input: vi.fn(() => createChain()),
	});

	return {
		publicProcedure: createChain(),
		router: vi.fn((routes) => routes),
	};
});

describe("appRouter", () => {
	it("healthCheck returns OK", async () => {
		// Import after mocking
		const { appRouter } = await import("../../../src/routers/index");

		// Access the handler directly from the mocked structure
		const healthCheck = appRouter.healthCheck as unknown as MockedProcedure;
		const result = healthCheck.handler();

		expect(result).toBe("OK");
	});

	it("getUser returns null when not authenticated", async () => {
		const { appRouter } = await import("../../../src/routers/index");

		const getUser = appRouter.getUser as unknown as MockedProcedure;
		const mockCtx = {};
		const result = await getUser.handler({ ctx: mockCtx });

		expect(result).toBeNull();
	});
});
