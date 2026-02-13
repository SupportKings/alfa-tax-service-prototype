import { ac, admin, user } from "@/lib/permissions";

import { describe, expect, it } from "vitest";

describe("permissions", () => {
	describe("ac (access control)", () => {
		it("is defined", () => {
			expect(ac).toBeDefined();
		});

		it("has newRole method", () => {
			expect(typeof ac.newRole).toBe("function");
		});
	});

	describe("user role", () => {
		it("is defined", () => {
			expect(user).toBeDefined();
		});
	});

	describe("admin role", () => {
		it("is defined", () => {
			expect(admin).toBeDefined();
		});
	});
});
