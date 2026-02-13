import { SidebarTrigger } from "@/components/ui/sidebar";

import { InboxIcon } from "lucide-react";

export default function RequestsHeader() {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] flex-shrink-0 items-center justify-between border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<h1 className="font-medium text-[13px]">Requests</h1>
			</div>
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<InboxIcon className="h-4 w-4" />
				<span>Triage Hub</span>
			</div>
		</div>
	);
}
