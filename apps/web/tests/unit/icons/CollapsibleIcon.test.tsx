import { ChevronIcon } from "@/icons/CollapsibleIcon";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ChevronIcon", () => {
	it("renders correctly", () => {
		render(<ChevronIcon data-testid="chevron-icon" />);
		const svg = screen.getByTestId("chevron-icon");
		expect(svg).toBeInTheDocument();
		expect(svg.tagName).toBe("svg");
	});

	it("accepts className prop", () => {
		render(<ChevronIcon className="custom-class" data-testid="chevron-icon" />);
		const svg = screen.getByTestId("chevron-icon");
		expect(svg).toHaveClass("custom-class");
	});

	it("has correct SVG structure", () => {
		render(<ChevronIcon data-testid="chevron-icon" />);
		const svg = screen.getByTestId("chevron-icon");
		expect(svg).toHaveAttribute("width", "10");
		expect(svg).toHaveAttribute("height", "10");
		expect(svg).toHaveAttribute("viewBox", "0 0 10 10");
		expect(svg).toHaveAttribute("fill", "none");
	});

	it("contains a path element with correct attributes", () => {
		render(<ChevronIcon data-testid="chevron-icon" />);
		const svg = screen.getByTestId("chevron-icon");
		const path = svg.querySelector("path");
		expect(path).toBeInTheDocument();
		expect(path).toHaveAttribute("d", "M3.5 9L7.5 5L3.5 1");
		expect(path).toHaveAttribute("stroke", "currentcolor");
	});

	it("spreads additional props", () => {
		render(
			<ChevronIcon
				data-testid="chevron-icon"
				data-custom-id="my-chevron"
				aria-label="Expand"
			/>,
		);
		const svg = screen.getByTestId("chevron-icon");
		expect(svg).toHaveAttribute("data-custom-id", "my-chevron");
		expect(svg).toHaveAttribute("aria-label", "Expand");
	});

	it("can override default attributes", () => {
		render(<ChevronIcon data-testid="chevron-icon" width="20" height="20" />);
		const svg = screen.getByTestId("chevron-icon");
		expect(svg).toHaveAttribute("width", "20");
		expect(svg).toHaveAttribute("height", "20");
	});
});
