"use client";

import { useMemo, useState } from "react";

import { advisoryEngagements, quarterlyRevenueData } from "../data/mock-data";
import type {
	AdvisoryBillingType,
	AdvisoryEngagementStatus,
	AdvisoryEngagementType,
} from "../types";
import AdvisoryFilters from "./advisory-filters";
import AdvisoryKpis from "./advisory-kpis";
import AdvisoryTable from "./advisory-table";

export default function AdvisoryListContent() {
	const [typeFilter, setTypeFilter] = useState<AdvisoryEngagementType | "all">(
		"all",
	);
	const [statusFilter, setStatusFilter] = useState<
		AdvisoryEngagementStatus | "all"
	>("all");
	const [billingFilter, setBillingFilter] = useState<
		AdvisoryBillingType | "all"
	>("all");

	const filteredEngagements = useMemo(() => {
		return advisoryEngagements.filter((engagement) => {
			if (typeFilter !== "all" && engagement.engagement_type !== typeFilter) {
				return false;
			}
			if (statusFilter !== "all" && engagement.status !== statusFilter) {
				return false;
			}
			if (
				billingFilter !== "all" &&
				engagement.billing_type !== billingFilter
			) {
				return false;
			}
			return true;
		});
	}, [typeFilter, statusFilter, billingFilter]);

	const handleClearFilters = () => {
		setTypeFilter("all");
		setStatusFilter("all");
		setBillingFilter("all");
	};

	return (
		<div className="space-y-6 p-6">
			<AdvisoryKpis
				engagements={advisoryEngagements}
				quarterlyRevenue={quarterlyRevenueData}
			/>

			<AdvisoryFilters
				typeFilter={typeFilter}
				statusFilter={statusFilter}
				billingFilter={billingFilter}
				onTypeChange={setTypeFilter}
				onStatusChange={setStatusFilter}
				onBillingChange={setBillingFilter}
				onClearFilters={handleClearFilters}
			/>

			<AdvisoryTable engagements={filteredEngagements} />
		</div>
	);
}
