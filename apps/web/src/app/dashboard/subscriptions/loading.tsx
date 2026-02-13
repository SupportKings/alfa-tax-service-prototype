import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";

import SubscriptionsHeader from "@/features/subscriptions/layout/subscriptions.header";

export default function SubscriptionsLoading() {
	return (
		<MainLayout headers={[<SubscriptionsHeader key="subscriptions-header" />]}>
			<div className="space-y-6 p-6">
				{/* KPI Skeletons */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Skeleton className="h-32 w-full rounded-lg" />
					<Skeleton className="h-32 w-full rounded-lg" />
					<Skeleton className="h-32 w-full rounded-lg" />
				</div>

				{/* Chart Skeletons */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Skeleton className="h-64 w-full rounded-lg" />
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>

				{/* Filter Skeleton */}
				<div className="flex gap-3">
					<Skeleton className="h-8 w-36 rounded-md" />
					<Skeleton className="h-8 w-32 rounded-md" />
					<Skeleton className="h-8 w-32 rounded-md" />
					<Skeleton className="h-8 w-32 rounded-md" />
				</div>

				{/* Table Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		</MainLayout>
	);
}
