"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import type { TaxReturnFilterState } from "../types";

interface TaxReturnFiltersProps {
	filters: TaxReturnFilterState;
	onFiltersChange: (filters: TaxReturnFilterState) => void;
}

const statuses = [
	"all",
	"Not Started",
	"Intake",
	"Documents Gathering",
	"In Preparation",
	"In Review",
	"Waiting on Client",
	"Ready to File",
	"E-Filed",
	"Complete",
] as const;

const returnTypes = [
	"all",
	"Individual",
	"Business",
	"Sales Tax",
	"Amended",
] as const;

const complexities = ["all", "Simple", "Standard", "Complex"] as const;

const taxYears = ["all", 2025, 2024, 2023] as const;

export default function TaxReturnFilters({
	filters,
	onFiltersChange,
}: TaxReturnFiltersProps) {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Select
				value={filters.status}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						status: value as TaxReturnFilterState["status"],
					})
				}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					{statuses.map((status) => (
						<SelectItem key={status} value={status}>
							{status === "all" ? "All Statuses" : status}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filters.returnType}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						returnType: value as TaxReturnFilterState["returnType"],
					})
				}
			>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="Type" />
				</SelectTrigger>
				<SelectContent>
					{returnTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type === "all" ? "All Types" : type}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filters.complexity}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						complexity: value as TaxReturnFilterState["complexity"],
					})
				}
			>
				<SelectTrigger className="w-[150px]">
					<SelectValue placeholder="Complexity" />
				</SelectTrigger>
				<SelectContent>
					{complexities.map((c) => (
						<SelectItem key={c} value={c}>
							{c === "all" ? "All Complexities" : c}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={String(filters.taxYear)}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						taxYear: value === "all" ? "all" : Number(value),
					})
				}
			>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="Tax Year" />
				</SelectTrigger>
				<SelectContent>
					{taxYears.map((year) => (
						<SelectItem key={String(year)} value={String(year)}>
							{year === "all" ? "All Years" : year}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
