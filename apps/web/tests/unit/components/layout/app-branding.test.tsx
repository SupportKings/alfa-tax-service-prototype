import AppBranding from "@/components/sidebar/app-branding";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock siteConfig
vi.mock("@/siteConfig", () => ({
	siteConfig: {
		name: "Test App",
		logo: {
			src: "/test-logo.png",
			light: "/test-logo-light.png",
			dark: "/test-logo-dark.png",
		},
	},
}));

describe("AppBranding", () => {
	it("renders without crashing", () => {
		render(<AppBranding />);
		expect(screen.getByText("Test App")).toBeInTheDocument();
	});

	it("displays the app name from siteConfig", () => {
		render(<AppBranding />);
		const appName = screen.getByText("Test App");
		expect(appName).toBeInTheDocument();
		expect(appName).toHaveClass("font-medium");
	});

	it("renders the logo image with correct attributes", () => {
		render(<AppBranding />);
		const logo = screen.getByRole("img");
		expect(logo).toBeInTheDocument();
		expect(logo).toHaveAttribute("alt", "Test App logo");
		expect(logo).toHaveAttribute("src", "/test-logo.png");
	});

	it("renders the container with correct styling", () => {
		const { container } = render(<AppBranding />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass("flex", "items-center", "justify-between");
	});

	it("renders logo with correct dimensions", () => {
		render(<AppBranding />);
		const logo = screen.getByRole("img");
		expect(logo).toHaveAttribute("width", "24");
		expect(logo).toHaveAttribute("height", "24");
	});

	it("has proper layout structure with logo and name", () => {
		const { container } = render(<AppBranding />);
		const innerDiv = container.querySelector(".flex.items-center.gap-2");
		expect(innerDiv).toBeInTheDocument();
		expect(innerDiv?.children.length).toBe(2); // Image and span
	});
});
