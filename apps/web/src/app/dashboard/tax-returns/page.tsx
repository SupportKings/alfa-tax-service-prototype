import MainLayout from "@/components/layout/main-layout";

import TaxReturnsContent from "@/features/tax-returns/components/tax-returns-content";
import TaxReturnsHeader from "@/features/tax-returns/layout/tax-returns.header";

export default function TaxReturnsPage() {
	return (
		<MainLayout headers={[<TaxReturnsHeader key="tax-returns-header" />]}>
			<TaxReturnsContent />
		</MainLayout>
	);
}
