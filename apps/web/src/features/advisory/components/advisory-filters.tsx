"use client";

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
	AdvisoryBillingType,
	AdvisoryEngagementStatus,
	AdvisoryEngagementType,
} from "../types";

interface AdvisoryFiltersProps {
	typeFilter: AdvisoryEngagementType | "all";
	statusFilter: AdvisoryEngagementStatus | "all";
	billingFilter: AdvisoryBillingType | "all";
	onTypeChange: (value: AdvisoryEngagementType | "all") => void;
	onStatusChange: (value: AdvisoryEngagementStatus | "all") => void;
	onBillingChange: (value: AdvisoryBillingType | "all") => void;
	onClearFilters: () => void;
}

const engagementTypes: AdvisoryEngagementType[] = [
	"Tax Plan",
	"Tax Plan + Books",
	"Financial Management",
	"Advisory Hourly",
	"Ad-Hoc",
];

const engagementStatuses: AdvisoryEngagementStatus[] = [
	"Inquiry",
	"Discovery Call",
	"Proposal Sent",
	"Signed",
	"Documents Gathering",
	"Analysis",
	"Presentation Scheduled",
	"Presentation Complete",
	"Implementation",
	"Complete",
];

const billingTypes: AdvisoryBillingType[] = ["One-Time", "Hourly", "Annual"];

export default function AdvisoryFilters({
	typeFilter,
	statusFilter,
	billingFilter,
	onTypeChange,
	onStatusChange,
	onBillingChange,
	onClearFilters,
}: AdvisoryFiltersProps) {
	const hasActiveFilters =
		typeFilter !== "all" || statusFilter !== "all" || billingFilter !== "all";

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Select
				value={typeFilter}
				onValueChange={(val) =>
					onTypeChange(val as AdvisoryEngagementType | "all")
				}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="All Types" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Types</SelectItem>
					{engagementTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={statusFilter}
				onValueChange={(val) =>
					onStatusChange(val as AdvisoryEngagementStatus | "all")
				}
			>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="All Statuses" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Statuses</SelectItem>
					{engagementStatuses.map((status) => (
						<SelectItem key={status} value={status}>
							{status}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={billingFilter}
				onValueChange={(val) =>
					onBillingChange(val as AdvisoryBillingType | "all")
				}
			>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="All Billing" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Billing</SelectItem>
					{billingTypes.map((billing) => (
						<SelectItem key={billing} value={billing}>
							{billing}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{hasActiveFilters && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClearFilters}
					className="h-9 px-2 text-muted-foreground"
				>
					<X className="mr-1 h-4 w-4" />
					Clear filters
				</Button>
			)}
		</div>
	);
}
