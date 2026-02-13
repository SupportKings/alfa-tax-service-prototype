"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Search, X } from "lucide-react";
import type {
	ClientQuality,
	ClientSource,
	ClientStatus,
	ClientType,
	LanguagePreference,
} from "../types";

export interface ClientFiltersState {
	search: string;
	status: ClientStatus | "all";
	clientType: ClientType | "all";
	quality: ClientQuality | "all";
	language: LanguagePreference | "all";
	source: ClientSource | "all";
}

interface ClientFiltersProps {
	filters: ClientFiltersState;
	onFiltersChange: (filters: ClientFiltersState) => void;
}

export default function ClientFilters({
	filters,
	onFiltersChange,
}: ClientFiltersProps) {
	const hasActiveFilters =
		filters.search !== "" ||
		filters.status !== "all" ||
		filters.clientType !== "all" ||
		filters.quality !== "all" ||
		filters.language !== "all" ||
		filters.source !== "all";

	const clearFilters = () => {
		onFiltersChange({
			search: "",
			status: "all",
			clientType: "all",
			quality: "all",
			language: "all",
			source: "all",
		});
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			{/* Search */}
			<div className="relative">
				<Search className="-translate-y-1/2 absolute top-1/2 left-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search clients..."
					value={filters.search}
					onChange={(e) =>
						onFiltersChange({ ...filters, search: e.target.value })
					}
					className="h-8 w-[200px] pl-8 text-sm"
				/>
			</div>

			{/* Status */}
			<Select
				value={filters.status}
				onValueChange={(val) =>
					onFiltersChange({
						...filters,
						status: val as ClientStatus | "all",
					})
				}
			>
				<SelectTrigger size="sm" className="h-8 w-[130px] text-xs">
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Statuses</SelectItem>
					<SelectItem value="New Lead">New Lead</SelectItem>
					<SelectItem value="Prospect">Prospect</SelectItem>
					<SelectItem value="Active">Active</SelectItem>
					<SelectItem value="On Hold">On Hold</SelectItem>
					<SelectItem value="Churned">Churned</SelectItem>
				</SelectContent>
			</Select>

			{/* Type */}
			<Select
				value={filters.clientType}
				onValueChange={(val) =>
					onFiltersChange({
						...filters,
						clientType: val as ClientType | "all",
					})
				}
			>
				<SelectTrigger size="sm" className="h-8 w-[130px] text-xs">
					<SelectValue placeholder="Type" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Types</SelectItem>
					<SelectItem value="Individual">Individual</SelectItem>
					<SelectItem value="Business">Business</SelectItem>
				</SelectContent>
			</Select>

			{/* Quality */}
			<Select
				value={filters.quality}
				onValueChange={(val) =>
					onFiltersChange({
						...filters,
						quality: val as ClientQuality | "all",
					})
				}
			>
				<SelectTrigger size="sm" className="h-8 w-[130px] text-xs">
					<SelectValue placeholder="Quality" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Quality</SelectItem>
					<SelectItem value="Great">Great</SelectItem>
					<SelectItem value="Good">Good</SelectItem>
					<SelectItem value="Okay">Okay</SelectItem>
					<SelectItem value="Difficult">Difficult</SelectItem>
				</SelectContent>
			</Select>

			{/* Language */}
			<Select
				value={filters.language}
				onValueChange={(val) =>
					onFiltersChange({
						...filters,
						language: val as LanguagePreference | "all",
					})
				}
			>
				<SelectTrigger size="sm" className="h-8 w-[130px] text-xs">
					<SelectValue placeholder="Language" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Languages</SelectItem>
					<SelectItem value="English">English</SelectItem>
					<SelectItem value="Spanish">Spanish</SelectItem>
					<SelectItem value="Both">Both</SelectItem>
				</SelectContent>
			</Select>

			{/* Source */}
			<Select
				value={filters.source}
				onValueChange={(val) =>
					onFiltersChange({
						...filters,
						source: val as ClientSource | "all",
					})
				}
			>
				<SelectTrigger size="sm" className="h-8 w-[130px] text-xs">
					<SelectValue placeholder="Source" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Sources</SelectItem>
					<SelectItem value="Referral">Referral</SelectItem>
					<SelectItem value="Website">Website</SelectItem>
					<SelectItem value="Phone">Phone</SelectItem>
					<SelectItem value="Email">Email</SelectItem>
					<SelectItem value="WhatsApp">WhatsApp</SelectItem>
				</SelectContent>
			</Select>

			{/* Clear Filters */}
			{hasActiveFilters && (
				<Button
					variant="ghost"
					size="sm"
					onClick={clearFilters}
					className="h-8 px-2 text-xs"
				>
					<X className="mr-1 h-3 w-3" />
					Clear
				</Button>
			)}
		</div>
	);
}
