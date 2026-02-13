import { logError, safeError } from "@/lib/errors";

import { afterEach, describe, expect, it, vi } from "vitest";

describe("safeError", () => {
	it("extracts message from Error instance", () => {
		const error = new Error("Something went wrong");
		expect(safeError(error)).toBe("Something went wrong");
	});

	it("returns string errors as-is", () => {
		expect(safeError("Direct error message")).toBe("Direct error message");
	});

	it("returns generic message for non-string, non-Error values", () => {
		expect(safeError(42)).toBe("An unexpected error occurred");
		expect(safeError(null)).toBe("An unexpected error occurred");
		expect(safeError(undefined)).toBe("An unexpected error occurred");
		expect(safeError({ foo: "bar" })).toBe("An unexpected error occurred");
	});
});

describe("logError", () => {
	const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

	afterEach(() => {
		consoleSpy.mockClear();
		vi.unstubAllEnvs();
	});

	it("logs only safe message in production", () => {
		vi.stubEnv("NODE_ENV", "production");
		const error = new Error("DB connection failed: postgres://user:pass@host");

		logError("dbConnect", error);

		expect(consoleSpy).toHaveBeenCalledWith(
			"[dbConnect]",
			"DB connection failed: postgres://user:pass@host",
		);
		expect(consoleSpy).not.toHaveBeenCalledWith("[dbConnect]", error);
	});

	it("logs full error object in development", () => {
		vi.stubEnv("NODE_ENV", "development");
		const error = new Error("Debug me");

		logError("test", error);

		expect(consoleSpy).toHaveBeenCalledWith("[test]", error);
	});

	it("logs full error object in test environment", () => {
		vi.stubEnv("NODE_ENV", "test");
		const error = new Error("Test error");

		logError("testCtx", error);

		expect(consoleSpy).toHaveBeenCalledWith("[testCtx]", error);
	});
});
