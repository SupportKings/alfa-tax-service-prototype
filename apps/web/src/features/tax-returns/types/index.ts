export type TaxReturnComplexity = "Simple" | "Standard" | "Complex";

export interface TaxReturn {
	id: string;
	taxReturnNumber: string;
	clientId: string;
	clientName: string;
	clientType: "Individual" | "Business";
	contactName: string;
	contactRole: string;
	contactEmail: string;
	contactPhone: string;
	taxYear: number;
	returnType: "Individual" | "Business" | "Sales Tax" | "Amended";
	status: TaxReturnStatus;
	complexity: TaxReturnComplexity;
	pendingKathyReview: boolean;
	intakeMethod: "In-Person" | "Virtual/TaxDome";
	dueDate: string;
	amount: number;
	paymentReceivedAt: string | null;
	hasAuditProtection: boolean;
	hasIdentityProtection: boolean;
	internalNotes: string;
	documents: TaxReturnDocument[];
	assignments: TaxReturnAssignment[];
	createdAt: string;
	statusChangedAt: string;
}

export type TaxReturnStatus =
	| "Not Started"
	| "Intake"
	| "Documents Gathering"
	| "In Preparation"
	| "In Review"
	| "Waiting on Client"
	| "Ready to File"
	| "E-Filed"
	| "Complete";

export interface TaxReturnDocument {
	id: string;
	documentType: string;
	status: DocumentStatus;
	taxYear: number;
	fileUrl: string | null;
	notes: string;
}

export type DocumentStatus =
	| "Not Requested"
	| "Requested"
	| "Submitted"
	| "Verified";

export interface TaxReturnAssignment {
	id: string;
	teamMemberName: string;
	teamMemberTitle: string;
	assignmentRole: string;
}

export interface TaxReturnFilterState {
	status: TaxReturnStatus | "all";
	returnType: "all" | "Individual" | "Business" | "Sales Tax" | "Amended";
	complexity: "all" | TaxReturnComplexity;
	taxYear: "all" | number;
}

export interface StatusDistribution {
	status: string;
	count: number;
	fill: string;
}

export interface CompletionTrend {
	week: string;
	completed: number;
}

export interface DaysInStatusData {
	status: string;
	days: number;
}

export interface DocumentCompletionData {
	documentType: string;
	verified: number;
	pending: number;
}
