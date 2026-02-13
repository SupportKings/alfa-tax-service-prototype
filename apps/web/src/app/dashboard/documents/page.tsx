import MainLayout from "@/components/layout/main-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ComingSoon } from "@/features/shared/components/coming-soon";

import { FolderOpen } from "lucide-react";

function DocumentsHeader() {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] shrink-0 items-center border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<FolderOpen className="h-4 w-4 text-muted-foreground" />
				<h1 className="font-medium text-[13px]">Documents</h1>
			</div>
		</div>
	);
}

export default function DocumentsPage() {
	return (
		<MainLayout headers={[<DocumentsHeader key="header" />]}>
			<ComingSoon
				title="Documents"
				description="Global document search and management across all clients, tax returns, and engagements. Coming in a future release."
			/>
		</MainLayout>
	);
}
