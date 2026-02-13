import { useIsMobile } from "@/hooks/use-mobile";

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("useIsMobile", () => {
	let addEventListenerSpy: ReturnType<typeof vi.fn>;
	let removeEventListenerSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		addEventListenerSpy = vi.fn();
		removeEventListenerSpy = vi.fn();

		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: addEventListenerSpy,
				removeEventListener: removeEventListenerSpy,
				dispatchEvent: vi.fn(),
			})),
		});
	});

	it("returns false for desktop viewport by default", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);
	});

	it("returns true for mobile viewport", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 375,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
	});

	it("uses custom breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile(1200));

		expect(result.current).toBe(true);
	});

	it("adds matchMedia event listener on mount", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		renderHook(() => useIsMobile());

		expect(addEventListenerSpy).toHaveBeenCalledWith(
			"change",
			expect.any(Function),
		);
	});

	it("removes matchMedia event listener on unmount", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { unmount } = renderHook(() => useIsMobile());
		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"change",
			expect.any(Function),
		);
	});

	it("updates when window is resized", () => {
		let changeHandler: () => void;
		addEventListenerSpy.mockImplementation(
			(event: string, handler: () => void) => {
				if (event === "change") {
					changeHandler = handler;
				}
			},
		);

		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);

		// Simulate resize to mobile
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 375,
		});

		act(() => {
			changeHandler();
		});

		expect(result.current).toBe(true);
	});

	it("uses default breakpoint of 768", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 767,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
	});

	it("returns false at exactly the breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 768,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);
	});
});
