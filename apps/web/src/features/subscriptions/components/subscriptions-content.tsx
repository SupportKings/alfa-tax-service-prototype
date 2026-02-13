"use client";

import { useMemo, useState } from "react";

import {
	getBehindCount,
	getMonthlyRevenueData,
	getStatusDistribution,
	getTotalActiveRevenue,
	mockSubscriptions,
} from "../data/mock-data";
import type { OfferType, ServiceFrequency, SubscriptionStatus } from "../types";
import SubscriptionFilters from "./subscription-filters";
import SubscriptionKpis from "./subscription-kpis";
import SubscriptionsTable from "./subscriptions-table";

export default function SubscriptionsContent() {
	const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">(
		"all",
	);
	const [offerTypeFilter, setOfferTypeFilter] = useState<OfferType | "all">(
		"all",
	);
	const [frequencyFilter, setFrequencyFilter] = useState<
		ServiceFrequency | "all"
	>("all");

	const filtered = useMemo(() => {
		return mockSubscriptions.filter((sub) => {
			if (statusFilter !== "all" && sub.status !== statusFilter) return false;
			if (offerTypeFilter !== "all" && sub.offer_type !== offerTypeFilter)
				return false;
			if (frequencyFilter !== "all" && sub.frequency !== frequencyFilter)
				return false;
			return true;
		});
	}, [statusFilter, offerTypeFilter, frequencyFilter]);

	const behindCount = getBehindCount();
	const totalActiveRevenue = getTotalActiveRevenue();
	const statusDistribution = getStatusDistribution();
	const monthlyRevenue = getMonthlyRevenueData();

	function handleClearFilters() {
		setStatusFilter("all");
		setOfferTypeFilter("all");
		setFrequencyFilter("all");
	}

	return (
		<div className="space-y-6 p-6">
			{/* KPIs */}
			<SubscriptionKpis
				behindCount={behindCount}
				totalActiveRevenue={totalActiveRevenue}
				statusDistribution={statusDistribution}
				monthlyRevenue={monthlyRevenue}
			/>

			{/* Filters */}
			<SubscriptionFilters
				statusFilter={statusFilter}
				offerTypeFilter={offerTypeFilter}
				frequencyFilter={frequencyFilter}
				onStatusChange={setStatusFilter}
				onOfferTypeChange={setOfferTypeFilter}
				onFrequencyChange={setFrequencyFilter}
				onClearFilters={handleClearFilters}
				behindCount={behindCount}
			/>

			{/* Table */}
			<SubscriptionsTable subscriptions={filtered} />
		</div>
	);
}
