import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";

import ClientsHeader from "@/features/clients/layout/clients.header";

export default function ClientsLoading() {
	return (
		<MainLayout headers={[<ClientsHeader key="clients-header" />]}>
			<div className="space-y-6 p-6">
				{/* KPI skeletons */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<Skeleton className="h-[130px] w-full rounded-lg" />
					<Skeleton className="h-[130px] w-full rounded-lg" />
					<Skeleton className="h-[130px] w-full rounded-lg" />
				</div>

				{/* Filter bar skeleton */}
				<div className="flex gap-2">
					<Skeleton className="h-8 w-[200px]" />
					<Skeleton className="h-8 w-[130px]" />
					<Skeleton className="h-8 w-[130px]" />
					<Skeleton className="h-8 w-[130px]" />
				</div>

				{/* Table skeleton */}
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
