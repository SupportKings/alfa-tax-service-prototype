import { z } from "zod";

// ============================
// Service Options
// ============================

export const SERVICE_OPTIONS = [
	"Personal Tax Return",
	"Business Tax Return",
	"Bookkeeping",
	"Advisory / Tax Planning",
	"Business Formation",
	"Sales Tax",
	"Payroll",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

// ============================
// Client Type Options
// ============================

export const CLIENT_TYPE_OPTIONS = ["Individual", "Business"] as const;
export type ClientTypeOption = (typeof CLIENT_TYPE_OPTIONS)[number];

// ============================
// Source Channel Options
// ============================

export const SOURCE_OPTIONS = ["Website", "Email", "Phone", "Text"] as const;
export type SourceOption = (typeof SOURCE_OPTIONS)[number];

// ============================
// Zod Schemas
// ============================

export const intakeFormSchema = z.object({
	first_name: z
		.string()
		.min(1, "First name is required")
		.max(50, "Must be less than 50 characters")
		.transform((val) => val.trim()),
	last_name: z
		.string()
		.min(1, "Last name is required")
		.max(50, "Must be less than 50 characters")
		.transform((val) => val.trim()),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address")
		.max(100, "Email must be less than 100 characters")
		.toLowerCase()
		.transform((val) => val.trim()),
	phone: z
		.string()
		.min(1, "Phone number is required")
		.max(20, "Phone number is too long")
		.transform((val) => val.trim()),
	client_type: z.enum(CLIENT_TYPE_OPTIONS, {
		message: "Please select individual or business",
	}),
	services: z
		.array(z.enum(SERVICE_OPTIONS))
		.min(1, "Please select at least one service"),
	notes: z
		.string()
		.max(2000, "Notes must be less than 2000 characters")
		.optional()
		.default(""),
});

export type IntakeFormInput = z.infer<typeof intakeFormSchema>;

// ============================
// Intake Submission Interface
// ============================

export interface IntakeSubmission {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	client_type: ClientTypeOption;
	services: string[];
	notes: string;
	source: SourceOption;
	created_at: string;
	documents: IntakeDocument[];
}

export interface IntakeDocument {
	id: string;
	intake_submission_id: string;
	file_name: string;
	file_url: string;
	file_size: number;
	file_type: string;
	created_at: string;
}
