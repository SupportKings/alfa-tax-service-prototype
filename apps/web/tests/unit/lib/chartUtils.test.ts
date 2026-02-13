import {
	AvailableChartColors,
	chartColors,
	constructCategoryColors,
	getColorClassName,
	getYAxisDomain,
	hasOnlyOneValueForKey,
} from "@/lib/chartUtils";

import { describe, expect, it } from "vitest";

describe("chartUtils", () => {
	describe("chartColors", () => {
		it("has expected colors", () => {
			expect(chartColors.blue).toBeDefined();
			expect(chartColors.blue.bg).toBe("bg-blue-500");
		});

		it("has all color utilities for each color", () => {
			const utilities = ["bg", "stroke", "fill", "text"] as const;
			for (const color of Object.keys(chartColors)) {
				for (const utility of utilities) {
					expect(
						chartColors[color as keyof typeof chartColors][utility],
					).toBeDefined();
				}
			}
		});

		it("has emerald color with correct values", () => {
			expect(chartColors.emerald.bg).toBe("bg-emerald-500");
			expect(chartColors.emerald.stroke).toBe("stroke-emerald-500");
			expect(chartColors.emerald.fill).toBe("fill-emerald-500");
			expect(chartColors.emerald.text).toBe("text-emerald-500");
		});

		it("has unutilized color with dark mode variants", () => {
			expect(chartColors.unutilized.bg).toContain("dark:");
			expect(chartColors.unutilized.stroke).toContain("dark:");
		});
	});

	describe("AvailableChartColors", () => {
		it("contains all chart color keys", () => {
			expect(AvailableChartColors).toContain("blue");
			expect(AvailableChartColors).toContain("emerald");
			expect(AvailableChartColors).toContain("violet");
			expect(AvailableChartColors).toContain("amber");
			expect(AvailableChartColors).toContain("gray");
			expect(AvailableChartColors).toContain("cyan");
			expect(AvailableChartColors).toContain("pink");
			expect(AvailableChartColors).toContain("lime");
			expect(AvailableChartColors).toContain("fuchsia");
			expect(AvailableChartColors).toContain("red");
			expect(AvailableChartColors).toContain("unutilized");
		});

		it("has the same length as chartColors keys", () => {
			expect(AvailableChartColors.length).toBe(Object.keys(chartColors).length);
		});
	});

	describe("constructCategoryColors", () => {
		it("maps categories to colors", () => {
			const result = constructCategoryColors(["A", "B"], ["blue", "emerald"]);
			expect(result.get("A")).toBe("blue");
			expect(result.get("B")).toBe("emerald");
		});

		it("cycles colors when more categories than colors", () => {
			const result = constructCategoryColors(["A", "B", "C"], ["blue"]);
			expect(result.get("A")).toBe("blue");
			expect(result.get("B")).toBe("blue");
			expect(result.get("C")).toBe("blue");
		});

		it("cycles through multiple colors correctly", () => {
			const result = constructCategoryColors(
				["A", "B", "C", "D", "E"],
				["blue", "emerald"],
			);
			expect(result.get("A")).toBe("blue");
			expect(result.get("B")).toBe("emerald");
			expect(result.get("C")).toBe("blue");
			expect(result.get("D")).toBe("emerald");
			expect(result.get("E")).toBe("blue");
		});

		it("returns empty map for empty categories", () => {
			const result = constructCategoryColors([], ["blue", "emerald"]);
			expect(result.size).toBe(0);
		});

		it("returns a Map instance", () => {
			const result = constructCategoryColors(["A"], ["blue"]);
			expect(result).toBeInstanceOf(Map);
		});
	});

	describe("getColorClassName", () => {
		it("returns correct class for bg", () => {
			expect(getColorClassName("blue", "bg")).toBe("bg-blue-500");
		});

		it("returns correct class for stroke", () => {
			expect(getColorClassName("blue", "stroke")).toBe("stroke-blue-500");
		});

		it("returns correct class for fill", () => {
			expect(getColorClassName("blue", "fill")).toBe("fill-blue-500");
		});

		it("returns correct class for text", () => {
			expect(getColorClassName("blue", "text")).toBe("text-blue-500");
		});

		it("returns fallback for invalid color - bg", () => {
			// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
			expect(getColorClassName("invalid" as any, "bg")).toBe("bg-gray-500");
		});

		it("returns fallback for invalid color - stroke", () => {
			// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
			expect(getColorClassName("invalid" as any, "stroke")).toBe(
				"stroke-gray-500",
			);
		});

		it("returns fallback for invalid color - fill", () => {
			// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
			expect(getColorClassName("invalid" as any, "fill")).toBe("fill-gray-500");
		});

		it("returns fallback for invalid color - text", () => {
			// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
			expect(getColorClassName("invalid" as any, "text")).toBe("text-gray-500");
		});

		it("returns correct class for all valid colors", () => {
			for (const color of AvailableChartColors) {
				const result = getColorClassName(color, "bg");
				expect(result).toBeDefined();
				expect(typeof result).toBe("string");
			}
		});
	});

	describe("getYAxisDomain", () => {
		it("returns auto when autoMinValue is true", () => {
			expect(getYAxisDomain(true, 0, 100)).toEqual(["auto", 100]);
		});

		it("returns minValue when autoMinValue is false", () => {
			expect(getYAxisDomain(false, 10, 100)).toEqual([10, 100]);
		});

		it("defaults to 0 when minValue is undefined and autoMinValue is false", () => {
			expect(getYAxisDomain(false, undefined, 100)).toEqual([0, 100]);
		});

		it("returns auto for maxValue when undefined", () => {
			expect(getYAxisDomain(false, 0, undefined)).toEqual([0, "auto"]);
		});

		it("returns auto for both when autoMinValue is true and maxValue is undefined", () => {
			expect(getYAxisDomain(true, undefined, undefined)).toEqual([
				"auto",
				"auto",
			]);
		});

		it("ignores minValue when autoMinValue is true", () => {
			expect(getYAxisDomain(true, 50, 100)).toEqual(["auto", 100]);
		});

		it("handles negative minValue", () => {
			expect(getYAxisDomain(false, -10, 100)).toEqual([-10, 100]);
		});

		it("handles zero maxValue", () => {
			expect(getYAxisDomain(false, -100, 0)).toEqual([-100, 0]);
		});
	});

	describe("hasOnlyOneValueForKey", () => {
		it("returns true for single value", () => {
			expect(hasOnlyOneValueForKey([{ a: 1 }], "a")).toBe(true);
		});

		it("returns false for multiple different values", () => {
			expect(hasOnlyOneValueForKey([{ a: 1 }, { a: 2 }], "a")).toBe(false);
		});

		it("returns true when key is missing from all objects", () => {
			expect(hasOnlyOneValueForKey([{ b: 1 }], "a")).toBe(true);
		});

		it("returns true for empty array", () => {
			expect(hasOnlyOneValueForKey([], "a")).toBe(true);
		});

		it("returns false when second object has the key", () => {
			expect(hasOnlyOneValueForKey([{ a: 1 }, { a: 1 }], "a")).toBe(false);
		});

		it("returns true when only first object has the key", () => {
			expect(hasOnlyOneValueForKey([{ a: 1 }, { b: 2 }], "a")).toBe(true);
		});

		it("returns false when multiple objects have the key even with same value", () => {
			expect(hasOnlyOneValueForKey([{ a: 1 }, { a: 1 }, { a: 1 }], "a")).toBe(
				false,
			);
		});

		it("handles objects with multiple keys", () => {
			expect(
				hasOnlyOneValueForKey(
					[
						{ a: 1, b: 2 },
						{ a: 2, b: 3 },
					],
					"a",
				),
			).toBe(false);
		});

		it("handles mixed presence of key", () => {
			expect(hasOnlyOneValueForKey([{ a: 1 }, { b: 2 }, { a: 3 }], "a")).toBe(
				false,
			);
		});
	});
});
