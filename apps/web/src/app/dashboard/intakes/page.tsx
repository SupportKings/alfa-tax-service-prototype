import MainLayout from "@/components/layout/main-layout";

import IntakesContent from "@/features/intake/components/intakes-content";
import IntakesHeader from "@/features/intake/layout/intakes.header";

export default function IntakesPage() {
	return (
		<MainLayout headers={[<IntakesHeader key="intakes-header" />]}>
			<IntakesContent />
		</MainLayout>
	);
}
