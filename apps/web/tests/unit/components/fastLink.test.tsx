import { Link } from "@/components/fastLink";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
		replace: vi.fn(),
		refresh: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		prefetch: vi.fn(),
	}),
}));

describe("Link (FastLink)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders children correctly", () => {
		render(<Link href="/test">Click me</Link>);

		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("renders as an anchor element", () => {
		render(<Link href="/test">Test Link</Link>);

		const link = screen.getByRole("link");
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/test");
	});

	it("calls router.push on mousedown for same-origin links", () => {
		render(<Link href="/dashboard">Dashboard</Link>);

		const link = screen.getByRole("link");
		fireEvent.mouseDown(link, { button: 0 });

		expect(mockPush).toHaveBeenCalledWith("/dashboard");
	});

	it("does not call router.push when alt key is held", () => {
		render(<Link href="/test">Test</Link>);

		const link = screen.getByRole("link");
		fireEvent.mouseDown(link, { button: 0, altKey: true });

		expect(mockPush).not.toHaveBeenCalled();
	});

	it("does not call router.push when ctrl key is held", () => {
		render(<Link href="/test">Test</Link>);

		const link = screen.getByRole("link");
		fireEvent.mouseDown(link, { button: 0, ctrlKey: true });

		expect(mockPush).not.toHaveBeenCalled();
	});

	it("does not call router.push when meta key is held", () => {
		render(<Link href="/test">Test</Link>);

		const link = screen.getByRole("link");
		fireEvent.mouseDown(link, { button: 0, metaKey: true });

		expect(mockPush).not.toHaveBeenCalled();
	});

	it("does not call router.push when shift key is held", () => {
		render(<Link href="/test">Test</Link>);

		const link = screen.getByRole("link");
		fireEvent.mouseDown(link, { button: 0, shiftKey: true });

		expect(mockPush).not.toHaveBeenCalled();
	});

	it("does not call router.push for non-primary mouse button", () => {
		render(<Link href="/test">Test</Link>);

		const link = screen.getByRole("link");
		fireEvent.mouseDown(link, { button: 2 }); // right-click

		expect(mockPush).not.toHaveBeenCalled();
	});

	it("passes additional props to NextLink", () => {
		render(
			<Link href="/test" className="custom-class" target="_blank">
				Test
			</Link>,
		);

		const link = screen.getByRole("link");
		expect(link).toHaveClass("custom-class");
		expect(link).toHaveAttribute("target", "_blank");
	});
});
