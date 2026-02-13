import MainLayout from "@/components/layout/main-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ComingSoon } from "@/features/shared/components/coming-soon";

import { DollarSign } from "lucide-react";

function PaymentsHeader() {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] shrink-0 items-center border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<DollarSign className="h-4 w-4 text-muted-foreground" />
				<h1 className="font-medium text-[13px]">Payments</h1>
			</div>
		</div>
	);
}

export default function PaymentsPage() {
	return (
		<MainLayout headers={[<PaymentsHeader key="header" />]}>
			<ComingSoon
				title="Payments"
				description="Consolidated payment tracking across all clients, tax returns, advisory engagements, and formations. Coming in a future release."
			/>
		</MainLayout>
	);
}
