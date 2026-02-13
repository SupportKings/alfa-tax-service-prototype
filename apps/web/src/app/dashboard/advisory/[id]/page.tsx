import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";

import AdvisoryDetailView from "@/features/advisory/components/advisory-detail-view";
import { advisoryEngagements } from "@/features/advisory/data/mock-data";
import AdvisoryDetailHeader from "@/features/advisory/layout/advisory-detail.header";

interface AdvisoryDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function AdvisoryDetailPage({
	params,
}: AdvisoryDetailPageProps) {
	const { id } = await params;

	const engagement = advisoryEngagements.find((e) => e.id === id);

	if (!engagement) {
		notFound();
	}

	return (
		<MainLayout
			headers={[
				<AdvisoryDetailHeader
					key="advisory-detail-header"
					engagementNumber={engagement.engagement_number}
					clientName={engagement.client_name}
				/>,
			]}
		>
			<AdvisoryDetailView engagement={engagement} />
		</MainLayout>
	);
}
