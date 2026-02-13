import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";

import TaxReturnsHeader from "@/features/tax-returns/layout/tax-returns.header";

export default function TaxReturnsLoading() {
	return (
		<MainLayout headers={[<TaxReturnsHeader key="tax-returns-header" />]}>
			<div className="space-y-4 p-4 lg:p-6">
				{/* KPI skeletons */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Skeleton className="h-[180px] w-full rounded-lg" />
					<Skeleton className="h-[180px] w-full rounded-lg" />
					<Skeleton className="h-[180px] w-full rounded-lg" />
				</div>

				{/* Filter skeletons */}
				<div className="flex gap-3">
					<Skeleton className="h-9 w-[180px] rounded-md" />
					<Skeleton className="h-9 w-[160px] rounded-md" />
					<Skeleton className="h-9 w-[150px] rounded-md" />
					<Skeleton className="h-9 w-[140px] rounded-md" />
				</div>

				{/* Table skeletons */}
				<div className="space-y-2">
					<Skeleton className="h-10 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
				</div>
			</div>
		</MainLayout>
	);
}
