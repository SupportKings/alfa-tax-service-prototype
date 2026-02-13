import {
	AvatarGroup,
	AvatarGroupTooltip,
} from "@/components/animate-ui/components/avatar-group";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
	motion: {
		div: ({
			children,
			initial,
			animate,
			exit,
			variants,
			transition,
			whileHover,
			whileTap,
			layoutId,
			...props
		}: React.ComponentProps<"div"> & Record<string, unknown>) => (
			<div {...props}>{children}</div>
		),
	},
	AnimatePresence: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
	LayoutGroup: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the tooltip component
vi.mock("@/components/animate-ui/components/tooltip", () => ({
	TooltipProvider: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tooltip-provider">{children}</div>
	),
	Tooltip: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tooltip">{children}</div>
	),
	TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tooltip-trigger">{children}</div>
	),
	TooltipContent: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tooltip-content">{children}</div>
	),
}));

describe("AvatarGroup", () => {
	const mockAvatars = [
		<div key="avatar1" data-testid="avatar-1">
			A
		</div>,
		<div key="avatar2" data-testid="avatar-2">
			B
		</div>,
		<div key="avatar3" data-testid="avatar-3">
			C
		</div>,
	];

	it("renders without crashing", () => {
		render(<AvatarGroup>{mockAvatars}</AvatarGroup>);
		expect(screen.getByTestId("avatar-1")).toBeInTheDocument();
		expect(screen.getByTestId("avatar-2")).toBeInTheDocument();
		expect(screen.getByTestId("avatar-3")).toBeInTheDocument();
	});

	it("renders all children avatars", () => {
		render(<AvatarGroup>{mockAvatars}</AvatarGroup>);
		const avatars = screen.getAllByTestId(/^avatar-/);
		expect(avatars).toHaveLength(3);
	});

	it("applies custom className", () => {
		const { container } = render(
			<AvatarGroup className="custom-class">{mockAvatars}</AvatarGroup>,
		);
		const group = container.querySelector('[data-slot="avatar-group"]');
		expect(group).toHaveClass("custom-class");
	});

	it("renders with data-slot attribute", () => {
		const { container } = render(<AvatarGroup>{mockAvatars}</AvatarGroup>);
		const group = container.querySelector('[data-slot="avatar-group"]');
		expect(group).toBeInTheDocument();
	});

	it("renders with default negative spacing class", () => {
		const { container } = render(<AvatarGroup>{mockAvatars}</AvatarGroup>);
		const group = container.querySelector('[data-slot="avatar-group"]');
		expect(group).toHaveClass("-space-x-2");
	});

	it("wraps children in TooltipProvider", () => {
		render(<AvatarGroup>{mockAvatars}</AvatarGroup>);
		expect(screen.getByTestId("tooltip-provider")).toBeInTheDocument();
	});

	it("renders each avatar in a tooltip trigger", () => {
		render(<AvatarGroup>{mockAvatars}</AvatarGroup>);
		const triggers = screen.getAllByTestId("tooltip-trigger");
		expect(triggers).toHaveLength(3);
	});

	it("accepts custom translate prop", () => {
		const { container } = render(
			<AvatarGroup translate="-50%">{mockAvatars}</AvatarGroup>,
		);
		const group = container.querySelector('[data-slot="avatar-group"]');
		expect(group).toBeInTheDocument();
	});

	it("accepts invertOverlap prop", () => {
		render(<AvatarGroup invertOverlap={true}>{mockAvatars}</AvatarGroup>);
		expect(screen.getByTestId("avatar-1")).toBeInTheDocument();
	});

	it("handles empty children array", () => {
		const { container } = render(<AvatarGroup>{[]}</AvatarGroup>);
		const group = container.querySelector('[data-slot="avatar-group"]');
		expect(group).toBeInTheDocument();
	});

	it("accepts custom transition prop", () => {
		const customTransition = { type: "tween", duration: 0.5 };
		render(
			<AvatarGroup transition={customTransition}>{mockAvatars}</AvatarGroup>,
		);
		expect(screen.getByTestId("avatar-1")).toBeInTheDocument();
	});

	it("passes tooltipProps to children", () => {
		render(
			<AvatarGroup tooltipProps={{ side: "bottom", sideOffset: 10 }}>
				{mockAvatars}
			</AvatarGroup>,
		);
		const tooltips = screen.getAllByTestId("tooltip");
		expect(tooltips).toHaveLength(3);
	});
});

describe("AvatarGroupTooltip", () => {
	it("renders tooltip content", () => {
		render(
			<AvatarGroupTooltip>
				<span>Tooltip Text</span>
			</AvatarGroupTooltip>,
		);
		expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();
	});

	it("passes props to TooltipContent", () => {
		render(
			<AvatarGroupTooltip>
				<span>Content</span>
			</AvatarGroupTooltip>,
		);
		expect(screen.getByText("Content")).toBeInTheDocument();
	});
});
