export interface BusinessFormation {
	id: string;
	formationNumber: string;
	clientId: string;
	clientName: string;
	requestingContact: string;
	requestingContactRole: string;
	entityType: "LLC" | "S-Corp" | "C-Corp" | "Partnership" | "Sole Prop";
	stateOfIncorporation: string;
	status:
		| "Info Gathering"
		| "Name Search"
		| "Name Approved"
		| "State Filing"
		| "Awaiting EIN"
		| "Awaiting State Tax ID"
		| "Complete";
	proposedNames: string[];
	confirmedName: string | null;
	registeredAgent: string;
	registeredAgentType: "Internal" | "Third Party";
	ein: string | null;
	stateTaxId: string | null;
	amount: number;
	internalNotes: string;
	documents: FormationDocument[];
	team: FormationAssignment[];
	createdAt: string;
	updatedAt: string;
}

export interface FormationDocument {
	id: string;
	documentType:
		| "Articles of Organization"
		| "Member Information"
		| "Name Search Results"
		| "EIN Confirmation"
		| "State Certificate";
	status: "Not Requested" | "Requested" | "Submitted" | "Verified";
	fileUrl: string | null;
}

export interface FormationAssignment {
	id: string;
	teamMemberId: string;
	teamMemberName: string;
	jobTitle: string;
	assignmentType: "Owner" | "Preparer" | "Reviewer" | "Data Entry" | "Backup";
}
