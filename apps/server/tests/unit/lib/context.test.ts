import { describe, expect, it } from "vitest";
import { createContext } from "../../../src/lib/context";

describe("createContext", () => {
	it("returns context with null session when no auth", async () => {
		const mockHonoContext = {
			req: { header: () => null },
			env: {},
		} as unknown as Parameters<typeof createContext>[0]["context"];

		const context = await createContext({ context: mockHonoContext });

		expect(context).toEqual({ session: null });
	});

	it("returns context object with expected shape", async () => {
		const mockHonoContext = {
			req: { header: () => "Bearer token" },
			env: {},
		} as unknown as Parameters<typeof createContext>[0]["context"];

		const context = await createContext({ context: mockHonoContext });

		expect(context).toHaveProperty("session");
		expect(typeof context).toBe("object");
	});
});
