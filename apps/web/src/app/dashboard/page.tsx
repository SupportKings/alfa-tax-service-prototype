import MainLayout from "@/components/layout/main-layout";

import DashboardOverview from "@/features/dashboard/components/dashboard-overview";
import DashboardHeader from "@/features/dashboard/layout/dashboard-header";

export default function DashboardPage() {
	return (
		<MainLayout headers={[<DashboardHeader key="dashboard-header" />]}>
			<DashboardOverview />
		</MainLayout>
	);
}
