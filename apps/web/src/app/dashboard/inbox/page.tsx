import MainLayout from "@/components/layout/main-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ComingSoon } from "@/features/shared/components/coming-soon";

import { InboxIcon } from "lucide-react";

function InboxHeader() {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] shrink-0 items-center border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<InboxIcon className="h-4 w-4 text-muted-foreground" />
				<h1 className="font-medium text-[13px]">Inbox</h1>
			</div>
		</div>
	);
}

export default function InboxPage() {
	return (
		<MainLayout headers={[<InboxHeader key="header" />]}>
			<ComingSoon
				title="Inbox"
				description="A unified inbox for all client communications, notifications, and task assignments. Coming in a future release."
			/>
		</MainLayout>
	);
}
