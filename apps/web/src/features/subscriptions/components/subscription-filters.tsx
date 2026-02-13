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

import { AlertTriangle, Filter, X } from "lucide-react";
import type { OfferType, ServiceFrequency, SubscriptionStatus } from "../types";

interface SubscriptionFiltersProps {
	statusFilter: SubscriptionStatus | "all";
	offerTypeFilter: OfferType | "all";
	frequencyFilter: ServiceFrequency | "all";
	onStatusChange: (value: SubscriptionStatus | "all") => void;
	onOfferTypeChange: (value: OfferType | "all") => void;
	onFrequencyChange: (value: ServiceFrequency | "all") => void;
	onClearFilters: () => void;
	behindCount: number;
}

export default function SubscriptionFilters({
	statusFilter,
	offerTypeFilter,
	frequencyFilter,
	onStatusChange,
	onOfferTypeChange,
	onFrequencyChange,
	onClearFilters,
	behindCount,
}: SubscriptionFiltersProps) {
	const hasActiveFilters =
		statusFilter !== "all" ||
		offerTypeFilter !== "all" ||
		frequencyFilter !== "all";

	return (
		<div className="flex flex-wrap items-center gap-3">
			{/* Quick-filter button for "Behind" status */}
			<Button
				variant={statusFilter === "Active - Behind" ? "destructive" : "outline"}
				size="sm"
				onClick={() => {
					if (statusFilter === "Active - Behind") {
						onStatusChange("all");
					} else {
						onStatusChange("Active - Behind");
					}
				}}
				className="gap-1.5"
			>
				<AlertTriangle className="h-3.5 w-3.5" />
				Behind Schedule
				{behindCount > 0 && (
					<Badge
						variant={
							statusFilter === "Active - Behind" ? "secondary" : "destructive"
						}
						className="ml-1 h-5 min-w-5 px-1.5"
					>
						{behindCount}
					</Badge>
				)}
			</Button>

			<div className="h-6 w-px bg-border" />

			{/* Status Filter */}
			<div className="flex items-center gap-1.5">
				<Filter className="h-3.5 w-3.5 text-muted-foreground" />
				<Select
					value={statusFilter}
					onValueChange={(val) =>
						onStatusChange(val as SubscriptionStatus | "all")
					}
				>
					<SelectTrigger size="sm" className="h-8 text-xs">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="Pending Setup">Pending Setup</SelectItem>
						<SelectItem value="Active - Current">Active - Current</SelectItem>
						<SelectItem value="Active - Behind">Active - Behind</SelectItem>
						<SelectItem value="Paused">Paused</SelectItem>
						<SelectItem value="Cancelled">Cancelled</SelectItem>
						<SelectItem value="Completed">Completed</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Offer Type Filter */}
			<Select
				value={offerTypeFilter}
				onValueChange={(val) => onOfferTypeChange(val as OfferType | "all")}
			>
				<SelectTrigger size="sm" className="h-8 text-xs">
					<SelectValue placeholder="Service Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Types</SelectItem>
					<SelectItem value="Tax">Tax</SelectItem>
					<SelectItem value="Bookkeeping">Bookkeeping</SelectItem>
					<SelectItem value="Advisory">Advisory</SelectItem>
					<SelectItem value="Formation">Formation</SelectItem>
				</SelectContent>
			</Select>

			{/* Frequency Filter */}
			<Select
				value={frequencyFilter}
				onValueChange={(val) =>
					onFrequencyChange(val as ServiceFrequency | "all")
				}
			>
				<SelectTrigger size="sm" className="h-8 text-xs">
					<SelectValue placeholder="Frequency" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Frequencies</SelectItem>
					<SelectItem value="Monthly">Monthly</SelectItem>
					<SelectItem value="Quarterly">Quarterly</SelectItem>
					<SelectItem value="Annually">Annually</SelectItem>
					<SelectItem value="One-Time">One-Time</SelectItem>
				</SelectContent>
			</Select>

			{/* Clear Filters */}
			{hasActiveFilters && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClearFilters}
					className="h-8 gap-1 text-muted-foreground text-xs"
				>
					<X className="h-3.5 w-3.5" />
					Clear
				</Button>
			)}
		</div>
	);
}
