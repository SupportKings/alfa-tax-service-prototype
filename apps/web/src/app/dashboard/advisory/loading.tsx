import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";

import AdvisoryListHeader from "@/features/advisory/layout/advisory-list.header";

export default function AdvisoryLoading() {
	return (
		<MainLayout headers={[<AdvisoryListHeader key="advisory-header" />]}>
			<div className="space-y-6 p-6">
				{/* KPI Skeletons */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Skeleton className="h-[140px] w-full rounded-lg" />
					<Skeleton className="h-[140px] w-full rounded-lg" />
					<Skeleton className="h-[140px] w-full rounded-lg" />
				</div>

				{/* Filter Skeletons */}
				<div className="flex gap-3">
					<Skeleton className="h-9 w-[180px]" />
					<Skeleton className="h-9 w-[200px]" />
					<Skeleton className="h-9 w-[160px]" />
				</div>

				{/* Table Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		</MainLayout>
	);
}
