"use client";

import { useState } from "react";

import { Link } from "@/components/fastLink";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { ArrowDown, ArrowUp, ArrowUpDown, Eye } from "lucide-react";
import type { Client, ClientQualityScore, ClientStatus } from "../types";

type SortField =
	| "full_name"
	| "status"
	| "client_type"
	| "quality"
	| "qualityScore"
	| "phone"
	| "language"
	| "source";
type SortDirection = "asc" | "desc";

interface ClientsTableProps {
	clients: Client[];
}

function getQualityVariant(
	quality: string,
): "default" | "secondary" | "outline" | "destructive" {
	switch (quality) {
		case "Great":
			return "default";
		case "Good":
			return "secondary";
		case "Okay":
			return "outline";
		case "Difficult":
			return "destructive";
		default:
			return "outline";
	}
}

function getStatusColorScheme(
	status: ClientStatus,
): "green" | "yellow" | "red" | "orange" | "blue" {
	switch (status) {
		case "Active":
			return "green";
		case "Prospect":
			return "yellow";
		case "New Lead":
			return "orange";
		case "On Hold":
			return "blue";
		case "Churned":
			return "red";
		default:
			return "green";
	}
}

function getQualityScoreColorScheme(
	score: ClientQualityScore,
): "green" | "blue" | "yellow" | "red" {
	switch (score) {
		case "excellent":
			return "green";
		case "good":
			return "blue";
		case "fair":
			return "yellow";
		case "poor":
			return "red";
		default:
			return "green";
	}
}

function formatQualityScoreLabel(score: ClientQualityScore): string {
	return score.charAt(0).toUpperCase() + score.slice(1);
}

function SortIcon({
	field,
	activeField,
	direction,
}: {
	field: SortField;
	activeField: SortField;
	direction: SortDirection;
}) {
	if (activeField !== field) {
		return (
			<ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground/50" />
		);
	}
	return direction === "asc" ? (
		<ArrowUp className="ml-1 inline h-3 w-3" />
	) : (
		<ArrowDown className="ml-1 inline h-3 w-3" />
	);
}

export default function ClientsTable({ clients }: ClientsTableProps) {
	const [sortField, setSortField] = useState<SortField>("full_name");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedClients = [...clients].sort((a, b) => {
		const aVal = a[sortField];
		const bVal = b[sortField];
		const multiplier = sortDirection === "asc" ? 1 : -1;

		if (typeof aVal === "string" && typeof bVal === "string") {
			return aVal.localeCompare(bVal) * multiplier;
		}
		return 0;
	});

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("full_name")}
					>
						Client Name
						<SortIcon
							field="full_name"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("status")}
					>
						Status
						<SortIcon
							field="status"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("client_type")}
					>
						Type
						<SortIcon
							field="client_type"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("quality")}
					>
						Quality
						<SortIcon
							field="quality"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("qualityScore")}
					>
						Quality Score
						<SortIcon
							field="qualityScore"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("phone")}
					>
						Phone
						<SortIcon
							field="phone"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("language")}
					>
						Language
						<SortIcon
							field="language"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead
						className="cursor-pointer select-none"
						onClick={() => handleSort("source")}
					>
						Source
						<SortIcon
							field="source"
							activeField={sortField}
							direction={sortDirection}
						/>
					</TableHead>
					<TableHead className="w-[50px]" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{sortedClients.map((client) => (
					<TableRow key={client.id} className="hover:bg-muted/50">
						<TableCell>
							<Link
								href={`/dashboard/clients/${client.id}`}
								className="font-medium text-sm hover:underline"
							>
								{client.full_name}
							</Link>
						</TableCell>
						<TableCell>
							<StatusBadge colorScheme={getStatusColorScheme(client.status)}>
								{client.status}
							</StatusBadge>
						</TableCell>
						<TableCell>
							<span className="text-muted-foreground text-sm">
								{client.client_type}
							</span>
						</TableCell>
						<TableCell>
							<Badge variant={getQualityVariant(client.quality)}>
								{client.quality}
							</Badge>
						</TableCell>
						<TableCell>
							<div className="flex items-center gap-2">
								<StatusBadge
									colorScheme={getQualityScoreColorScheme(client.qualityScore)}
								>
									{formatQualityScoreLabel(client.qualityScore)}
								</StatusBadge>
								<span className="text-muted-foreground text-xs">
									{client.avgResponseDays}d
								</span>
							</div>
						</TableCell>
						<TableCell>
							<span className="font-mono text-muted-foreground text-sm">
								{client.phone}
							</span>
						</TableCell>
						<TableCell>
							<span className="text-muted-foreground text-sm">
								{client.language}
							</span>
						</TableCell>
						<TableCell>
							<span className="text-muted-foreground text-sm">
								{client.source}
							</span>
						</TableCell>
						<TableCell>
							<Link
								href={`/dashboard/clients/${client.id}`}
								className="text-muted-foreground hover:text-foreground"
							>
								<Eye className="h-4 w-4" />
							</Link>
						</TableCell>
					</TableRow>
				))}
				{sortedClients.length === 0 && (
					<TableRow>
						<TableCell colSpan={9} className="py-8 text-center">
							<p className="text-muted-foreground text-sm">
								No clients match your filters.
							</p>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
