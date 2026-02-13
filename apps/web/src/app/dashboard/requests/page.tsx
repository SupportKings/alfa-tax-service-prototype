import MainLayout from "@/components/layout/main-layout";

import RequestsContent from "@/features/requests/components/requests-content";
import RequestsHeader from "@/features/requests/layout/requests.header";

export default function RequestsPage() {
	return (
		<MainLayout headers={[<RequestsHeader key="requests-header" />]}>
			<RequestsContent />
		</MainLayout>
	);
}
