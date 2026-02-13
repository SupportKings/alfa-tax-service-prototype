"use client";

import { useMemo, useState } from "react";

import { mockClients, mockNewClientsTrend } from "../data/mock-data";
import type { Client } from "../types";
import ClientFilters, { type ClientFiltersState } from "./client-filters";
import ClientKpis from "./client-kpis";
import ClientsTable from "./clients-table";

const initialFilters: ClientFiltersState = {
	search: "",
	status: "all",
	clientType: "all",
	quality: "all",
	language: "all",
	source: "all",
};

export default function ClientsContent() {
	const [filters, setFilters] = useState<ClientFiltersState>(initialFilters);

	const filteredClients = useMemo(() => {
		return mockClients.filter((client: Client) => {
			// Search filter
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const matchesSearch =
					client.full_name.toLowerCase().includes(searchLower) ||
					client.email.toLowerCase().includes(searchLower) ||
					client.phone.includes(filters.search);
				if (!matchesSearch) return false;
			}

			// Status filter
			if (filters.status !== "all" && client.status !== filters.status) {
				return false;
			}

			// Type filter
			if (
				filters.clientType !== "all" &&
				client.client_type !== filters.clientType
			) {
				return false;
			}

			// Quality filter
			if (filters.quality !== "all" && client.quality !== filters.quality) {
				return false;
			}

			// Language filter
			if (filters.language !== "all" && client.language !== filters.language) {
				return false;
			}

			// Source filter
			if (filters.source !== "all" && client.source !== filters.source) {
				return false;
			}

			return true;
		});
	}, [filters]);

	return (
		<div className="space-y-6 p-6">
			{/* KPI Cards */}
			<ClientKpis clients={mockClients} trendData={mockNewClientsTrend} />

			{/* Filters */}
			<ClientFilters filters={filters} onFiltersChange={setFilters} />

			{/* Results count */}
			<div className="text-muted-foreground text-sm">
				Showing {filteredClients.length} of {mockClients.length} clients
			</div>

			{/* Table */}
			<ClientsTable clients={filteredClients} />
		</div>
	);
}
