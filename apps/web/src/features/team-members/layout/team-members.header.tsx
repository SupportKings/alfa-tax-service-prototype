import { SidebarTrigger } from "@/components/ui/sidebar";

import { UsersRound } from "lucide-react";

export default function TeamMembersHeader() {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] shrink-0 items-center justify-between border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<UsersRound className="h-4 w-4 text-muted-foreground" />
				<h1 className="font-medium text-[13px]">Team Members</h1>
			</div>
			<div className="flex items-center gap-2">
				<span className="text-muted-foreground text-xs">
					Alfa Tax Service CRM
				</span>
			</div>
		</div>
	);
}
