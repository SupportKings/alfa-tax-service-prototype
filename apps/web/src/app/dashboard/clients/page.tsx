import MainLayout from "@/components/layout/main-layout";

import ClientsContent from "@/features/clients/components/clients.content";
import ClientsHeader from "@/features/clients/layout/clients.header";

export default function ClientsPage() {
	return (
		<MainLayout headers={[<ClientsHeader key="clients-header" />]}>
			<ClientsContent />
		</MainLayout>
	);
}
