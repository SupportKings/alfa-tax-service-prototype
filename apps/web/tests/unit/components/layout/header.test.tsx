import Header from "@/components/header";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock next-themes
vi.mock("next-themes", () => ({
	useTheme: () => ({
		theme: "light",
		setTheme: vi.fn(),
		resolvedTheme: "light",
	}),
}));

describe("Header", () => {
	it("renders without crashing", () => {
		render(<Header />);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("renders the Home link", () => {
		render(<Header />);
		const homeLink = screen.getByRole("link", { name: "Home" });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute("href", "/");
	});

	it("renders the ModeToggle component", () => {
		render(<Header />);
		const toggleButton = screen.getByRole("button");
		expect(toggleButton).toBeInTheDocument();
		expect(screen.getByText("Toggle theme")).toBeInTheDocument();
	});

	it("has correct layout structure", () => {
		const { container } = render(<Header />);
		const mainDiv = container.firstChild as HTMLElement;
		expect(mainDiv.tagName).toBe("DIV");
	});

	it("renders navigation with correct styling", () => {
		render(<Header />);
		const nav = screen.getByRole("navigation");
		expect(nav).toHaveClass("flex", "gap-4");
	});

	it("renders a horizontal rule separator", () => {
		const { container } = render(<Header />);
		const hr = container.querySelector("hr");
		expect(hr).toBeInTheDocument();
	});

	it("renders flex layout for header content", () => {
		const { container } = render(<Header />);
		const flexContainer = container.querySelector(
			".flex.flex-row.items-center.justify-between",
		);
		expect(flexContainer).toBeInTheDocument();
	});

	it("groups ModeToggle in a separate container", () => {
		const { container } = render(<Header />);
		const toggleContainer = container.querySelector(".flex.items-center.gap-2");
		expect(toggleContainer).toBeInTheDocument();
	});
});
