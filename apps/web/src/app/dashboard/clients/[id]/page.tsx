"use client";

import { use } from "react";

import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";

import ClientDetailView from "@/features/clients/components/client-detail-view";
import {
	getAdvisoryForClient,
	getAssignmentsForClient,
	getClientById,
	getClientRevenueTrend,
	getClientServiceBreakdown,
	getContactsForClient,
	getDocumentsForClient,
	getFormationsForClient,
	getPaymentsForClient,
	getPurchasesForClient,
	getRequestsForClient,
	getTaxReturnsForClient,
	getToolAccessForClient,
	getTouchpointsForClient,
} from "@/features/clients/data/mock-data";
import ClientDetailHeader from "@/features/clients/layout/client.detail.header";

interface ClientDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
	const { id } = use(params);

	const client = getClientById(id);

	if (!client) {
		notFound();
	}

	const contacts = getContactsForClient(id);
	const taxReturns = getTaxReturnsForClient(id);
	const advisory = getAdvisoryForClient(id);
	const formations = getFormationsForClient(id);
	const purchases = getPurchasesForClient(id);
	const documents = getDocumentsForClient(id);
	const toolAccessData = getToolAccessForClient(id);
	const paymentsData = getPaymentsForClient(id);
	const touchpointsData = getTouchpointsForClient(id);
	const assignments = getAssignmentsForClient(id);
	const requests = getRequestsForClient(id);
	const revenueTrend = getClientRevenueTrend(id);
	const serviceBreakdown = getClientServiceBreakdown(id);

	return (
		<MainLayout
			headers={[
				<ClientDetailHeader
					key="client-detail-header"
					clientName={client.full_name}
				/>,
			]}
		>
			<ClientDetailView
				client={client}
				contacts={contacts}
				taxReturns={taxReturns}
				advisory={advisory}
				formations={formations}
				purchases={purchases}
				documents={documents}
				toolAccess={toolAccessData}
				payments={paymentsData}
				touchpoints={touchpointsData}
				assignments={assignments}
				requests={requests}
				revenueTrend={revenueTrend}
				serviceBreakdown={serviceBreakdown}
			/>
		</MainLayout>
	);
}
