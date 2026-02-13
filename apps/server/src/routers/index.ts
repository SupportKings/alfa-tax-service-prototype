import { publicProcedure, router } from "../lib/trpc";
import { exampleRouter } from "./example";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	getUser: publicProcedure.query(async ({ ctx: _ctx }) => {
		return null;
	}),
	// Example CRUD router — copy this pattern for new features
	example: exampleRouter,
});

export type AppRouter = typeof appRouter;
