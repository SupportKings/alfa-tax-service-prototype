"use client";

import { useState } from "react";

import { taxReturns } from "../data/mock-data";
import type { TaxReturnFilterState } from "../types";
import TaxReturnFilters from "./tax-return-filters";
import TaxReturnKpis from "./tax-return-kpis";
import TaxReturnsTable from "./tax-returns-table";

export default function TaxReturnsContent() {
	const [filters, setFilters] = useState<TaxReturnFilterState>({
		status: "all",
		returnType: "all",
		complexity: "all",
		taxYear: "all",
	});

	return (
		<div className="space-y-4 p-4 lg:p-6">
			<TaxReturnKpis />
			<TaxReturnFilters filters={filters} onFiltersChange={setFilters} />
			<TaxReturnsTable data={taxReturns} filters={filters} />
		</div>
	);
}
