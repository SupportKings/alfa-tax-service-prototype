import DashboardLayout from "@/features/dashboard/components/dashboard-layout";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("DashboardLayout", () => {
	const mockKpiCards = [
		{ title: "Total Sales", value: 100, subtitle: "+10%" },
		{ title: "Active Policies", value: 50 },
		{
			title: "Revenue",
			value: "$5,000",
			icon: <span data-testid="revenue-icon">$</span>,
		},
	];

	describe("Welcome section", () => {
		it("renders welcome message with user name", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(screen.getByText("Welcome back, John!")).toBeInTheDocument();
		});

		it("renders default subtitle", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(
				screen.getByText("Here's what's happening with your business today."),
			).toBeInTheDocument();
		});

		it("renders custom subtitle when provided", () => {
			render(
				<DashboardLayout
					welcomeName="John"
					subtitle="Custom subtitle message"
					kpiCards={mockKpiCards}
				>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(screen.getByText("Custom subtitle message")).toBeInTheDocument();
		});
	});

	describe("KPI Cards", () => {
		it("renders all KPI cards", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(screen.getByText("Total Sales")).toBeInTheDocument();
			expect(screen.getByText("Active Policies")).toBeInTheDocument();
			expect(screen.getByText("Revenue")).toBeInTheDocument();
		});

		it("renders KPI card values", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(screen.getByText("100")).toBeInTheDocument();
			expect(screen.getByText("50")).toBeInTheDocument();
			expect(screen.getByText("$5,000")).toBeInTheDocument();
		});

		it("renders KPI card subtitles when provided", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(screen.getByText("+10%")).toBeInTheDocument();
		});

		it("renders KPI card icons when provided", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(screen.getByTestId("revenue-icon")).toBeInTheDocument();
		});

		it("renders empty state when no KPI cards provided", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={[]}>
					<div>Content</div>
				</DashboardLayout>,
			);

			// Should still render welcome section
			expect(screen.getByText("Welcome back, John!")).toBeInTheDocument();
		});
	});

	describe("Children rendering", () => {
		it("renders children content", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div data-testid="child-content">Dashboard content</div>
				</DashboardLayout>,
			);

			expect(screen.getByTestId("child-content")).toBeInTheDocument();
			expect(screen.getByText("Dashboard content")).toBeInTheDocument();
		});

		it("renders multiple children", () => {
			render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div data-testid="content-1">First section</div>
					<div data-testid="content-2">Second section</div>
				</DashboardLayout>,
			);

			expect(screen.getByTestId("content-1")).toBeInTheDocument();
			expect(screen.getByTestId("content-2")).toBeInTheDocument();
		});
	});

	describe("Layout structure", () => {
		it("renders with proper spacing classes", () => {
			const { container } = render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(container.querySelector(".space-y-8")).toBeInTheDocument();
			expect(container.querySelector(".p-6")).toBeInTheDocument();
		});

		it("renders KPI grid with responsive classes", () => {
			const { container } = render(
				<DashboardLayout welcomeName="John" kpiCards={mockKpiCards}>
					<div>Content</div>
				</DashboardLayout>,
			);

			expect(container.querySelector(".grid")).toBeInTheDocument();
		});
	});
});
