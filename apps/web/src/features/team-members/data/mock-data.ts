import type { TeamMember } from "../types";

export const mockTeamMembers: TeamMember[] = [
	{
		id: "tm-001",
		name: "Kathy Alfaro",
		email: "kathy@alfataxservice.com",
		phone: "(210) 555-0001",
		role: "Owner/CPA",
		status: "Active",
		location: "In-Office",
		hireDate: "2015-01-01",
		avatar: null,
		department: "Leadership",
		reportsTo: null,
		certifications: ["CPA (Texas)", "QuickBooks ProAdvisor"],
		languages: ["English", "Spanish"],
		specialties: [
			"Tax Planning",
			"S-Corp Elections",
			"Entity Structuring",
			"Advisory",
			"Client Relationships",
		],
		workload: {
			activeClients: 28,
			taxReturnsInProgress: 9,
			advisoryEngagements: 4,
			formationsInProgress: 5,
			openRequests: 6,
		},
		internalNotes:
			"Owner and primary CPA. Bottleneck on complex returns and all advisory engagements. Needs to delegate more to Johnathan and Carina.",
	},
	{
		id: "tm-002",
		name: "Carmen Delgado",
		email: "carmen@alfataxservice.com",
		phone: "(210) 555-0002",
		role: "Office Manager",
		status: "Active",
		location: "In-Office",
		hireDate: "2019-03-15",
		avatar: null,
		department: "Operations",
		reportsTo: "tm-001",
		certifications: [],
		languages: ["English", "Spanish"],
		specialties: [
			"Client Intake",
			"Scheduling",
			"TaxDome Management",
			"Client Communications",
			"Document Collection",
		],
		workload: {
			activeClients: 0,
			taxReturnsInProgress: 0,
			advisoryEngagements: 0,
			formationsInProgress: 2,
			openRequests: 12,
		},
		internalNotes:
			"First point of contact for clients. Manages all inbound channels (phone, email, WhatsApp, walk-ins). Bilingual - handles Spanish-preferred clients.",
	},
	{
		id: "tm-003",
		name: "Jacob Martinez",
		email: "jacob@alfataxservice.com",
		phone: "(210) 555-0003",
		role: "Data Entry Clerk",
		status: "Active",
		location: "In-Office",
		hireDate: "2023-01-10",
		avatar: null,
		department: "Tax",
		reportsTo: "tm-001",
		certifications: [],
		languages: ["English", "Spanish"],
		specialties: [
			"Data Entry",
			"Document Processing",
			"TaxDome Data Input",
			"1099 Preparation",
		],
		workload: {
			activeClients: 0,
			taxReturnsInProgress: 12,
			advisoryEngagements: 0,
			formationsInProgress: 2,
			openRequests: 3,
		},
		internalNotes:
			"Handles initial data entry for tax returns. Learning tax prep under Johnathan. Good attention to detail.",
	},
	{
		id: "tm-004",
		name: "Carina Flores",
		email: "carina@alfataxservice.com",
		phone: "(210) 555-0004",
		role: "Junior Tax Accountant",
		status: "Active",
		location: "In-Office",
		hireDate: "2022-06-01",
		avatar: null,
		department: "Tax",
		reportsTo: "tm-005",
		certifications: ["EA (Enrolled Agent)"],
		languages: ["English", "Spanish"],
		specialties: [
			"Individual Returns",
			"Simple Business Returns",
			"Sales Tax Filing",
			"Amended Returns",
		],
		workload: {
			activeClients: 0,
			taxReturnsInProgress: 8,
			advisoryEngagements: 0,
			formationsInProgress: 1,
			openRequests: 4,
		},
		internalNotes:
			"Growing into handling more complex returns. Enrolled Agent certification makes her valuable for IRS representation. Reports to Johnathan.",
	},
	{
		id: "tm-005",
		name: "Johnathan Rivera",
		email: "johnathan@alfataxservice.com",
		phone: "(210) 555-0005",
		role: "Tax Accountant",
		status: "Active",
		location: "In-Office",
		hireDate: "2020-09-01",
		avatar: null,
		department: "Tax",
		reportsTo: "tm-001",
		certifications: ["EA (Enrolled Agent)", "QuickBooks ProAdvisor"],
		languages: ["English"],
		specialties: [
			"Business Returns",
			"S-Corp & Partnership",
			"Multi-state Filing",
			"Tax Review",
			"IRS Representation",
		],
		workload: {
			activeClients: 0,
			taxReturnsInProgress: 10,
			advisoryEngagements: 2,
			formationsInProgress: 2,
			openRequests: 3,
		},
		internalNotes:
			"Senior tax preparer. Reviews Carina's work. Kathy's right hand on complex returns. Being trained on advisory to reduce Kathy's bottleneck.",
	},
	{
		id: "tm-006",
		name: "Simiran Patel",
		email: "simiran@alfataxservice.com",
		phone: "+91 98765 43210",
		role: "Bookkeeper",
		status: "Active",
		location: "Remote",
		hireDate: "2023-08-01",
		avatar: null,
		department: "Bookkeeping",
		reportsTo: "tm-001",
		certifications: ["QuickBooks Online Certified"],
		languages: ["English", "Hindi"],
		specialties: [
			"QuickBooks Online",
			"Monthly Reconciliation",
			"Accounts Payable",
			"Accounts Receivable",
			"Financial Reporting",
		],
		workload: {
			activeClients: 0,
			taxReturnsInProgress: 0,
			advisoryEngagements: 0,
			formationsInProgress: 0,
			openRequests: 2,
		},
		internalNotes:
			"Remote bookkeeper based in India. Handles monthly and quarterly bookkeeping clients. Works US hours (CST). Communicates primarily via Slack and TaxDome.",
	},
];

export function getTeamMemberById(id: string): TeamMember | undefined {
	return mockTeamMembers.find((m) => m.id === id);
}

export function getTeamMemberByName(name: string): TeamMember | undefined {
	return mockTeamMembers.find(
		(m) => m.name.toLowerCase() === name.toLowerCase(),
	);
}

export function getActiveTeamMembers(): TeamMember[] {
	return mockTeamMembers.filter((m) => m.status === "Active");
}

export function getTotalWorkloadItems(member: TeamMember): number {
	return (
		member.workload.taxReturnsInProgress +
		member.workload.advisoryEngagements +
		member.workload.formationsInProgress +
		member.workload.openRequests
	);
}
