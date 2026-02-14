// ============================
// Client Types for Alfa Tax Service Prototype
// ============================

export interface Client {
	id: string;
	full_name: string;
	email: string;
	phone: string;
	status: ClientStatus;
	client_type: ClientType;
	quality: ClientQuality;
	qualityScore: ClientQualityScore;
	avgResponseDays: number;
	language: LanguagePreference;
	source: ClientSource;
	// Business Details
	industry: ClientIndustry | null;
	legal_structure: LegalStructure | null;
	state_of_incorporation: string | null;
	date_of_incorporation: string | null;
	website: string | null;
	tax_id_ein: string | null;
	state_tax_id: string | null;
	registered_agent: string | null;
	// Internal
	internal_notes: string;
	created_at: string;
}

export type ClientStatus =
	| "New Lead"
	| "Prospect"
	| "Active"
	| "On Hold"
	| "Churned";
export type ClientType = "Individual" | "Business";
export type ClientQuality = "Great" | "Good" | "Okay" | "Difficult";
export type ClientQualityScore = "excellent" | "good" | "fair" | "poor";
export type LanguagePreference = "English" | "Spanish" | "Both";
export type ClientSource =
	| "Referral"
	| "Website"
	| "Phone"
	| "Email"
	| "WhatsApp";
export type ClientIndustry =
	| "Construction"
	| "Ecommerce"
	| "Professional Services"
	| "Other";
export type LegalStructure =
	| "LLC"
	| "S-Corp"
	| "C-Corp"
	| "Sole Prop"
	| "Partnership";

// ============================
// Related Entity Types
// ============================

export interface Contact {
	id: string;
	company_id: string;
	full_name: string;
	email: string;
	phone: string;
	role: string;
	is_primary: boolean;
	date_of_birth: string | null;
	ssn_last_four: string | null;
}

export interface TaxReturn {
	id: string;
	company_id: string;
	tax_return_number: string;
	tax_year: number;
	return_type: TaxReturnType;
	status: TaxReturnStatus;
	complexity: TaxComplexity;
	due_at: string;
	amount: number;
}

export type TaxReturnType = "Individual" | "Business" | "Sales Tax" | "Amended";
export type TaxReturnStatus =
	| "New"
	| "Data Entry"
	| "Tax Prep"
	| "Manager Review"
	| "Client Review"
	| "Ready to E-File"
	| "Complete"
	| "Blocked";
export type TaxComplexity = "Simple" | "Standard" | "Complex";

export interface AdvisoryEngagement {
	id: string;
	company_id: string;
	engagement_number: string;
	engagement_type: AdvisoryType;
	status: AdvisoryStatus;
	amount: number;
	billing_type: BillingType;
}

export type AdvisoryType =
	| "Tax Plan"
	| "Tax Plan + Books"
	| "Financial Management"
	| "Advisory Hourly"
	| "Ad-Hoc";
export type AdvisoryStatus =
	| "Discovery"
	| "Document Collection"
	| "In Review"
	| "Presentation"
	| "Implementation"
	| "Complete";
export type BillingType = "One-Time" | "Hourly" | "Annual";

export interface BusinessFormation {
	id: string;
	company_id: string;
	formation_number: string;
	entity_type: LegalStructure;
	status: FormationStatus;
	state_of_incorporation: string;
	confirmed_name: string | null;
}

export type FormationStatus =
	| "Intake"
	| "Name Search"
	| "State Filing"
	| "EIN Application"
	| "Waiting on State Tax ID"
	| "Complete";

export interface CompanyPurchase {
	id: string;
	company_id: string;
	service_name: string;
	status: PurchaseStatus;
	price: number;
	frequency: ServiceFrequency;
	start_date: string;
}

export type PurchaseStatus =
	| "Pending Setup"
	| "Active - Current"
	| "Active - Behind"
	| "Paused"
	| "Cancelled"
	| "Completed";
export type ServiceFrequency =
	| "One-Time"
	| "Monthly"
	| "Quarterly"
	| "Annually";

export interface ClientDocument {
	id: string;
	company_id: string;
	document_type: DocumentType;
	status: DocumentStatus;
	tax_year: number;
	related_entity_type: string;
	file_url: string | null;
}

export type DocumentType =
	| "W-2"
	| "1099"
	| "Prior Year Return"
	| "Consent Form"
	| "Engagement Form"
	| "Brokerage Statement"
	| "Articles of Org"
	| "EIN Confirmation"
	| "Income Statement"
	| "Balance Sheet";
export type DocumentStatus =
	| "Not Requested"
	| "Requested"
	| "Needs Help"
	| "Wrong Document"
	| "Submitted"
	| "Verified";

export interface ToolAccess {
	id: string;
	company_id: string;
	tool_name: string;
	status: ToolAccessStatus;
	login_username: string;
	has_two_factor: boolean;
}

export type ToolAccessStatus =
	| "Not Requested"
	| "Requested"
	| "Access Issue"
	| "Granted"
	| "Verified Working";

export interface Payment {
	id: string;
	company_id: string;
	amount: number;
	direction: PaymentDirection;
	payment_method: PaymentMethod;
	status: PaymentStatus;
	related_entity_type: string;
	paid_at: string;
}

export type PaymentDirection = "Inbound" | "Outbound";
export type PaymentMethod = "Credit Card" | "Check" | "Cash" | "Bank Transfer";
export type PaymentStatus = "Pending" | "Completed" | "Failed" | "Refunded";

export interface Touchpoint {
	id: string;
	company_id: string;
	touchpoint_type: TouchpointType;
	direction: TouchpointDirection;
	subject: string;
	occurred_at: string;
}

export type TouchpointType =
	| "Phone Call"
	| "Email"
	| "WhatsApp"
	| "In-Person"
	| "TaxDome Message"
	| "Video Call";
export type TouchpointDirection = "Inbound" | "Outbound";

export interface AccountAssignment {
	id: string;
	company_id: string;
	team_member_name: string;
	team_member_title: string;
	assignment_type: AssignmentType;
}

export type AssignmentType =
	| "Owner"
	| "Preparer"
	| "Reviewer"
	| "Data Entry"
	| "Backup";

export interface ClientRequest {
	id: string;
	company_id: string;
	request_number: string;
	title: string;
	request_type: RequestType;
	priority: RequestPriority;
	status: RequestStatus;
}

export type RequestType =
	| "Support"
	| "Question"
	| "Escalation"
	| "Internal Discovery";
export type RequestPriority = "Low" | "Normal" | "Urgent";
export type RequestStatus =
	| "New"
	| "Triaged"
	| "In Progress"
	| "Waiting on Client"
	| "Won't Do"
	| "Resolved";

// ============================
// Chart / KPI Types
// ============================

export interface MonthlyTrendData {
	month: string;
	count: number;
}

export interface QuarterlyRevenueData {
	quarter: string;
	revenue: number;
}

export interface ServiceBreakdownData {
	service: string;
	count: number;
}
