import MainLayout from "@/components/layout/main-layout";

import TeamMembersContent from "@/features/team-members/components/team-members-content";
import TeamMembersHeader from "@/features/team-members/layout/team-members.header";

export default function TeamMembersPage() {
	return (
		<MainLayout headers={[<TeamMembersHeader key="team-members-header" />]}>
			<TeamMembersContent />
		</MainLayout>
	);
}
