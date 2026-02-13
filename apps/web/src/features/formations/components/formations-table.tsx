"use client";

import { useMemo, useState } from "react";

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

import { ArrowUpDown, ExternalLinkIcon } from "lucide-react";
import { mockFormations } from "../data/mock-data";
import type { BusinessFormation } from "../types";
import FormationFilters from "./formation-filters";

type SortField =
	| "formationNumber"
	| "clientName"
	| "entityType"
	| "stateOfIncorporation"
	| "status"
	| "confirmedName"
	| "amount";
type SortDirection = "asc" | "desc";

function getStatusColorScheme(
	status: BusinessFormation["status"],
): "green" | "blue" | "yellow" | "orange" | "purple" | "gray" {
	switch (status) {
		case "Complete":
			return "green";
		case "Info Gathering":
			return "gray";
		case "Name Search":
			return "blue";
		case "Name Approved":
			return "purple";
		case "State Filing":
			return "orange";
		case "Awaiting EIN":
			return "yellow";
		case "Awaiting State Tax ID":
			return "yellow";
		default:
			return "gray";
	}
}

function getEntityBadgeVariant(
	entityType: BusinessFormation["entityType"],
): "default" | "secondary" | "outline" | "destructive" {
	switch (entityType) {
		case "LLC":
			return "default";
		case "S-Corp":
			return "secondary";
		case "C-Corp":
			return "outline";
		case "Partnership":
			return "secondary";
		case "Sole Prop":
			return "outline";
		default:
			return "default";
	}
}

function SortableHeader({
	field,
	children,
	onSort,
}: {
	field: SortField;
	children: React.ReactNode;
	onSort: (field: SortField) => void;
}) {
	return (
		<TableHead>
			<button
				type="button"
				onClick={() => onSort(field)}
				className="flex items-center gap-1 font-medium hover:text-foreground"
			>
				{children}
				<ArrowUpDown className="h-3 w-3 text-muted-foreground" />
			</button>
		</TableHead>
	);
}

export default function FormationsTable() {
	const [sortField, setSortField] = useState<SortField>("formationNumber");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [entityTypeFilter, setEntityTypeFilter] = useState("all");
	const [stateFilter, setStateFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const filteredAndSorted = useMemo(() => {
		let result = [...mockFormations];

		// Apply filters
		if (entityTypeFilter !== "all") {
			result = result.filter((f) => f.entityType === entityTypeFilter);
		}
		if (stateFilter !== "all") {
			result = result.filter((f) => f.stateOfIncorporation === stateFilter);
		}
		if (statusFilter !== "all") {
			result = result.filter((f) => f.status === statusFilter);
		}

		// Apply sorting
		result.sort((a, b) => {
			const aVal = a[sortField] ?? "";
			const bVal = b[sortField] ?? "";
			const comparison = String(aVal).localeCompare(String(bVal));
			return sortDirection === "asc" ? comparison : -comparison;
		});

		return result;
	}, [sortField, sortDirection, entityTypeFilter, stateFilter, statusFilter]);

	const clearFilters = () => {
		setEntityTypeFilter("all");
		setStateFilter("all");
		setStatusFilter("all");
	};

	return (
		<div className="space-y-4">
			<FormationFilters
				entityTypeFilter={entityTypeFilter}
				stateFilter={stateFilter}
				statusFilter={statusFilter}
				onEntityTypeChange={setEntityTypeFilter}
				onStateChange={setStateFilter}
				onStatusChange={setStatusFilter}
				onClearFilters={clearFilters}
			/>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<SortableHeader field="formationNumber" onSort={handleSort}>
								Formation #
							</SortableHeader>
							<SortableHeader field="clientName" onSort={handleSort}>
								Client
							</SortableHeader>
							<SortableHeader field="entityType" onSort={handleSort}>
								Entity Type
							</SortableHeader>
							<SortableHeader field="stateOfIncorporation" onSort={handleSort}>
								State
							</SortableHeader>
							<SortableHeader field="status" onSort={handleSort}>
								Status
							</SortableHeader>
							<SortableHeader field="confirmedName" onSort={handleSort}>
								Confirmed Name
							</SortableHeader>
							<SortableHeader field="amount" onSort={handleSort}>
								Fee
							</SortableHeader>
							<TableHead className="w-[50px]" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAndSorted.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className="h-24 text-center text-muted-foreground"
								>
									No formations match the current filters.
								</TableCell>
							</TableRow>
						) : (
							filteredAndSorted.map((formation) => (
								<TableRow
									key={formation.id}
									className="cursor-pointer hover:bg-muted/50"
								>
									<TableCell>
										<Link
											href={`/dashboard/formations/${formation.id}`}
											className="font-medium text-primary hover:underline"
										>
											{formation.formationNumber}
										</Link>
									</TableCell>
									<TableCell>
										<Link
											href={`/dashboard/clients/${formation.clientId}`}
											className="hover:underline"
										>
											{formation.clientName}
										</Link>
									</TableCell>
									<TableCell>
										<Badge
											variant={getEntityBadgeVariant(formation.entityType)}
										>
											{formation.entityType}
										</Badge>
									</TableCell>
									<TableCell>{formation.stateOfIncorporation}</TableCell>
									<TableCell>
										<StatusBadge
											colorScheme={getStatusColorScheme(formation.status)}
										>
											{formation.status}
										</StatusBadge>
									</TableCell>
									<TableCell className="max-w-[200px] truncate">
										{formation.confirmedName || (
											<span className="text-muted-foreground italic">
												Pending
											</span>
										)}
									</TableCell>
									<TableCell className="font-medium">
										${formation.amount.toLocaleString()}
									</TableCell>
									<TableCell>
										<Link
											href={`/dashboard/formations/${formation.id}`}
											className="text-muted-foreground hover:text-foreground"
										>
											<ExternalLinkIcon className="h-4 w-4" />
										</Link>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="text-muted-foreground text-sm">
				Showing {filteredAndSorted.length} of {mockFormations.length} formations
			</div>
		</div>
	);
}
