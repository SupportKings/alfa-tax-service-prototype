import { useWindowSize } from "@/hooks/use-window-size";

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useWindowSize", () => {
	const mockVisualViewport = {
		width: 1024,
		height: 768,
		offsetTop: 0,
		offsetLeft: 0,
		scale: 1,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	};

	beforeEach(() => {
		Object.defineProperty(window, "visualViewport", {
			value: mockVisualViewport,
			writable: true,
			configurable: true,
		});
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns initial state with zeros before effect runs", () => {
		const { result } = renderHook(() => useWindowSize());

		// After effect runs, it should have viewport values
		expect(result.current.width).toBe(1024);
		expect(result.current.height).toBe(768);
	});

	it("returns viewport dimensions from visualViewport API", () => {
		const { result } = renderHook(() => useWindowSize());

		expect(result.current).toEqual({
			width: 1024,
			height: 768,
			offsetTop: 0,
			offsetLeft: 0,
			scale: 1,
		});
	});

	it("adds event listeners for resize and scroll", () => {
		renderHook(() => useWindowSize());

		expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith(
			"resize",
			expect.any(Function),
		);
		expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith(
			"scroll",
			expect.any(Function),
		);
	});

	it("removes event listeners on unmount", () => {
		const { unmount } = renderHook(() => useWindowSize());
		unmount();

		expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith(
			"resize",
			expect.any(Function),
		);
		expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith(
			"scroll",
			expect.any(Function),
		);
	});

	it("updates when viewport changes", () => {
		let resizeHandler: () => void;
		mockVisualViewport.addEventListener.mockImplementation(
			(event: string, handler: () => void) => {
				if (event === "resize") {
					resizeHandler = handler;
				}
			},
		);

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(1024);

		// Simulate viewport change
		Object.defineProperty(window, "visualViewport", {
			value: {
				...mockVisualViewport,
				width: 800,
				height: 600,
			},
			writable: true,
			configurable: true,
		});

		act(() => {
			resizeHandler();
		});

		expect(result.current.width).toBe(800);
		expect(result.current.height).toBe(600);
	});

	it("does not update state if values are unchanged", () => {
		let resizeHandler: () => void;
		mockVisualViewport.addEventListener.mockImplementation(
			(event: string, handler: () => void) => {
				if (event === "resize") {
					resizeHandler = handler;
				}
			},
		);

		const { result } = renderHook(() => useWindowSize());
		const initialState = result.current;

		// Call resize handler with same values
		act(() => {
			resizeHandler();
		});

		// State should be the same object reference (no re-render)
		expect(result.current).toEqual(initialState);
	});

	it("handles missing visualViewport gracefully", () => {
		Object.defineProperty(window, "visualViewport", {
			value: null,
			writable: true,
			configurable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		// Should return initial zeros
		expect(result.current).toEqual({
			width: 0,
			height: 0,
			offsetTop: 0,
			offsetLeft: 0,
			scale: 0,
		});
	});
});
