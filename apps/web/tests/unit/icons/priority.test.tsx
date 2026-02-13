import {
	HighPriorityIcon,
	LowPriorityIcon,
	MediumPriorityIcon,
	NoPriorityIcon,
	priorities,
	UrgentPriorityIcon,
} from "@/icons/priority";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Priority Icons", () => {
	describe("NoPriorityIcon", () => {
		it("renders correctly", () => {
			render(<NoPriorityIcon />);
			const svg = screen.getByRole("img", { name: "No Priority" });
			expect(svg).toBeInTheDocument();
		});

		it("accepts className prop", () => {
			render(<NoPriorityIcon className="custom-class" />);
			const svg = screen.getByRole("img", { name: "No Priority" });
			expect(svg).toHaveClass("custom-class");
		});

		it("has correct SVG structure", () => {
			render(<NoPriorityIcon data-testid="no-priority-icon" />);
			const svg = screen.getByTestId("no-priority-icon");
			expect(svg.tagName).toBe("svg");
			expect(svg).toHaveAttribute("width", "16");
			expect(svg).toHaveAttribute("height", "16");
			expect(svg).toHaveAttribute("viewBox", "0 0 16 16");
			expect(svg.querySelectorAll("rect")).toHaveLength(3);
		});

		it("spreads additional props", () => {
			render(
				<NoPriorityIcon data-testid="test-icon" data-custom-id="my-icon" />,
			);
			const svg = screen.getByTestId("test-icon");
			expect(svg).toHaveAttribute("data-custom-id", "my-icon");
		});
	});

	describe("UrgentPriorityIcon", () => {
		it("renders correctly", () => {
			render(<UrgentPriorityIcon />);
			const svg = screen.getByRole("img", { name: "Urgent Priority" });
			expect(svg).toBeInTheDocument();
		});

		it("accepts className prop", () => {
			render(<UrgentPriorityIcon className="urgent-class" />);
			const svg = screen.getByRole("img", { name: "Urgent Priority" });
			expect(svg).toHaveClass("urgent-class");
		});

		it("has correct SVG structure", () => {
			render(<UrgentPriorityIcon data-testid="urgent-icon" />);
			const svg = screen.getByTestId("urgent-icon");
			expect(svg.tagName).toBe("svg");
			expect(svg).toHaveAttribute("width", "16");
			expect(svg).toHaveAttribute("height", "16");
			expect(svg.querySelector("path")).toBeInTheDocument();
		});
	});

	describe("HighPriorityIcon", () => {
		it("renders correctly", () => {
			render(<HighPriorityIcon />);
			const svg = screen.getByRole("img", { name: "High Priority" });
			expect(svg).toBeInTheDocument();
		});

		it("accepts className prop", () => {
			render(<HighPriorityIcon className="high-class" />);
			const svg = screen.getByRole("img", { name: "High Priority" });
			expect(svg).toHaveClass("high-class");
		});

		it("has correct SVG structure with three bars", () => {
			render(<HighPriorityIcon data-testid="high-icon" />);
			const svg = screen.getByTestId("high-icon");
			expect(svg.tagName).toBe("svg");
			expect(svg.querySelectorAll("rect")).toHaveLength(3);
		});
	});

	describe("MediumPriorityIcon", () => {
		it("renders correctly", () => {
			render(<MediumPriorityIcon />);
			const svg = screen.getByRole("img", { name: "Medium Priority" });
			expect(svg).toBeInTheDocument();
		});

		it("accepts className prop", () => {
			render(<MediumPriorityIcon className="medium-class" />);
			const svg = screen.getByRole("img", { name: "Medium Priority" });
			expect(svg).toHaveClass("medium-class");
		});

		it("has correct SVG structure with three bars", () => {
			render(<MediumPriorityIcon data-testid="medium-icon" />);
			const svg = screen.getByTestId("medium-icon");
			expect(svg.tagName).toBe("svg");
			expect(svg.querySelectorAll("rect")).toHaveLength(3);
		});
	});

	describe("LowPriorityIcon", () => {
		it("renders correctly", () => {
			render(<LowPriorityIcon />);
			const svg = screen.getByRole("img", { name: "Low Priority" });
			expect(svg).toBeInTheDocument();
		});

		it("accepts className prop", () => {
			render(<LowPriorityIcon className="low-class" />);
			const svg = screen.getByRole("img", { name: "Low Priority" });
			expect(svg).toHaveClass("low-class");
		});

		it("has correct SVG structure with three bars", () => {
			render(<LowPriorityIcon data-testid="low-icon" />);
			const svg = screen.getByTestId("low-icon");
			expect(svg.tagName).toBe("svg");
			expect(svg.querySelectorAll("rect")).toHaveLength(3);
		});
	});

	describe("priorities array", () => {
		it("contains all priority levels", () => {
			expect(priorities).toHaveLength(5);
			expect(priorities.map((p) => p.id)).toEqual([
				"no-priority",
				"urgent",
				"high",
				"medium",
				"low",
			]);
		});

		it("each priority has required properties", () => {
			for (const priority of priorities) {
				expect(priority).toHaveProperty("id");
				expect(priority).toHaveProperty("name");
				expect(priority).toHaveProperty("icon");
				expect(priority).toHaveProperty("color");
				expect(typeof priority.icon).toBe("function");
			}
		});
	});
});
