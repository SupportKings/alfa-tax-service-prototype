import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";

import FormationDetailView from "@/features/formations/components/formation-detail-view";
import { getFormationById } from "@/features/formations/data/mock-data";
import FormationDetailHeader from "@/features/formations/layout/formation.detail.header";

interface FormationDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function FormationDetailPage({
	params,
}: FormationDetailPageProps) {
	const { id } = await params;
	const formation = getFormationById(id);

	if (!formation) {
		notFound();
	}

	return (
		<MainLayout
			headers={[
				<FormationDetailHeader
					key="formation-detail-header"
					formationNumber={formation.formationNumber}
					clientName={formation.clientName}
				/>,
			]}
		>
			<FormationDetailView formation={formation} />
		</MainLayout>
	);
}
