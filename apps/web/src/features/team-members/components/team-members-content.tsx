"use client";

import { mockTeamMembers } from "../data/mock-data";
import TeamMemberKpis from "./team-member-kpis";
import TeamMembersTable from "./team-members-table";

export default function TeamMembersContent() {
	return (
		<div className="space-y-6 p-6">
			{/* KPI Cards */}
			<TeamMemberKpis members={mockTeamMembers} />

			{/* Results count */}
			<div className="text-muted-foreground text-sm">
				{mockTeamMembers.length} team members
			</div>

			{/* Table */}
			<TeamMembersTable members={mockTeamMembers} />
		</div>
	);
}
