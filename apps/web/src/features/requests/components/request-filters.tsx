"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { X } from "lucide-react";
import type {
	RequestFilterState,
	RequestPriority,
	RequestSource,
	RequestStatus,
	RequestType,
} from "../types";

interface RequestFiltersProps {
	filters: RequestFilterState;
	onFiltersChange: (filters: RequestFilterState) => void;
}

const requestTypes: RequestType[] = [
	"Support",
	"Question",
	"Escalation",
	"Internal Discovery",
];

const requestSources: RequestSource[] = [
	"TaxDome",
	"Phone",
	"Email",
	"WhatsApp",
	"Website",
	"Walk-In",
];

const requestPriorities: RequestPriority[] = ["Low", "Normal", "Urgent"];

const requestStatuses: RequestStatus[] = [
	"New",
	"Triaged",
	"In Progress",
	"Waiting on Client",
	"Won't Do",
	"Resolved",
];

export default function RequestFilters({
	filters,
	onFiltersChange,
}: RequestFiltersProps) {
	const activeFilterCount = [
		filters.requestType,
		filters.source,
		filters.priority,
		filters.status,
	].filter((v) => v !== "all").length;

	const handleReset = () => {
		onFiltersChange({
			requestType: "all",
			source: "all",
			priority: "all",
			status: "all",
		});
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Select
				value={filters.requestType}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						requestType: value as RequestType | "all",
					})
				}
			>
				<SelectTrigger className="h-8 w-[150px] text-xs">
					<SelectValue placeholder="Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Types</SelectItem>
					{requestTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filters.source}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						source: value as RequestSource | "all",
					})
				}
			>
				<SelectTrigger className="h-8 w-[150px] text-xs">
					<SelectValue placeholder="Source" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Sources</SelectItem>
					{requestSources.map((source) => (
						<SelectItem key={source} value={source}>
							{source}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filters.priority}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						priority: value as RequestPriority | "all",
					})
				}
			>
				<SelectTrigger className="h-8 w-[150px] text-xs">
					<SelectValue placeholder="Priority" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Priorities</SelectItem>
					{requestPriorities.map((priority) => (
						<SelectItem key={priority} value={priority}>
							{priority}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filters.status}
				onValueChange={(value) =>
					onFiltersChange({
						...filters,
						status: value as RequestStatus | "all",
					})
				}
			>
				<SelectTrigger className="h-8 w-[150px] text-xs">
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Statuses</SelectItem>
					{requestStatuses.map((status) => (
						<SelectItem key={status} value={status}>
							{status}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{activeFilterCount > 0 && (
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="text-xs">
						{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
					</Badge>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleReset}
						className="h-7 px-2 text-xs"
					>
						<X className="mr-1 h-3 w-3" />
						Clear
					</Button>
				</div>
			)}
		</div>
	);
}
