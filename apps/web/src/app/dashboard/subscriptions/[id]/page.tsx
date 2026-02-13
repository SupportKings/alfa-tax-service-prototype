import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";

import SubscriptionDetailView from "@/features/subscriptions/components/subscription-detail-view";
import { mockSubscriptions } from "@/features/subscriptions/data/mock-data";
import SubscriptionDetailHeader from "@/features/subscriptions/layout/subscription.detail.header";

interface SubscriptionDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function SubscriptionDetailPage({
	params,
}: SubscriptionDetailPageProps) {
	const { id } = await params;
	const subscription = mockSubscriptions.find((s) => s.id === id);

	if (!subscription) {
		notFound();
	}

	return (
		<MainLayout
			headers={[
				<SubscriptionDetailHeader
					key="subscription-detail-header"
					serviceName={subscription.service_name}
				/>,
			]}
		>
			<SubscriptionDetailView subscription={subscription} />
		</MainLayout>
	);
}
