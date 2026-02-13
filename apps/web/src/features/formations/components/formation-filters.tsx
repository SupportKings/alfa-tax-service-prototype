"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { XIcon } from "lucide-react";
import type { BusinessFormation } from "../types";

interface FormationFiltersProps {
	entityTypeFilter: string;
	stateFilter: string;
	statusFilter: string;
	onEntityTypeChange: (value: string) => void;
	onStateChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onClearFilters: () => void;
}

const entityTypes: BusinessFormation["entityType"][] = [
	"LLC",
	"S-Corp",
	"C-Corp",
	"Partnership",
	"Sole Prop",
];

const states = ["Texas", "Delaware", "Nevada", "Wyoming", "Florida"];

const statuses: BusinessFormation["status"][] = [
	"Info Gathering",
	"Name Search",
	"Name Approved",
	"State Filing",
	"Awaiting EIN",
	"Awaiting State Tax ID",
	"Complete",
];

export default function FormationFilters({
	entityTypeFilter,
	stateFilter,
	statusFilter,
	onEntityTypeChange,
	onStateChange,
	onStatusChange,
	onClearFilters,
}: FormationFiltersProps) {
	const hasFilters =
		entityTypeFilter !== "all" ||
		stateFilter !== "all" ||
		statusFilter !== "all";

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Select value={entityTypeFilter} onValueChange={onEntityTypeChange}>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="Entity Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Entity Types</SelectItem>
					{entityTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={stateFilter} onValueChange={onStateChange}>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="State" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All States</SelectItem>
					{states.map((state) => (
						<SelectItem key={state} value={state}>
							{state}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={statusFilter} onValueChange={onStatusChange}>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Statuses</SelectItem>
					{statuses.map((status) => (
						<SelectItem key={status} value={status}>
							{status}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{hasFilters && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClearFilters}
					className="h-8 gap-1 text-muted-foreground"
				>
					<XIcon className="h-3 w-3" />
					Clear filters
				</Button>
			)}
		</div>
	);
}
