import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";

import RequestDetailView from "@/features/requests/components/request-detail-view";
import { mockRequests } from "@/features/requests/data/mock-data";
import RequestDetailHeader from "@/features/requests/layout/request.detail.header";

interface RequestDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({
	params,
}: RequestDetailPageProps) {
	const { id } = await params;
	const request = mockRequests.find((r) => r.id === id);

	if (!request) {
		notFound();
	}

	return (
		<MainLayout
			headers={[
				<RequestDetailHeader
					key="request-detail-header"
					requestNumber={request.requestNumber}
				/>,
			]}
		>
			<RequestDetailView request={request} />
		</MainLayout>
	);
}
