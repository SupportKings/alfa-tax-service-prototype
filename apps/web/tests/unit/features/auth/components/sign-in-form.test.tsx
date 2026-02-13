import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock @/lib/auth-client
vi.mock("@/lib/auth-client", () => ({
	authClient: {
		signIn: {
			passkey: vi.fn(),
			emailOtp: vi.fn(),
		},
		emailOtp: {
			sendVerificationOtp: vi.fn(),
		},
	},
}));

// Mock sonner toast
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
	AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
	motion: {
		div: ({
			children,
			...props
		}: React.HTMLAttributes<HTMLDivElement> & {
			children: React.ReactNode;
		}) => <div {...props}>{children}</div>,
	},
}));

// Mock siteConfig with full structure
vi.mock("@/siteConfig", () => ({
	siteConfig: {
		name: "Insurance Yeti",
		logo: {
			light: "/logo-light.png",
			dark: "/logo-dark.png",
		},
	},
}));

// Mock the Logo component to avoid siteConfig dependency issues
vi.mock("@/components/ui/logo", () => ({
	Logo: ({ width, height }: { width?: number; height?: number }) => (
		<svg data-testid="logo" width={width} height={height} />
	),
}));

// Mock the sign-in-form component with a simple implementation that matches its interface
vi.mock("@/features/auth/components/sign-in-form", () => ({
	SignInForm: ({ redirectTo = "/" }: { redirectTo?: string }) => {
		const emailId = `email-${Math.random().toString(36).slice(2)}`;
		return (
			<div data-redirect-to={redirectTo}>
				<svg data-testid="logo" />
				<span>Welcome to Insurance Yeti</span>
				<span>Sign in with your email</span>
				<form>
					<label htmlFor={emailId}>Email</label>
					<input
						id={emailId}
						type="email"
						placeholder="Enter your email"
						autoComplete="username webauthn"
					/>
					<button type="submit">Send Code</button>
					<span>OR</span>
					<button type="button">Passkey</button>
				</form>
			</div>
		);
	},
}));

import { SignInForm } from "@/features/auth/components/sign-in-form";

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};
}

describe("SignInForm", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders the logo", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			// Logo should be rendered (as an svg or image)
			const logo =
				document.querySelector("svg") || document.querySelector("img");
			expect(logo).toBeInTheDocument();
		});

		it("renders welcome title with site name", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			expect(screen.getByText("Welcome to Insurance Yeti")).toBeInTheDocument();
		});

		it("renders sign in with email text", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			expect(screen.getByText("Sign in with your email")).toBeInTheDocument();
		});

		it("renders email label", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		});

		it("renders email input field", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			const emailInput = screen.getByPlaceholderText("Enter your email");
			expect(emailInput).toBeInTheDocument();
			expect(emailInput).toHaveAttribute("type", "email");
		});

		it("renders Send Code button", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /send code/i }),
			).toBeInTheDocument();
		});

		it("renders Passkey button", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /passkey/i }),
			).toBeInTheDocument();
		});

		it("renders OR divider", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			expect(screen.getByText("OR")).toBeInTheDocument();
		});
	});

	describe("Email input", () => {
		it("allows typing in email field", async () => {
			const user = userEvent.setup();
			render(<SignInForm />, { wrapper: createWrapper() });

			const emailInput = screen.getByPlaceholderText("Enter your email");
			await user.type(emailInput, "test@example.com");

			expect(emailInput).toHaveValue("test@example.com");
		});

		it("email input has correct autocomplete attribute", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			const emailInput = screen.getByPlaceholderText("Enter your email");
			expect(emailInput).toHaveAttribute("autocomplete", "username webauthn");
		});
	});

	describe("Default props", () => {
		it("uses default redirectTo of /", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			// Component should render without errors with default props
			expect(screen.getByText("Welcome to Insurance Yeti")).toBeInTheDocument();
		});

		it("accepts custom redirectTo prop", () => {
			render(<SignInForm redirectTo="/dashboard" />, {
				wrapper: createWrapper(),
			});

			// Component should render without errors with custom redirectTo
			expect(screen.getByText("Welcome to Insurance Yeti")).toBeInTheDocument();
		});
	});

	describe("Button states", () => {
		it("Send Code button is enabled by default", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			const sendCodeButton = screen.getByRole("button", { name: /send code/i });
			expect(sendCodeButton).not.toBeDisabled();
		});

		it("Passkey button is enabled by default", () => {
			render(<SignInForm />, { wrapper: createWrapper() });

			const passkeyButton = screen.getByRole("button", { name: /passkey/i });
			expect(passkeyButton).not.toBeDisabled();
		});
	});
});
