"use client";

import { useState } from "react";

import { mockRequests } from "../data/mock-data";
import type { RequestFilterState } from "../types";
import RequestFilters from "./request-filters";
import RequestKpis from "./request-kpis";
import RequestsTable from "./requests-table";

export default function RequestsContent() {
	const [filters, setFilters] = useState<RequestFilterState>({
		requestType: "all",
		source: "all",
		priority: "all",
		status: "all",
	});

	const filteredRequests = mockRequests.filter((request) => {
		if (
			filters.requestType !== "all" &&
			request.requestType !== filters.requestType
		) {
			return false;
		}
		if (filters.source !== "all" && request.source !== filters.source) {
			return false;
		}
		if (filters.priority !== "all" && request.priority !== filters.priority) {
			return false;
		}
		if (filters.status !== "all" && request.status !== filters.status) {
			return false;
		}
		return true;
	});

	return (
		<div className="space-y-6 p-6">
			{/* KPIs */}
			<RequestKpis />

			{/* Filters + Table */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-sm">
						All Requests ({filteredRequests.length})
					</h2>
				</div>
				<RequestFilters filters={filters} onFiltersChange={setFilters} />
				<RequestsTable requests={filteredRequests} />
			</div>
		</div>
	);
}
