import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";

import DashboardHeader from "@/features/dashboard/layout/dashboard-header";

export default function DashboardLoading() {
	return (
		<MainLayout headers={[<DashboardHeader key="dashboard-header" />]}>
			<div className="space-y-6 p-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-56" />
					<Skeleton className="h-4 w-72" />
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Skeleton className="h-28 w-full rounded-lg" />
					<Skeleton className="h-28 w-full rounded-lg" />
					<Skeleton className="h-28 w-full rounded-lg" />
					<Skeleton className="h-28 w-full rounded-lg" />
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Skeleton className="h-64 w-full rounded-lg" />
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
					<Skeleton className="h-72 w-full rounded-lg" />
					<Skeleton className="h-72 w-full rounded-lg" />
					<Skeleton className="h-72 w-full rounded-lg" />
				</div>
			</div>
		</MainLayout>
	);
}
