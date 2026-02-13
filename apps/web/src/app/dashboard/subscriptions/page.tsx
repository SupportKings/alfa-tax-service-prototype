import MainLayout from "@/components/layout/main-layout";

import SubscriptionsContent from "@/features/subscriptions/components/subscriptions-content";
import SubscriptionsHeader from "@/features/subscriptions/layout/subscriptions.header";

export default function SubscriptionsPage() {
	return (
		<MainLayout headers={[<SubscriptionsHeader key="subscriptions-header" />]}>
			<SubscriptionsContent />
		</MainLayout>
	);
}
