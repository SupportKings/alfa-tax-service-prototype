import MainLayout from "@/components/layout/main-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ComingSoon } from "@/features/shared/components/coming-soon";

import { BarChart3 } from "lucide-react";

function ReportsHeader() {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] shrink-0 items-center border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<BarChart3 className="h-4 w-4 text-muted-foreground" />
				<h1 className="font-medium text-[13px]">Reports</h1>
			</div>
		</div>
	);
}

export default function ReportsPage() {
	return (
		<MainLayout headers={[<ReportsHeader key="header" />]}>
			<ComingSoon
				title="Reports"
				description="Analytics and reporting dashboard with revenue trends, client growth, team performance, and tax season metrics. Coming in a future release."
			/>
		</MainLayout>
	);
}
