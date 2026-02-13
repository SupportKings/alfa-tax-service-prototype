import {
	EscalatedToManagerIcon,
	EscalatedToOwnerIcon,
	InProgressIcon,
	OpenIcon,
	ResolvedIcon,
	StatusIcon,
	status,
	UnclaimedIcon,
} from "@/icons/status";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Status Icons", () => {
	describe("UnclaimedIcon", () => {
		it("renders correctly", () => {
			render(<UnclaimedIcon data-testid="unclaimed-icon" />);
			const svg = screen.getByTestId("unclaimed-icon");
			expect(svg).toBeInTheDocument();
			expect(svg.tagName).toBe("svg");
		});

		it("accepts className prop", () => {
			render(
				<UnclaimedIcon className="custom-class" data-testid="unclaimed-icon" />,
			);
			const svg = screen.getByTestId("unclaimed-icon");
			expect(svg).toHaveClass("custom-class");
		});

		it("has correct SVG structure", () => {
			render(<UnclaimedIcon data-testid="unclaimed-icon" />);
			const svg = screen.getByTestId("unclaimed-icon");
			expect(svg).toHaveAttribute("width", "14");
			expect(svg).toHaveAttribute("height", "14");
			expect(svg).toHaveAttribute("viewBox", "0 0 14 14");
			expect(svg.querySelectorAll("circle")).toHaveLength(2);
		});
	});

	describe("EscalatedToOwnerIcon", () => {
		it("renders correctly", () => {
			render(<EscalatedToOwnerIcon data-testid="escalated-owner-icon" />);
			const svg = screen.getByTestId("escalated-owner-icon");
			expect(svg).toBeInTheDocument();
			expect(svg.tagName).toBe("svg");
		});

		it("accepts className prop", () => {
			render(
				<EscalatedToOwnerIcon
					className="escalated-class"
					data-testid="escalated-owner-icon"
				/>,
			);
			const svg = screen.getByTestId("escalated-owner-icon");
			expect(svg).toHaveClass("escalated-class");
		});

		it("has correct SVG structure with circle and path", () => {
			render(<EscalatedToOwnerIcon data-testid="escalated-owner-icon" />);
			const svg = screen.getByTestId("escalated-owner-icon");
			expect(svg).toHaveAttribute("width", "14");
			expect(svg).toHaveAttribute("height", "14");
			expect(svg.querySelector("circle")).toBeInTheDocument();
			expect(svg.querySelector("path")).toBeInTheDocument();
		});
	});

	describe("EscalatedToManagerIcon", () => {
		it("renders correctly", () => {
			render(<EscalatedToManagerIcon data-testid="escalated-manager-icon" />);
			const svg = screen.getByTestId("escalated-manager-icon");
			expect(svg).toBeInTheDocument();
			expect(svg.tagName).toBe("svg");
		});

		it("accepts className prop", () => {
			render(
				<EscalatedToManagerIcon
					className="manager-class"
					data-testid="escalated-manager-icon"
				/>,
			);
			const svg = screen.getByTestId("escalated-manager-icon");
			expect(svg).toHaveClass("manager-class");
		});

		it("has correct SVG structure with circle and path", () => {
			render(<EscalatedToManagerIcon data-testid="escalated-manager-icon" />);
			const svg = screen.getByTestId("escalated-manager-icon");
			expect(svg).toHaveAttribute("width", "14");
			expect(svg).toHaveAttribute("height", "14");
			expect(svg.querySelector("circle")).toBeInTheDocument();
			expect(svg.querySelector("path")).toBeInTheDocument();
		});
	});

	describe("OpenIcon", () => {
		it("renders correctly", () => {
			render(<OpenIcon data-testid="open-icon" />);
			const svg = screen.getByTestId("open-icon");
			expect(svg).toBeInTheDocument();
			expect(svg.tagName).toBe("svg");
		});

		it("accepts className prop", () => {
			render(<OpenIcon className="open-class" data-testid="open-icon" />);
			const svg = screen.getByTestId("open-icon");
			expect(svg).toHaveClass("open-class");
		});

		it("has correct SVG structure with two circles", () => {
			render(<OpenIcon data-testid="open-icon" />);
			const svg = screen.getByTestId("open-icon");
			expect(svg).toHaveAttribute("width", "14");
			expect(svg).toHaveAttribute("height", "14");
			expect(svg.querySelectorAll("circle")).toHaveLength(2);
		});
	});

	describe("InProgressIcon", () => {
		it("renders correctly", () => {
			render(<InProgressIcon data-testid="in-progress-icon" />);
			const svg = screen.getByTestId("in-progress-icon");
			expect(svg).toBeInTheDocument();
			expect(svg.tagName).toBe("svg");
		});

		it("accepts className prop", () => {
			render(
				<InProgressIcon
					className="progress-class"
					data-testid="in-progress-icon"
				/>,
			);
			const svg = screen.getByTestId("in-progress-icon");
			expect(svg).toHaveClass("progress-class");
		});

		it("has correct SVG structure with two circles", () => {
			render(<InProgressIcon data-testid="in-progress-icon" />);
			const svg = screen.getByTestId("in-progress-icon");
			expect(svg).toHaveAttribute("width", "14");
			expect(svg).toHaveAttribute("height", "14");
			expect(svg.querySelectorAll("circle")).toHaveLength(2);
		});
	});

	describe("ResolvedIcon", () => {
		it("renders correctly", () => {
			render(<ResolvedIcon data-testid="resolved-icon" />);
			const svg = screen.getByTestId("resolved-icon");
			expect(svg).toBeInTheDocument();
			expect(svg.tagName).toBe("svg");
		});

		it("accepts className prop", () => {
			render(
				<ResolvedIcon className="resolved-class" data-testid="resolved-icon" />,
			);
			const svg = screen.getByTestId("resolved-icon");
			expect(svg).toHaveClass("resolved-class");
		});

		it("has correct SVG structure with circle and checkmark path", () => {
			render(<ResolvedIcon data-testid="resolved-icon" />);
			const svg = screen.getByTestId("resolved-icon");
			expect(svg).toHaveAttribute("width", "14");
			expect(svg).toHaveAttribute("height", "14");
			expect(svg.querySelector("circle")).toBeInTheDocument();
			expect(svg.querySelector("path")).toBeInTheDocument();
		});
	});

	describe("StatusIcon component", () => {
		it("renders the correct icon for a valid status", () => {
			const { container } = render(<StatusIcon statusId="open" />);
			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();
		});

		it("renders null for invalid status", () => {
			const { container } = render(<StatusIcon statusId="invalid-status" />);
			const svg = container.querySelector("svg");
			expect(svg).not.toBeInTheDocument();
		});

		it("renders different icons for different statuses", () => {
			const { rerender, container } = render(<StatusIcon statusId="open" />);
			const openSvg = container.querySelector("svg");
			expect(openSvg).toBeInTheDocument();

			rerender(<StatusIcon statusId="resolved" />);
			const resolvedSvg = container.querySelector("svg");
			expect(resolvedSvg).toBeInTheDocument();
		});
	});

	describe("status array", () => {
		it("contains all status options", () => {
			expect(status).toHaveLength(5);
			expect(status.map((s) => s.id)).toEqual([
				"open",
				"in_progress",
				"resolved",
				"closed",
				"paused",
			]);
		});

		it("each status has required properties", () => {
			for (const s of status) {
				expect(s).toHaveProperty("id");
				expect(s).toHaveProperty("name");
				expect(s).toHaveProperty("color");
				expect(s).toHaveProperty("icon");
				expect(typeof s.icon).toBe("function");
			}
		});
	});
});
