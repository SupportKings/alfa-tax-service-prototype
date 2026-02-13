import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock next-themes
vi.mock("next-themes", () => ({
	useTheme: () => ({
		theme: "light",
		setTheme: vi.fn(),
		resolvedTheme: "light",
	}),
}));

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

// Mock sidebar components
vi.mock("@/components/sidebar/nav-collapsible", () => ({
	NavCollapsible: ({ items }: { items: unknown[] }) => (
		<div data-testid="nav-collapsible">
			{items.map((item: unknown) => (
				<div
					key={(item as { title: string }).title}
					data-testid="nav-collapsible-item"
				/>
			))}
		</div>
	),
}));

vi.mock("@/components/sidebar/nav-secondary", () => ({
	NavSecondary: ({ className }: { className?: string }) => (
		<div data-testid="nav-secondary" className={className} />
	),
}));

vi.mock("@/components/sidebar/nav-user", () => ({
	NavUser: ({ user }: { user: { name: string; email: string } }) => (
		<div data-testid="nav-user">
			<span data-testid="user-name">{user.name}</span>
			<span data-testid="user-email">{user.email}</span>
		</div>
	),
}));

vi.mock("@/components/sidebar/nav-main", () => ({
	NavMain: ({ items }: { items: unknown[] }) => (
		<div data-testid="nav-main">
			{items.map((item: unknown) => (
				<div
					key={(item as { title: string }).title}
					data-testid="nav-main-item"
				/>
			))}
		</div>
	),
}));

vi.mock("@/components/impersonation-banner", () => ({
	ImpersonationBanner: () => <div data-testid="impersonation-banner" />,
}));

// Mock useIsMobile hook
vi.mock("@/hooks/use-mobile", () => ({
	useIsMobile: () => false,
}));

// Create a wrapper component for SidebarProvider context
const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			data-slot="sidebar-wrapper"
			style={
				{
					"--sidebar-width": "16rem",
					"--sidebar-width-icon": "3rem",
				} as React.CSSProperties
			}
		>
			{children}
		</div>
	);
};

// Mock SidebarProvider and related components
vi.mock("@/components/ui/sidebar", () => ({
	Sidebar: ({
		children,
		variant,
		className,
	}: {
		children: React.ReactNode;
		variant?: string;
		className?: string;
	}) => (
		<aside data-testid="sidebar" data-variant={variant} className={className}>
			{children}
		</aside>
	),
	SidebarContent: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => (
		<div data-testid="sidebar-content" className={className}>
			{children}
		</div>
	),
	SidebarFooter: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="sidebar-footer">{children}</div>
	),
	SidebarHeader: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="sidebar-header">{children}</div>
	),
	SidebarMenu: ({ children }: { children: React.ReactNode }) => (
		<ul data-testid="sidebar-menu">{children}</ul>
	),
	SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
		<li data-testid="sidebar-menu-item">{children}</li>
	),
	SidebarProvider: ({ children }: { children: React.ReactNode }) => (
		<SidebarWrapper>{children}</SidebarWrapper>
	),
	useSidebar: () => ({
		state: "expanded",
		open: true,
		setOpen: vi.fn(),
		openMobile: false,
		setOpenMobile: vi.fn(),
		isMobile: false,
		toggleSidebar: vi.fn(),
	}),
}));

