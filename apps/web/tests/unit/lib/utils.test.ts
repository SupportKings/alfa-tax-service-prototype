import { cn, cx, focusInput, focusRing, hasErrorInput } from "@/lib/utils";

import { describe, expect, it } from "vitest";

describe("utils", () => {
	describe("cn", () => {
		it("merges class names", () => {
			expect(cn("foo", "bar")).toBe("foo bar");
		});

		it("handles conditional classes with false", () => {
			expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
		});

		it("handles conditional classes with true", () => {
			expect(cn("foo", true && "bar", "baz")).toBe("foo bar baz");
		});

		it("deduplicates tailwind classes (last wins)", () => {
			expect(cn("p-4", "p-2")).toBe("p-2");
		});

		it("handles empty inputs", () => {
			expect(cn()).toBe("");
		});

		it("handles undefined and null values", () => {
			expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
		});

		it("handles array of classes", () => {
			expect(cn(["foo", "bar"])).toBe("foo bar");
		});

		it("handles object with boolean values", () => {
			expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
		});

		it("merges conflicting tailwind utilities correctly", () => {
			expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
			expect(cn("bg-white", "bg-black")).toBe("bg-black");
			expect(cn("m-2", "mx-4")).toBe("m-2 mx-4");
		});

		it("handles complex combinations", () => {
			expect(
				cn(
					"base-class",
					["array-class"],
					{ conditional: true, excluded: false },
					undefined,
					"final-class",
				),
			).toBe("base-class array-class conditional final-class");
		});
	});

	describe("cx", () => {
		it("merges class names", () => {
			expect(cx("foo", "bar")).toBe("foo bar");
		});

		it("handles conditional classes with false", () => {
			expect(cx("foo", false && "bar", "baz")).toBe("foo baz");
		});

		it("handles conditional classes with true", () => {
			expect(cx("foo", true && "bar", "baz")).toBe("foo bar baz");
		});

		it("deduplicates tailwind classes (last wins)", () => {
			expect(cx("p-4", "p-2")).toBe("p-2");
		});

		it("handles empty inputs", () => {
			expect(cx()).toBe("");
		});

		it("handles undefined and null values", () => {
			expect(cx("foo", undefined, null, "bar")).toBe("foo bar");
		});

		it("handles array of classes", () => {
			expect(cx(["foo", "bar"])).toBe("foo bar");
		});

		it("handles object with boolean values", () => {
			expect(cx({ foo: true, bar: false, baz: true })).toBe("foo baz");
		});

		it("merges conflicting tailwind utilities correctly", () => {
			expect(cx("text-red-500", "text-blue-500")).toBe("text-blue-500");
			expect(cx("bg-white", "bg-black")).toBe("bg-black");
			expect(cx("m-2", "mx-4")).toBe("m-2 mx-4");
		});

		it("handles multiple arrays spread as arguments", () => {
			expect(cx("base", "second", "third")).toBe("base second third");
		});

		it("handles complex combinations", () => {
			expect(
				cx(
					"base-class",
					["array-class"],
					{ conditional: true, excluded: false },
					undefined,
					"final-class",
				),
			).toBe("base-class array-class conditional final-class");
		});

		it("behaves identically to cn for standard use cases", () => {
			const testCases = [
				["foo", "bar"],
				["p-4", "p-2"],
				["text-red-500", "text-blue-500"],
				["base", undefined, null, "end"],
			] as const;

			for (const args of testCases) {
				expect(cx(...args)).toBe(cn(...args));
			}
		});
	});

	describe("focusInput", () => {
		it("is an array", () => {
			expect(Array.isArray(focusInput)).toBe(true);
		});

		it("has classes", () => {
			expect(focusInput.length).toBeGreaterThan(0);
		});

		it("contains focus ring class", () => {
			expect(focusInput).toContain("focus:ring-2");
		});

		it("contains focus ring color classes", () => {
			expect(focusInput.some((cls) => cls.includes("focus:ring-blue"))).toBe(
				true,
			);
		});

		it("contains focus border color classes", () => {
			expect(focusInput.some((cls) => cls.includes("focus:border-blue"))).toBe(
				true,
			);
		});

		it("contains dark mode variants", () => {
			expect(focusInput.some((cls) => cls.includes("dark:"))).toBe(true);
		});
	});

	describe("focusRing", () => {
		it("is an array", () => {
			expect(Array.isArray(focusRing)).toBe(true);
		});

		it("has classes", () => {
			expect(focusRing.length).toBeGreaterThan(0);
		});

		it("contains outline classes", () => {
			expect(focusRing.some((cls) => cls.includes("outline"))).toBe(true);
		});

		it("contains focus-visible outline class", () => {
			expect(focusRing.some((cls) => cls.includes("focus-visible:"))).toBe(
				true,
			);
		});

		it("contains outline color classes", () => {
			expect(focusRing.some((cls) => cls.includes("outline-blue"))).toBe(true);
		});

		it("contains dark mode variants", () => {
			expect(focusRing.some((cls) => cls.includes("dark:"))).toBe(true);
		});
	});

	describe("hasErrorInput", () => {
		it("is an array", () => {
			expect(Array.isArray(hasErrorInput)).toBe(true);
		});

		it("has classes", () => {
			expect(hasErrorInput.length).toBeGreaterThan(0);
		});

		it("contains ring class", () => {
			expect(hasErrorInput).toContain("ring-2");
		});

		it("contains red border color classes for errors", () => {
			expect(hasErrorInput.some((cls) => cls.includes("border-red"))).toBe(
				true,
			);
		});

		it("contains red ring color classes for errors", () => {
			expect(hasErrorInput.some((cls) => cls.includes("ring-red"))).toBe(true);
		});

		it("contains dark mode variants", () => {
			expect(hasErrorInput.some((cls) => cls.includes("dark:"))).toBe(true);
		});
	});

	describe("integration", () => {
		it("cn can be used with focusInput array", () => {
			const result = cn("base-class", ...focusInput);
			expect(result).toContain("base-class");
			expect(result).toContain("focus:ring-2");
		});

		it("cx can be used with focusRing array", () => {
			const result = cx("base-class", ...focusRing);
			expect(result).toContain("base-class");
			expect(result).toContain("outline");
		});

		it("cn can combine multiple utility arrays", () => {
			const result = cn("input-base", ...focusInput, ...hasErrorInput);
			expect(result).toContain("input-base");
			// hasErrorInput has ring-2 which should override/coexist with focus:ring-2
			expect(result).toContain("ring-2");
		});
	});
});
