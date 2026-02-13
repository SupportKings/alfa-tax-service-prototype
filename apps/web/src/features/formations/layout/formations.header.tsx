import { SidebarTrigger } from "@/components/ui/sidebar";

import { Building2Icon } from "lucide-react";

export default function FormationsHeader() {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] flex-shrink-0 items-center justify-between border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<Building2Icon className="h-4 w-4 text-muted-foreground" />
				<h1 className="font-medium text-[13px]">Business Formations</h1>
			</div>
		</div>
	);
}
