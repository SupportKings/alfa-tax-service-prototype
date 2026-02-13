"use client";

import { useMemo, useState } from "react";

import { Link } from "@/components/fastLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	AlertTriangle,
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import type { ServiceSubscription } from "../types";

interface SubscriptionsTableProps {
	subscriptions: ServiceSubscription[];
}

type SortField =
	| "client_name"
	| "service_name"
	| "status"
	| "price"
	| "frequency"
	| "start_date";
type SortDirection = "asc" | "desc";

function getStatusBadge(status: ServiceSubscription["status"]) {
	switch (status) {
		case "Active - Current":
			return (
				<Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
					Active - Current
				</Badge>
			);
		case "Active - Behind":
			return (
				<Badge variant="destructive" className="gap-1">
					<AlertTriangle className="h-3 w-3" />
					Active - Behind
				</Badge>
			);
		case "Pending Setup":
			return (
				<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
					Pending Setup
				</Badge>
			);
		case "Paused":
			return (
				<Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
					Paused
				</Badge>
			);
		case "Cancelled":
			return (
				<Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
					Cancelled
				</Badge>
			);
		case "Completed":
			return (
				<Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">
					Completed
				</Badge>
			);
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
}

function formatCurrency(amount: number, frequency: string): string {
	const formatted = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);

	const suffixMap: Record<string, string> = {
		Monthly: "/mo",
		Quarterly: "/qtr",
		Annually: "/yr",
		"One-Time": "",
	};

	return `${formatted}${suffixMap[frequency] || ""}`;
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

const PAGE_SIZE = 15;

const STATUS_ORDER: Record<string, number> = {
	"Active - Behind": 0,
	"Active - Current": 1,
	"Pending Setup": 2,
	Paused: 3,
	Cancelled: 4,
	Completed: 5,
};

function SortIcon({
	field,
	sortField,
	sortDirection,
}: {
	field: SortField;
	sortField: SortField;
	sortDirection: SortDirection;
}) {
	if (sortField !== field) {
		return (
			<ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground/50" />
		);
	}
	return sortDirection === "asc" ? (
		<ArrowUp className="ml-1 inline h-3 w-3" />
	) : (
		<ArrowDown className="ml-1 inline h-3 w-3" />
	);
}

export default function SubscriptionsTable({
	subscriptions,
}: SubscriptionsTableProps) {
	const [sortField, setSortField] = useState<SortField>("status");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [page, setPage] = useState(0);

	const sorted = useMemo(() => {
		return [...subscriptions].sort((a, b) => {
			let comparison = 0;
			switch (sortField) {
				case "client_name":
					comparison = a.client_name.localeCompare(b.client_name);
					break;
				case "service_name":
					comparison = a.service_name.localeCompare(b.service_name);
					break;
				case "status":
					comparison =
						(STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
					break;
				case "price":
					comparison = a.price - b.price;
					break;
				case "frequency":
					comparison = a.frequency.localeCompare(b.frequency);
					break;
				case "start_date":
					comparison =
						new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
					break;
			}
			return sortDirection === "asc" ? comparison : -comparison;
		});
	}, [subscriptions, sortField, sortDirection]);

	const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
	const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

	function handleSort(field: SortField) {
		if (sortField === field) {
			setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
		setPage(0);
	}

	return (
		<div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead>
								<button
									type="button"
									onClick={() => handleSort("client_name")}
									className="flex items-center font-medium"
								>
									Client
									<SortIcon
										field="client_name"
										sortField={sortField}
										sortDirection={sortDirection}
									/>
								</button>
							</TableHead>
							<TableHead>
								<button
									type="button"
									onClick={() => handleSort("service_name")}
									className="flex items-center font-medium"
								>
									Service
									<SortIcon
										field="service_name"
										sortField={sortField}
										sortDirection={sortDirection}
									/>
								</button>
							</TableHead>
							<TableHead>
								<button
									type="button"
									onClick={() => handleSort("status")}
									className="flex items-center font-medium"
								>
									Status
									<SortIcon
										field="status"
										sortField={sortField}
										sortDirection={sortDirection}
									/>
								</button>
							</TableHead>
							<TableHead className="text-right">
								<button
									type="button"
									onClick={() => handleSort("price")}
									className="ml-auto flex items-center font-medium"
								>
									Price
									<SortIcon
										field="price"
										sortField={sortField}
										sortDirection={sortDirection}
									/>
								</button>
							</TableHead>
							<TableHead>
								<button
									type="button"
									onClick={() => handleSort("frequency")}
									className="flex items-center font-medium"
								>
									Frequency
									<SortIcon
										field="frequency"
										sortField={sortField}
										sortDirection={sortDirection}
									/>
								</button>
							</TableHead>
							<TableHead>
								<button
									type="button"
									onClick={() => handleSort("start_date")}
									className="flex items-center font-medium"
								>
									Start Date
									<SortIcon
										field="start_date"
										sortField={sortField}
										sortDirection={sortDirection}
									/>
								</button>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginated.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center text-muted-foreground"
								>
									No subscriptions match the current filters.
								</TableCell>
							</TableRow>
						) : (
							paginated.map((sub) => (
								<TableRow
									key={sub.id}
									className={
										sub.status === "Active - Behind"
											? "bg-destructive/5 hover:bg-destructive/10"
											: ""
									}
								>
									<TableCell className="font-medium">
										<Link
											href={`/dashboard/clients/${sub.client_id}`}
											className="text-primary underline-offset-4 hover:underline"
										>
											{sub.client_name}
										</Link>
										<span className="ml-2 text-muted-foreground text-xs">
											{sub.client_type}
										</span>
									</TableCell>
									<TableCell>
										<Link
											href={`/dashboard/subscriptions/${sub.id}`}
											className="text-foreground underline-offset-4 hover:underline"
										>
											{sub.service_name}
										</Link>
										<span className="ml-2 text-muted-foreground text-xs">
											{sub.offer_type}
										</span>
									</TableCell>
									<TableCell>{getStatusBadge(sub.status)}</TableCell>
									<TableCell className="text-right font-mono text-sm">
										{formatCurrency(sub.price, sub.frequency)}
									</TableCell>
									<TableCell>{sub.frequency}</TableCell>
									<TableCell className="text-muted-foreground">
										{formatDate(sub.start_date)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between px-2 pt-4">
					<p className="text-muted-foreground text-sm">
						Showing {page * PAGE_SIZE + 1} -{" "}
						{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}{" "}
						subscriptions
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.max(0, p - 1))}
							disabled={page === 0}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="text-sm">
							Page {page + 1} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
							disabled={page >= totalPages - 1}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
