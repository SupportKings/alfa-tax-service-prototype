export type TeamMemberRole =
	| "Owner/CPA"
	| "Office Manager"
	| "Data Entry Clerk"
	| "Junior Tax Accountant"
	| "Tax Accountant"
	| "Bookkeeper";

export type TeamMemberStatus = "Active" | "On Leave" | "Part-Time";

export type TeamMemberLocation = "In-Office" | "Remote" | "Hybrid";

export interface TeamMemberWorkload {
	activeClients: number;
	taxReturnsInProgress: number;
	advisoryEngagements: number;
	formationsInProgress: number;
	openRequests: number;
}

export interface TeamMember {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: TeamMemberRole;
	status: TeamMemberStatus;
	location: TeamMemberLocation;
	hireDate: string;
	avatar: string | null;
	department: string;
	reportsTo: string | null;
	certifications: string[];
	languages: string[];
	specialties: string[];
	workload: TeamMemberWorkload;
	internalNotes: string;
}
