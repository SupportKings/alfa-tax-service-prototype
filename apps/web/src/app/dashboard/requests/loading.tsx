import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";

import RequestsHeader from "@/features/requests/layout/requests.header";

export default function RequestsLoading() {
	return (
		<MainLayout headers={[<RequestsHeader key="requests-header" />]}>
			<div className="space-y-6 p-6">
				{/* KPI Skeletons */}
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					<Skeleton className="h-24 w-full rounded-lg" />
					<Skeleton className="h-24 w-full rounded-lg" />
					<Skeleton className="h-24 w-full rounded-lg" />
					<Skeleton className="h-24 w-full rounded-lg" />
				</div>

				{/* Chart Skeletons */}
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Skeleton className="h-[300px] w-full rounded-lg" />
					<Skeleton className="h-[300px] w-full rounded-lg" />
				</div>

				{/* Filters Skeleton */}
				<div className="flex gap-3">
					<Skeleton className="h-8 w-[150px]" />
					<Skeleton className="h-8 w-[150px]" />
					<Skeleton className="h-8 w-[150px]" />
					<Skeleton className="h-8 w-[150px]" />
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
