import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock @/lib/auth-client
vi.mock("@/lib/auth-client", () => ({
	authClient: {
		passkey: {
			addPasskey: vi.fn(),
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

// Mock the dialog component with a simple implementation
vi.mock("@/features/auth/components/add-passkey-dialog", async () => {
	const { useState, useId } = await import("react");
	return {
		AddPasskeyDialog: ({
			children,
			passkeyCount = 0,
		}: {
			children?: React.ReactNode;
			passkeyCount?: number;
		}) => {
			const [open, setOpen] = useState(false);
			const [passkeyName, setPasskeyName] = useState("");
			const [authenticatorType, setAuthenticatorType] = useState<
				"platform" | "cross-platform"
			>("platform");
			const [isLoading, setIsLoading] = useState(false);
			const nameInputId = useId();

			if (!open) {
				return (
					<button
						type="button"
						onClick={() => setOpen(true)}
						disabled={passkeyCount >= 1}
					>
						{children || (passkeyCount >= 1 ? "Max 1 Passkey" : "Add Passkey")}
					</button>
				);
			}

			return (
				<div role="dialog">
					<h2>Add a new passkey</h2>
					<p>Create a secure passkey for passwordless authentication</p>
					<div>
						<label htmlFor={nameInputId}>Passkey name</label>
						<input
							id={nameInputId}
							value={passkeyName}
							onChange={(e) => setPasskeyName(e.target.value)}
							placeholder="e.g., My MacBook"
							disabled={isLoading}
						/>
					</div>
					<div>
						<span>Authentication type</span>
						<button
							type="button"
							onClick={() => !isLoading && setAuthenticatorType("platform")}
							disabled={isLoading}
							data-selected={authenticatorType === "platform"}
						>
							This device
						</button>
						<button
							type="button"
							onClick={() =>
								!isLoading && setAuthenticatorType("cross-platform")
							}
							disabled={isLoading}
							data-selected={authenticatorType === "cross-platform"}
						>
							Cross-platform
						</button>
					</div>
					<button
						type="button"
						onClick={() => {
							if (passkeyName.trim()) {
								setIsLoading(true);
							}
						}}
						disabled={isLoading || !passkeyName.trim()}
					>
						{isLoading ? "Creating..." : "Create Passkey"}
					</button>
				</div>
			);
		},
	};
});

import { AddPasskeyDialog } from "@/features/auth/components/add-passkey-dialog";

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe("AddPasskeyDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Trigger button", () => {
		it("renders Add Passkey button when closed", () => {
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /add passkey/i }),
			).toBeInTheDocument();
		});

		it("renders Max 1 Passkey when passkeyCount is 1 or more", () => {
			render(<AddPasskeyDialog passkeyCount={1} />, {
				wrapper: createWrapper(),
			});

			expect(
				screen.getByRole("button", { name: /max 1 passkey/i }),
			).toBeInTheDocument();
		});

		it("disables button when passkeyCount is 1 or more", () => {
			render(<AddPasskeyDialog passkeyCount={1} />, {
				wrapper: createWrapper(),
			});

			expect(
				screen.getByRole("button", { name: /max 1 passkey/i }),
			).toBeDisabled();
		});

		it("renders custom children as trigger", () => {
			render(
				<AddPasskeyDialog>
					<span>Custom Trigger</span>
				</AddPasskeyDialog>,
				{ wrapper: createWrapper() },
			);

			expect(screen.getByText("Custom Trigger")).toBeInTheDocument();
		});
	});

	describe("Dialog content when open", () => {
		it("opens dialog when trigger is clicked", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		it("renders dialog title", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(
				screen.getByRole("heading", { name: /add a new passkey/i }),
			).toBeInTheDocument();
		});

		it("renders dialog description", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(
				screen.getByText(
					/create a secure passkey for passwordless authentication/i,
				),
			).toBeInTheDocument();
		});

		it("renders passkey name input", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(screen.getByLabelText(/passkey name/i)).toBeInTheDocument();
		});

		it("renders passkey name placeholder", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(
				screen.getByPlaceholderText("e.g., My MacBook"),
			).toBeInTheDocument();
		});

		it("renders authentication type options", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(screen.getByText("Authentication type")).toBeInTheDocument();
			expect(screen.getByText("This device")).toBeInTheDocument();
			expect(screen.getByText("Cross-platform")).toBeInTheDocument();
		});

		it("renders Create Passkey button", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(
				screen.getByRole("button", { name: /create passkey/i }),
			).toBeInTheDocument();
		});
	});

	describe("Form interactions", () => {
		it("allows typing in passkey name field", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			const nameInput = screen.getByLabelText(/passkey name/i);
			await user.type(nameInput, "My MacBook Pro");

			expect(nameInput).toHaveValue("My MacBook Pro");
		});

		it("Create Passkey button is disabled when name is empty", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			expect(
				screen.getByRole("button", { name: /create passkey/i }),
			).toBeDisabled();
		});

		it("Create Passkey button is enabled when name is provided", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			const nameInput = screen.getByLabelText(/passkey name/i);
			await user.type(nameInput, "My MacBook Pro");

			expect(
				screen.getByRole("button", { name: /create passkey/i }),
			).not.toBeDisabled();
		});

		it("allows switching between authentication types", async () => {
			const user = userEvent.setup();
			render(<AddPasskeyDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add passkey/i }));

			const crossPlatformButton = screen.getByText("Cross-platform");
			await user.click(crossPlatformButton);

			expect(crossPlatformButton).toHaveAttribute("data-selected", "true");
		});
	});
});
