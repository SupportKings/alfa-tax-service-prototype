import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";

import FormationsHeader from "@/features/formations/layout/formations.header";

export default function FormationsLoading() {
	return (
		<MainLayout headers={[<FormationsHeader key="formations-header" />]}>
			<div className="space-y-6 p-6">
				<div className="space-y-2">
					<Skeleton className="h-7 w-52" />
					<Skeleton className="h-4 w-96" />
				</div>

				{/* KPI card skeletons */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Skeleton className="h-24 w-full rounded-lg" />
					<Skeleton className="h-24 w-full rounded-lg" />
					<Skeleton className="h-24 w-full rounded-lg" />
					<Skeleton className="h-24 w-full rounded-lg" />
				</div>

				{/* Chart skeletons */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Skeleton className="h-72 w-full rounded-lg" />
					<Skeleton className="h-72 w-full rounded-lg" />
				</div>

				{/* Table skeleton */}
				<div className="space-y-3">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-10 w-full rounded-lg" />
					<Skeleton className="h-64 w-full rounded-lg" />
				</div>
			</div>
		</MainLayout>
	);
}
