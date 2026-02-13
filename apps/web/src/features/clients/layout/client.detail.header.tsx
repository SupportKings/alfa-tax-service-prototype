import { BackButton } from "@/components/ui/back-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { User } from "lucide-react";

interface ClientDetailHeaderProps {
	clientName: string;
}

export default function ClientDetailHeader({
	clientName,
}: ClientDetailHeaderProps) {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] shrink-0 items-center justify-between border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<BackButton />
				<User className="h-4 w-4 text-muted-foreground" />
				<h1 className="font-medium text-[13px]">{clientName} - Details</h1>
			</div>
		</div>
	);
}
