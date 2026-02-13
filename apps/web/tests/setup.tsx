/// <reference types="@testing-library/jest-dom/vitest" />
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock pointer capture methods for Radix UI components (not available in jsdom)
if (typeof Element !== "undefined") {
	Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
	Element.prototype.setPointerCapture = vi.fn();
	Element.prototype.releasePointerCapture = vi.fn();
	Element.prototype.scrollIntoView = vi.fn();
}

// Mock scrollTo for window (used by Radix UI)
Object.defineProperty(window, "scrollTo", {
	writable: true,
	value: vi.fn(),
});

// Mock ResizeObserver for Radix UI components
class ResizeObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}
global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

// Mock matchMedia for responsive hooks
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Cleanup after each test case
afterEach(() => {
	cleanup();
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		refresh: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		prefetch: vi.fn(),
	}),
	usePathname: () => "/",
	useSearchParams: () => new URLSearchParams(),
	useParams: () => ({}),
}));

// Mock next/image
vi.mock("next/image", () => ({
	default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
		// biome-ignore lint/performance/noImgElement: This is a test mock for Next.js Image
		return <img {...props} alt={props.alt || ""} />;
	},
}));

// Mock nuqs for URL state management
vi.mock("nuqs", () => ({
	useQueryState: () => [[], vi.fn()],
	useQueryStates: () => [{}, vi.fn()],
	parseAsString: { parse: (v: string) => v, serialize: (v: string) => v },
	parseAsInteger: {
		parse: (v: string) => Number.parseInt(v, 10),
		serialize: (v: number) => String(v),
	},
	parseAsBoolean: {
		parse: (v: string) => v === "true",
		serialize: (v: boolean) => String(v),
	},
	parseAsArrayOf: () => ({ parse: () => [], serialize: () => "" }),
	parseAsJson: (parser: (v: unknown) => unknown) => ({
		parse: parser,
		serialize: (v: unknown) => JSON.stringify(v),
		withDefault: (defaultValue: unknown) => ({
			parse: (v: string | null) => (v ? parser(JSON.parse(v)) : defaultValue),
			serialize: (v: unknown) => JSON.stringify(v),
			history: "replace" as const,
			shallow: false,
		}),
	}),
	createParser: () => ({
		parse: (v: unknown) => v,
		serialize: (v: unknown) => String(v),
	}),
}));