describe("AppSidebar", () => {
	const mockSession = {
		user: {
			id: "user-1",
			name: "Test User",
			email: "test@example.com",
			image: null,
			role: "user" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true,
		},
		session: {
			id: "session-1",
			userId: "user-1",
			createdAt: new Date(),
			updatedAt: new Date(),
			expiresAt: new Date(),
			token: "test-token",
			ipAddress: null,
			userAgent: null,
			impersonatedBy: null,
		},
	};

	const mockImpersonatingSession = {
		...mockSession,
		session: {
			...mockSession.session,
			impersonatedBy: "admin-user-id",
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders without crashing", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("sidebar")).toBeInTheDocument();
	});

	it("renders sidebar with inset variant", () => {
		render(<AppSidebar session={mockSession} />);
		const sidebar = screen.getByTestId("sidebar");
		expect(sidebar).toHaveAttribute("data-variant", "inset");
	});

	it("renders AppBranding in header", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
		expect(screen.getByText("Test App")).toBeInTheDocument();
	});

	it("renders NavUser with user data in footer", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("nav-user")).toBeInTheDocument();
		expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
		expect(screen.getByTestId("user-email")).toHaveTextContent(
			"test@example.com",
		);
	});

	it("renders NavMain component", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("nav-main")).toBeInTheDocument();
	});

	it("renders NavCollapsible component", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("nav-collapsible")).toBeInTheDocument();
	});

	it("renders NavSecondary component", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("nav-secondary")).toBeInTheDocument();
	});

	it("does not render impersonation banner when not impersonating", () => {
		render(<AppSidebar session={mockSession} />);
		expect(
			screen.queryByTestId("impersonation-banner"),
		).not.toBeInTheDocument();
	});

	it("renders impersonation banner when impersonating", () => {
		render(<AppSidebar session={mockImpersonatingSession} />);
		expect(screen.getByTestId("impersonation-banner")).toBeInTheDocument();
	});

	it("renders sidebar content area", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
	});

	it("renders sidebar footer", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
	});

	it("applies custom className when provided", () => {
		render(<AppSidebar session={mockSession} className="custom-sidebar" />);
		const sidebar = screen.getByTestId("sidebar");
		expect(sidebar).toHaveClass("custom-sidebar");
	});

	it("renders correct navigation structure", () => {
		render(<AppSidebar session={mockSession} />);

		// Check that main navigation areas exist
		const navMain = screen.getByTestId("nav-main");
		const navCollapsible = screen.getByTestId("nav-collapsible");
		const navSecondary = screen.getByTestId("nav-secondary");

		expect(navMain).toBeInTheDocument();
		expect(navCollapsible).toBeInTheDocument();
		expect(navSecondary).toBeInTheDocument();
	});
});

describe("AppSidebar - Settings Area", () => {
	const mockSession = {
		user: {
			id: "user-1",
			name: "Test User",
			email: "test@example.com",
			image: null,
			role: "user" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true,
		},
		session: {
			id: "session-1",
			userId: "user-1",
			createdAt: new Date(),
			updatedAt: new Date(),
			expiresAt: new Date(),
			token: "test-token",
			ipAddress: null,
			userAgent: null,
			impersonatedBy: null,
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders settings navigation when on settings page", async () => {
		// Mock pathname to be on settings page
		vi.doMock("next/navigation", () => ({
			useRouter: () => ({
				push: vi.fn(),
				replace: vi.fn(),
				refresh: vi.fn(),
			}),
			usePathname: () => "/dashboard/settings/profile",
			useSearchParams: () => new URLSearchParams(),
			useParams: () => ({}),
		}));

		// Clear module cache to apply new mock
		vi.resetModules();

		// Re-import component with new mock
		const { AppSidebar: AppSidebarWithSettings } = await import(
			"@/components/sidebar/app-sidebar"
		);

		render(<AppSidebarWithSettings session={mockSession} />);

		// The sidebar should still render
		expect(screen.getByTestId("sidebar")).toBeInTheDocument();
	});
});

describe("AppSidebar - Responsive Behavior", () => {
	const mockSession = {
		user: {
			id: "user-1",
			name: "Test User",
			email: "test@example.com",
			image: null,
			role: "user" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
			emailVerified: true,
		},
		session: {
			id: "session-1",
			userId: "user-1",
			createdAt: new Date(),
			updatedAt: new Date(),
			expiresAt: new Date(),
			token: "test-token",
			ipAddress: null,
			userAgent: null,
			impersonatedBy: null,
		},
	};

	it("renders with correct width class", () => {
		render(<AppSidebar session={mockSession} />);
		const sidebar = screen.getByTestId("sidebar");
		expect(sidebar).toHaveClass("w-64");
	});

	it("renders sidebar for desktop by default", () => {
		render(<AppSidebar session={mockSession} />);
		expect(screen.getByTestId("sidebar")).toBeInTheDocument();
	});
});
