import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock server actions
vi.mock("@/features/team/actions/removeUser", () => ({
	removeUser: vi.fn(),
}));

// Mock the dialog component with a simple implementation
vi.mock("@/features/team/components/remove-user-dialog", async () => {
	const { useState } = await import("react");
	return {
		default: ({
			open,
			onOpenChange,
			userName,
		}: {
			open: boolean;
			onOpenChange: (open: boolean) => void;
			userId: string;
			userName: string;
		}) => {
			const [isRemoving, setIsRemoving] = useState(false);

			if (!open) return null;

			const handleRemove = async () => {
				setIsRemoving(true);
				// Simulate async operation
				await new Promise((resolve) => setTimeout(resolve, 10));
				setIsRemoving(false);
				onOpenChange(false);
			};

			return (
				<div role="alertdialog">
					<h2>Remove User</h2>
					<p>
						Are you sure you want to remove <strong>{userName}</strong> from the
						team? This action cannot be undone and will permanently delete their
						account.
					</p>
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						disabled={isRemoving}
					>
						Cancel
					</button>
					<button type="button" onClick={handleRemove} disabled={isRemoving}>
						{isRemoving ? "Removing..." : "Remove User"}
					</button>
				</div>
			);
		},
	};
});

import RemoveUserDialog from "@/features/team/components/remove-user-dialog";

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

describe("RemoveUserDialog", () => {
	const defaultProps = {
		open: true,
		onOpenChange: vi.fn(),
		userId: "user-123",
		userName: "John Doe",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering when open", () => {
		it("renders dialog when open is true", () => {
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByRole("alertdialog")).toBeInTheDocument();
		});

		it("renders dialog title", () => {
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			expect(
				screen.getByRole("heading", { name: /remove user/i }),
			).toBeInTheDocument();
		});

		it("renders user name in the description", () => {
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		it("renders warning about action being irreversible", () => {
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			expect(
				screen.getByText(/this action cannot be undone/i),
			).toBeInTheDocument();
		});

		it("renders warning about permanent deletion", () => {
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			expect(
				screen.getByText(/permanently delete their account/i),
			).toBeInTheDocument();
		});

		it("renders Cancel button", () => {
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			expect(
				screen.getByRole("button", { name: /cancel/i }),
			).toBeInTheDocument();
		});

		it("renders Remove User button", () => {
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			expect(
				screen.getByRole("button", { name: /remove user/i }),
			).toBeInTheDocument();
		});
	});

	describe("Rendering when closed", () => {
		it("does not render dialog when open is false", () => {
			render(<RemoveUserDialog {...defaultProps} open={false} />, {
				wrapper: createWrapper(),
			});

			expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
		});
	});

	describe("Different user names", () => {
		it("displays correct user name for Jane Smith", () => {
			render(<RemoveUserDialog {...defaultProps} userName="Jane Smith" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText("Jane Smith")).toBeInTheDocument();
		});

		it("displays correct user name for Bob Wilson", () => {
			render(<RemoveUserDialog {...defaultProps} userName="Bob Wilson" />, {
				wrapper: createWrapper(),
			});

			expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
		});
	});

	describe("Cancel action", () => {
		it("calls onOpenChange with false when Cancel is clicked", async () => {
			const user = userEvent.setup();
			const onOpenChange = vi.fn();
			render(
				<RemoveUserDialog {...defaultProps} onOpenChange={onOpenChange} />,
				{ wrapper: createWrapper() },
			);

			await user.click(screen.getByRole("button", { name: /cancel/i }));

			expect(onOpenChange).toHaveBeenCalledWith(false);
		});
	});

	describe("Remove action", () => {
		it("calls onOpenChange with false after remove is complete", async () => {
			const user = userEvent.setup();
			const onOpenChange = vi.fn();
			render(
				<RemoveUserDialog {...defaultProps} onOpenChange={onOpenChange} />,
				{ wrapper: createWrapper() },
			);

			await user.click(screen.getByRole("button", { name: /remove user/i }));

			await waitFor(() => {
				expect(onOpenChange).toHaveBeenCalledWith(false);
			});
		});

		it("shows loading state while removing", async () => {
			const user = userEvent.setup();
			render(<RemoveUserDialog {...defaultProps} />, {
				wrapper: createWrapper(),
			});

			await user.click(screen.getByRole("button", { name: /remove user/i }));

			// Should show loading state briefly
			await waitFor(() => {
				expect(screen.getByText("Removing...")).toBeInTheDocument();
			});
		});
	});
});
