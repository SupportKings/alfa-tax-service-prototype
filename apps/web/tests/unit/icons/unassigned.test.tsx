import { UnassignedIcon } from "@/icons/unassigned";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("UnassignedIcon", () => {
	it("renders correctly", () => {
		render(<UnassignedIcon data-testid="unassigned-icon" />);
		const svg = screen.getByTestId("unassigned-icon");
		expect(svg).toBeInTheDocument();
		expect(svg.tagName).toBe("svg");
	});

	it("accepts className prop", () => {
		render(
			<UnassignedIcon className="custom-class" data-testid="unassigned-icon" />,
		);
		const svg = screen.getByTestId("unassigned-icon");
		expect(svg).toHaveClass("custom-class");
	});

	it("has correct SVG structure", () => {
		render(<UnassignedIcon data-testid="unassigned-icon" />);
		const svg = screen.getByTestId("unassigned-icon");
		expect(svg).toHaveAttribute("width", "16");
		expect(svg).toHaveAttribute("height", "16");
		expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
		expect(svg).toHaveAttribute("fill", "currentColor");
	});

	it("has correct accessibility attributes", () => {
		render(<UnassignedIcon data-testid="unassigned-icon" />);
		const svg = screen.getByTestId("unassigned-icon");
		expect(svg).toHaveAttribute("role", "img");
		expect(svg).toHaveAttribute("focusable", "false");
		expect(svg).toHaveAttribute("aria-hidden", "true");
	});

	it("contains a path element", () => {
		render(<UnassignedIcon data-testid="unassigned-icon" />);
		const svg = screen.getByTestId("unassigned-icon");
		expect(svg.querySelector("path")).toBeInTheDocument();
	});

	it("spreads additional props", () => {
		render(
			<UnassignedIcon
				data-testid="unassigned-icon"
				data-custom-id="my-icon"
				aria-label="Unassigned"
			/>,
		);
		const svg = screen.getByTestId("unassigned-icon");
		expect(svg).toHaveAttribute("data-custom-id", "my-icon");
		expect(svg).toHaveAttribute("aria-label", "Unassigned");
	});
});
