import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({
	context: _context,
}: CreateContextOptions) {
	// No auth configured - context will be used when auth is added
	return {
		session: null,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
