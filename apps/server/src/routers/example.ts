/**
 * Example CRUD Router
 *
 * Copy this file when creating a new feature router.
 * Replace "example" with your entity name throughout.
 *
 * Steps after copying:
 * 1. Rename file to your entity (e.g., `clients.ts`)
 * 2. Replace `example` schemas/types with your entity
 * 3. Replace mock data with real Drizzle queries
 * 4. Merge into appRouter in `./index.ts`
 * 5. Write tests FIRST (see tests/unit/routers/example.test.ts)
 */
import { z } from "zod";
import { publicProcedure, router } from "../lib/trpc";

// ─── Zod Schemas ────────────────────────────────────────────
// Define these in a shared types file for real features

export const exampleSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createExampleSchema = z.object({
	name: z.string().min(1, "Name is required").max(255),
	description: z.string().max(1000).optional(),
});

export const updateExampleSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1).max(255).optional(),
	description: z.string().max(1000).optional(),
});

export type Example = z.infer<typeof exampleSchema>;

// ─── Router ─────────────────────────────────────────────────

export const exampleRouter = router({
	/**
	 * List all examples
	 * Replace with: db.select().from(examples).orderBy(desc(examples.createdAt))
	 */
	list: publicProcedure.query(async () => {
		// TODO: Replace with real Drizzle query
		// const results = await ctx.db.select().from(examples);
		return [] as Example[];
	}),

	/**
	 * Get a single example by ID
	 * Replace with: db.select().from(examples).where(eq(examples.id, input.id))
	 */
	getById: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ input: _input }) => {
			// TODO: Replace with real Drizzle query
			// const [result] = await ctx.db.select().from(examples).where(eq(examples.id, input.id));
			// if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "Example not found" });
			return null as Example | null;
		}),

	/**
	 * Create a new example
	 * Replace with: db.insert(examples).values({ ...input }).returning()
	 */
	create: publicProcedure
		.input(createExampleSchema)
		.mutation(async ({ input }) => {
			// TODO: Replace with real Drizzle insert
			// const [created] = await ctx.db.insert(examples).values({ name: input.name, description: input.description }).returning();
			return {
				id: "new-id",
				name: input.name,
				description: input.description ?? null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}),

	/**
	 * Update an existing example
	 * Replace with: db.update(examples).set({ ...input }).where(eq(examples.id, input.id)).returning()
	 */
	update: publicProcedure
		.input(updateExampleSchema)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;
			// TODO: Replace with real Drizzle update
			// const [updated] = await ctx.db.update(examples).set(data).where(eq(examples.id, id)).returning();
			return {
				id,
				name: data.name ?? "existing",
				description: data.description ?? null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}),

	/**
	 * Delete an example by ID
	 * Replace with: db.delete(examples).where(eq(examples.id, input.id)).returning()
	 */
	delete: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.mutation(async ({ input }) => {
			// TODO: Replace with real Drizzle delete
			// const [deleted] = await ctx.db.delete(examples).where(eq(examples.id, input.id)).returning();
			return { id: input.id, deleted: true };
		}),
});
