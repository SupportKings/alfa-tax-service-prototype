// ============================
// Request Types for Alfa Tax Service Prototype
// ============================

export type RequestType =
	| "Support"
	| "Question"
	| "Escalation"
	| "Internal Discovery";

export type RequestSource =
	| "TaxDome"
	| "Phone"
	| "Email"
	| "WhatsApp"
	| "Website"
	| "Walk-In";

export type RequestSourceChannel =
	| "tax_dome"
	| "email"
	| "phone"
	| "whatsapp"
	| "website"
	| "in_person";

export type RequestPriority = "Low" | "Normal" | "Urgent";

export type RequestStatus =
	| "New"
	| "Triaged"
	| "In Progress"
	| "Waiting on Client"
	| "Won't Do"
	| "Resolved";

export interface RequestTimelineEntry {
	id: string;
	date: string;
	action: string;
	user: string;
	note: string | null;
}

export interface Request {
	id: string;
	requestNumber: string;
	clientId: string;
	clientName: string;
	title: string;
	description: string;
	requestType: RequestType;
	source: RequestSource;
	sourceChannel: RequestSourceChannel;
	priority: RequestPriority;
	status: RequestStatus;
	assignedTo: string;
	resolution: string | null;
	createdAt: string;
	updatedAt: string;
	timeline: RequestTimelineEntry[];
}

export interface RequestFilterState {
	requestType: RequestType | "all";
	source: RequestSource | "all";
	priority: RequestPriority | "all";
	status: RequestStatus | "all";
}

export interface RequestStatusDistribution {
	status: string;
	count: number;
	fill: string;
}

export interface RequestTrendData {
	week: string;
	count: number;
}
