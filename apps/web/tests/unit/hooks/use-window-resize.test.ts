import { useOnWindowResize } from "@/hooks/use-window-resize";

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useOnWindowResize", () => {
	let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
	let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		addEventListenerSpy = vi.spyOn(window, "addEventListener");
		removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
	});

	afterEach(() => {
		addEventListenerSpy.mockRestore();
		removeEventListenerSpy.mockRestore();
	});

	it("calls handler immediately on mount", () => {
		const handler = vi.fn();

		renderHook(() => useOnWindowResize(handler));

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("adds resize event listener on mount", () => {
		const handler = vi.fn();

		renderHook(() => useOnWindowResize(handler));

		expect(addEventListenerSpy).toHaveBeenCalledWith(
			"resize",
			expect.any(Function),
		);
	});

	it("removes resize event listener on unmount", () => {
		const handler = vi.fn();

		const { unmount } = renderHook(() => useOnWindowResize(handler));
		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"resize",
			expect.any(Function),
		);
	});

	it("calls handler when window is resized", () => {
		const handler = vi.fn();

		renderHook(() => useOnWindowResize(handler));

		// Initial call
		expect(handler).toHaveBeenCalledTimes(1);

		// Simulate resize event
		window.dispatchEvent(new Event("resize"));

		expect(handler).toHaveBeenCalledTimes(2);
	});

	it("updates handler when it changes", () => {
		const handler1 = vi.fn();
		const handler2 = vi.fn();

		const { rerender } = renderHook(
			({ handler }) => useOnWindowResize(handler),
			{ initialProps: { handler: handler1 } },
		);

		expect(handler1).toHaveBeenCalledTimes(1);

		rerender({ handler: handler2 });

		// handler2 should be called on rerender due to useEffect dependency
		expect(handler2).toHaveBeenCalledTimes(1);
	});
});
