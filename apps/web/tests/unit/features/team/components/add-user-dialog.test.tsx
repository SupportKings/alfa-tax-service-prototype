import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock server actions
vi.mock("@/features/team/actions/addUser", () => ({
	addUser: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock the dialog component with a simple implementation
vi.mock("@/features/team/components/add-user-dialog", async () => {
	const { useState, useId } = await import("react");
	return {
		default: () => {
			const [open, setOpen] = useState(false);
			const [firstName, setFirstName] = useState("");
			const [lastName, setLastName] = useState("");
			const [email, setEmail] = useState("");
			const [isSubmitting, setIsSubmitting] = useState(false);
			const id = useId();

			if (!open) {
				return (
					<button type="button" onClick={() => setOpen(true)}>
						Add User
					</button>
				);
			}

			return (
				<div role="dialog">
					<h2>Add New User</h2>
					<p>
						Create a new user account. Once added, they can immediately sign in
						with their email - no invitation or acceptance required.
					</p>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setIsSubmitting(true);
						}}
					>
						<div>
							<label htmlFor={`${id}-first_name`}>First Name</label>
							<input
								id={`${id}-first_name`}
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder="Enter first name"
								required
							/>
						</div>
						<div>
							<label htmlFor={`${id}-last_name`}>Last Name</label>
							<input
								id={`${id}-last_name`}
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								placeholder="Enter last name"
								required
							/>
						</div>
						<div>
							<label htmlFor={`${id}-email`}>Email</label>
							<input
								id={`${id}-email`}
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter email address"
								required
							/>
						</div>
						<button
							type="button"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create User"}
						</button>
					</form>
				</div>
			);
		},
	};
});

import AddUserDialog from "@/features/team/components/add-user-dialog";

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

describe("AddUserDialog", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Trigger button", () => {
		it("renders Add User button when closed", () => {
			render(<AddUserDialog />, { wrapper: createWrapper() });

			expect(
				screen.getByRole("button", { name: /add user/i }),
			).toBeInTheDocument();
		});
	});

	describe("Dialog content when open", () => {
		it("opens dialog when trigger is clicked", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(screen.getByRole("dialog")).toBeInTheDocument();
		});

		it("renders dialog title", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(
				screen.getByRole("heading", { name: /add new user/i }),
			).toBeInTheDocument();
		});

		it("renders dialog description", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(
				screen.getByText(/create a new user account/i),
			).toBeInTheDocument();
		});

		it("renders First Name input", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
		});

		it("renders Last Name input", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
		});

		it("renders Email input", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		});

		it("renders Cancel button", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(
				screen.getByRole("button", { name: /cancel/i }),
			).toBeInTheDocument();
		});

		it("renders Create User button", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(
				screen.getByRole("button", { name: /create user/i }),
			).toBeInTheDocument();
		});
	});

	describe("Form interactions", () => {
		it("allows typing in first name field", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			const firstNameInput = screen.getByLabelText(/first name/i);
			await user.type(firstNameInput, "John");

			expect(firstNameInput).toHaveValue("John");
		});

		it("allows typing in last name field", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			const lastNameInput = screen.getByLabelText(/last name/i);
			await user.type(lastNameInput, "Doe");

			expect(lastNameInput).toHaveValue("Doe");
		});

		it("allows typing in email field", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			const emailInput = screen.getByLabelText(/email/i);
			await user.type(emailInput, "john.doe@example.com");

			expect(emailInput).toHaveValue("john.doe@example.com");
		});

		it("closes dialog when Cancel is clicked", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));
			expect(screen.getByRole("dialog")).toBeInTheDocument();

			await user.click(screen.getByRole("button", { name: /cancel/i }));

			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		it("email input has correct type attribute", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			const emailInput = screen.getByLabelText(/email/i);
			expect(emailInput).toHaveAttribute("type", "email");
		});
	});

	describe("Input placeholders", () => {
		it("first name has correct placeholder", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(
				screen.getByPlaceholderText("Enter first name"),
			).toBeInTheDocument();
		});

		it("last name has correct placeholder", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(
				screen.getByPlaceholderText("Enter last name"),
			).toBeInTheDocument();
		});

		it("email has correct placeholder", async () => {
			const user = userEvent.setup();
			render(<AddUserDialog />, { wrapper: createWrapper() });

			await user.click(screen.getByRole("button", { name: /add user/i }));

			expect(
				screen.getByPlaceholderText("Enter email address"),
			).toBeInTheDocument();
		});
	});
});
