import MainLayout from "@/components/layout/main-layout";

import AdvisoryListContent from "@/features/advisory/components/advisory-list-content";
import AdvisoryListHeader from "@/features/advisory/layout/advisory-list.header";

export default function AdvisoryPage() {
	return (
		<MainLayout headers={[<AdvisoryListHeader key="advisory-header" />]}>
			<AdvisoryListContent />
		</MainLayout>
	);
}
