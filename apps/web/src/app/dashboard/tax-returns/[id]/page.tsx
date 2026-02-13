import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";

import TaxReturnDetailView from "@/features/tax-returns/components/tax-return-detail-view";
import { taxReturns } from "@/features/tax-returns/data/mock-data";
import TaxReturnDetailHeader from "@/features/tax-returns/layout/tax-return-detail.header";

interface TaxReturnDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function TaxReturnDetailPage({
	params,
}: TaxReturnDetailPageProps) {
	const { id } = await params;
	const taxReturn = taxReturns.find((r) => r.id === id);

	if (!taxReturn) {
		notFound();
	}

	return (
		<MainLayout
			headers={[
				<TaxReturnDetailHeader
					key="detail-header"
					taxReturnNumber={taxReturn.taxReturnNumber}
					clientName={taxReturn.clientName}
				/>,
			]}
		>
			<TaxReturnDetailView taxReturn={taxReturn} />
		</MainLayout>
	);
}
