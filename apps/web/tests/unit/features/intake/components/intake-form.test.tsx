import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// Mock the submitIntake action
vi.mock("@/features/intake/actions/submitIntake", () => ({
	submitIntakeAction: vi.fn().mockResolvedValue({
		data: { success: true, data: { message: "Submitted" } },
	}),
}));

// Mock sonner
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

import IntakeForm from "@/features/intake/components/intake-form";

describe("IntakeForm", () => {
	it("renders the form with all required fields", () => {
		render(<IntakeForm />);

		expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
		expect(screen.getByText("Individual")).toBeInTheDocument();
		expect(screen.getByText("Business")).toBeInTheDocument();
	});

	it("renders all service options", () => {
		render(<IntakeForm />);

		expect(screen.getByText("Personal Tax Return")).toBeInTheDocument();
		expect(screen.getByText("Business Tax Return")).toBeInTheDocument();
		expect(screen.getByText("Bookkeeping")).toBeInTheDocument();
		expect(screen.getByText("Advisory / Tax Planning")).toBeInTheDocument();
		expect(screen.getByText("Business Formation")).toBeInTheDocument();
		expect(screen.getByText("Sales Tax")).toBeInTheDocument();
		expect(screen.getByText("Payroll")).toBeInTheDocument();
	});

	it("renders the submit button", () => {
		render(<IntakeForm />);
		expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
	});

	it("renders document upload section", () => {
		render(<IntakeForm />);
		expect(screen.getByText(/upload documents/i)).toBeInTheDocument();
		expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
	});

	it("renders additional notes section", () => {
		render(<IntakeForm />);
		expect(screen.getByText(/additional notes/i)).toBeInTheDocument();
	});

	it("shows validation errors when submitting empty form", async () => {
		const user = userEvent.setup();
		render(<IntakeForm />);

		const submitButton = screen.getByRole("button", { name: /submit/i });
		await user.click(submitButton);

		expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
	});

	it("allows selecting client type", async () => {
		const user = userEvent.setup();
		render(<IntakeForm />);

		const individualButton = screen.getByText("Individual");
		await user.click(individualButton);

		// The button should have the selected style (contains border-primary)
		expect(individualButton.closest("button")).toHaveClass("border-primary");
	});

	it("shows success state after successful submission", async () => {
		const user = userEvent.setup();
		render(<IntakeForm />);

		// Fill out the form
		await user.type(screen.getByLabelText(/first name/i), "Tony");
		await user.type(screen.getByLabelText(/last name/i), "Devilich");
		await user.type(screen.getByLabelText(/email/i), "tony@example.com");
		await user.type(screen.getByLabelText(/phone/i), "(210) 555-0100");

		// Select client type
		await user.click(screen.getByText("Individual"));

		// Select a service
		await user.click(screen.getByText("Personal Tax Return"));

		// Submit
		await user.click(screen.getByRole("button", { name: /submit/i }));

		// Should show success message
		expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
	});
});
