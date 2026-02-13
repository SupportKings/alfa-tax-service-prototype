import MainLayout from "@/components/layout/main-layout";

import FormationKpis from "@/features/formations/components/formation-kpis";
import FormationsTable from "@/features/formations/components/formations-table";
import FormationsHeader from "@/features/formations/layout/formations.header";

export default function FormationsPage() {
	return (
		<MainLayout headers={[<FormationsHeader key="formations-header" />]}>
			<div className="space-y-6 p-6">
				<div>
					<h2 className="font-semibold text-lg">Business Formations</h2>
					<p className="text-muted-foreground text-sm">
						Track entity formations through the multi-step state filing process.
					</p>
				</div>

				<FormationKpis />

				<div>
					<h3 className="mb-3 font-semibold text-sm">All Formations</h3>
					<FormationsTable />
				</div>
			</div>
		</MainLayout>
	);
}
