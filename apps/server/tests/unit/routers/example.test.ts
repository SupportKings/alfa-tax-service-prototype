/**
 * Example CRUD Router Tests
 *
 * Copy this file when creating tests for a new feature router.
 * Tests should be written BEFORE the router (TDD).
 *
 * Pattern:
 * 1. Mock tRPC setup
 * 2. Import router after mocking
 * 3. Call handler directly with mock context
 * 4. Assert expected behavior
 */
import { describe, expect, it, vi } from "vitest";

interface MockedProcedure {
	handler: (...args: unknown[]) => unknown;
}

// Mock tRPC setup before importing the router
vi.mock("../../../src/lib/trpc", () => ({
	publicProcedure: {
		query: vi.fn((handler) => ({
			_def: { query: true },
			handler,
		})),
		mutation: vi.fn((handler) => ({
			_def: { mutation: true },
			handler,
		})),
		input: vi.fn(() => ({
			query: vi.fn((handler) => ({
				_def: { query: true },
				handler,
			})),
			mutation: vi.fn((handler) => ({
				_def: { mutation: true },
				handler,
			})),
		})),
	},
	router: vi.fn((routes) => routes),
}));

describe("exampleRouter", () => {
	// ─── Schemas ──────────────────────────────────────────

	describe("schemas", () => {
		it("createExampleSchema validates correct input", async () => {
			const { createExampleSchema } = await import(
				"../../../src/routers/example"
			);
			const result = createExampleSchema.safeParse({
				name: "Test Example",
				description: "A test",
			});
			expect(result.success).toBe(true);
		});

		it("createExampleSchema rejects empty name", async () => {
			const { createExampleSchema } = await import(
				"../../../src/routers/example"
			);
			const result = createExampleSchema.safeParse({ name: "" });
			expect(result.success).toBe(false);
		});

		it("createExampleSchema rejects name over 255 chars", async () => {
			const { createExampleSchema } = await import(
				"../../../src/routers/example"
			);
			const result = createExampleSchema.safeParse({
				name: "x".repeat(256),
			});
			expect(result.success).toBe(false);
		});

		it("updateExampleSchema requires id", async () => {
			const { updateExampleSchema } = await import(
				"../../../src/routers/example"
			);
			const result = updateExampleSchema.safeParse({ name: "Updated" });
			expect(result.success).toBe(false);
		});

		it("updateExampleSchema allows partial updates", async () => {
			const { updateExampleSchema } = await import(
				"../../../src/routers/example"
			);
			const result = updateExampleSchema.safeParse({
				id: "123",
				name: "Updated",
			});
			expect(result.success).toBe(true);
		});
	});

	// ─── Queries ──────────────────────────────────────────

	describe("list", () => {
		it("returns an empty array", async () => {
			const { exampleRouter } = await import("../../../src/routers/example");
			const list = exampleRouter.list as unknown as MockedProcedure;
			const result = await list.handler();
			expect(result).toEqual([]);
		});
	});

	describe("getById", () => {
		it("returns null for valid id", async () => {
			const { exampleRouter } = await import("../../../src/routers/example");
			const getById = exampleRouter.getById as unknown as MockedProcedure;
			const result = await getById.handler({ input: { id: "123" } });
			expect(result).toBeNull();
		});
	});

	// ─── Mutations ────────────────────────────────────────

	describe("create", () => {
		it("returns created entity with input data", async () => {
			const { exampleRouter } = await import("../../../src/routers/example");
			const create = exampleRouter.create as unknown as MockedProcedure;
			const result = (await create.handler({
				input: { name: "New Item", description: "Desc" },
			})) as { name: string; description: string | null };
			expect(result.name).toBe("New Item");
			expect(result.description).toBe("Desc");
		});

		it("defaults description to null when not provided", async () => {
			const { exampleRouter } = await import("../../../src/routers/example");
			const create = exampleRouter.create as unknown as MockedProcedure;
			const result = (await create.handler({
				input: { name: "No Desc" },
			})) as { description: string | null };
			expect(result.description).toBeNull();
		});
	});

	describe("update", () => {
		it("returns updated entity with new data", async () => {
			const { exampleRouter } = await import("../../../src/routers/example");
			const update = exampleRouter.update as unknown as MockedProcedure;
			const result = (await update.handler({
				input: { id: "123", name: "Updated" },
			})) as { id: string; name: string };
			expect(result.id).toBe("123");
			expect(result.name).toBe("Updated");
		});

		it("defaults name to existing when not provided", async () => {
			const { exampleRouter } = await import("../../../src/routers/example");
			const update = exampleRouter.update as unknown as MockedProcedure;
			const result = (await update.handler({
				input: { id: "456", description: "Only desc" },
			})) as { id: string; name: string; description: string };
			expect(result.id).toBe("456");
			expect(result.name).toBe("existing");
			expect(result.description).toBe("Only desc");
		});
	});

	describe("delete", () => {
		it("returns deleted confirmation", async () => {
			const { exampleRouter } = await import("../../../src/routers/example");
			const del = exampleRouter.delete as unknown as MockedProcedure;
			const result = (await del.handler({
				input: { id: "123" },
			})) as { id: string; deleted: boolean };
			expect(result.id).toBe("123");
			expect(result.deleted).toBe(true);
		});
	});
});
