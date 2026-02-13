// ============================
// Advisory Engagement Types for Alfa Tax Service Prototype
// ============================

export type AdvisoryEngagementType =
	| "Tax Plan"
	| "Tax Plan + Books"
	| "Financial Management"
	| "Advisory Hourly"
	| "Ad-Hoc";

export type AdvisoryEngagementStatus =
	| "Inquiry"
	| "Discovery Call"
	| "Proposal Sent"
	| "Signed"
	| "Documents Gathering"
	| "Analysis"
	| "Presentation Scheduled"
	| "Presentation Complete"
	| "Implementation"
	| "Complete";

export type AdvisoryBillingType = "One-Time" | "Hourly" | "Annual";

export type AdvisoryDocumentType =
	| "Tax Return"
	| "Income Statement"
	| "Balance Sheet"
	| "Profit/Loss"
	| "Engagement Form"
	| "Consent Form";

export type AdvisoryDocumentStatus =
	| "Not Requested"
	| "Requested"
	| "Needs Help"
	| "Wrong Document"
	| "Submitted"
	| "Verified";

export type AdvisoryAssignmentRole =
	| "Owner"
	| "Preparer"
	| "Reviewer"
	| "Data Entry"
	| "Backup";

export interface AdvisoryDocument {
	id: string;
	engagement_id: string;
	document_type: AdvisoryDocumentType;
	status: AdvisoryDocumentStatus;
	file_url: string | null;
	uploaded_at: string | null;
}

export interface AdvisoryAssignment {
	id: string;
	engagement_id: string;
	team_member_name: string;
	team_member_title: string;
	role: AdvisoryAssignmentRole;
}

export interface AdvisoryEngagement {
	id: string;
	engagement_number: string;
	client_id: string;
	client_name: string;
	engagement_type: AdvisoryEngagementType;
	status: AdvisoryEngagementStatus;
	amount: number;
	billing_type: AdvisoryBillingType;
	hourly_rate: number | null;
	implementation_offered: boolean;
	internal_notes: string;
	created_at: string;
	updated_at: string;
	documents: AdvisoryDocument[];
	assignments: AdvisoryAssignment[];
}

// ============================
// Chart Data Types
// ============================

export interface AdvisoryQuarterlyRevenue {
	quarter: string;
	revenue: number;
}

export interface AdvisoryEngagementDuration {
	type: string;
	avgDays: number;
}

export interface AdvisoryRevenueByType {
	type: string;
	revenue: number;
}
