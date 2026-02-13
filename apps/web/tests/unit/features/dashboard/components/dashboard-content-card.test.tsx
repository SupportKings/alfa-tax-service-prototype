import DashboardContentCard from "@/features/dashboard/components/dashboard-content-card";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("DashboardContentCard", () => {
	describe("Rendering", () => {
		it("renders with title", () => {
			render(
				<DashboardContentCard title="Test Title">
					<p>Content</p>
				</DashboardContentCard>,
			);

			expect(screen.getByText("Test Title")).toBeInTheDocument();
		});

		it("renders children content", () => {
			render(
				<DashboardContentCard title="Test Title">
					<p>Test child content</p>
				</DashboardContentCard>,
			);

			expect(screen.getByText("Test child content")).toBeInTheDocument();
		});

		it("renders with subtitle when provided", () => {
			render(
				<DashboardContentCard title="Test Title" subtitle="Test Subtitle">
					<p>Content</p>
				</DashboardContentCard>,
			);

			expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
		});

		it("does not render subtitle when not provided", () => {
			render(
				<DashboardContentCard title="Test Title">
					<p>Content</p>
				</DashboardContentCard>,
			);

			expect(screen.queryByText("Test Subtitle")).not.toBeInTheDocument();
		});
	});

	describe("Styling", () => {
		it("applies custom className when provided", () => {
			const { container } = render(
				<DashboardContentCard title="Test Title" className="custom-class">
					<p>Content</p>
				</DashboardContentCard>,
			);

			expect(container.querySelector(".custom-class")).toBeInTheDocument();
		});

		it("renders with base card styles", () => {
			const { container } = render(
				<DashboardContentCard title="Test Title">
					<p>Content</p>
				</DashboardContentCard>,
			);

			expect(container.querySelector(".rounded-lg")).toBeInTheDocument();
			expect(container.querySelector(".bg-card")).toBeInTheDocument();
		});
	});

	describe("Children handling", () => {
		it("accepts single child element", () => {
			render(
				<DashboardContentCard title="Test Title">
					<div data-testid="single-child">Single child</div>
				</DashboardContentCard>,
			);

			expect(screen.getByTestId("single-child")).toBeInTheDocument();
		});

		it("accepts multiple children elements", () => {
			render(
				<DashboardContentCard title="Test Title">
					<div data-testid="child-1">First child</div>
					<div data-testid="child-2">Second child</div>
				</DashboardContentCard>,
			);

			expect(screen.getByTestId("child-1")).toBeInTheDocument();
			expect(screen.getByTestId("child-2")).toBeInTheDocument();
		});

		it("accepts complex nested children", () => {
			render(
				<DashboardContentCard title="Test Title">
					<ul>
						<li>Item 1</li>
						<li>Item 2</li>
					</ul>
				</DashboardContentCard>,
			);

			expect(screen.getByText("Item 1")).toBeInTheDocument();
			expect(screen.getByText("Item 2")).toBeInTheDocument();
		});
	});
});
