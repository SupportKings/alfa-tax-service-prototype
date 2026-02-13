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

import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Globe,
	Mail,
	MessageCircle,
	Monitor,
	Phone,
	UserRound,
} from "lucide-react";
import type { Request, RequestPriority, RequestSource } from "../types";

interface RequestsTableProps {
	requests: Request[];
}

type SortField =
	| "requestNumber"
	| "clientName"
	| "title"
	| "requestType"
	| "source"
	| "priority"
	| "status"
	| "createdAt";
type SortDirection = "asc" | "desc";

const priorityOrder: Record<RequestPriority, number> = {
	Urgent: 0,
	Normal: 1,
	Low: 2,
};

const statusOrder: Record<string, number> = {
	New: 0,
	Triaged: 1,
	"In Progress": 2,
	"Waiting on Client": 3,
	"Won't Do": 4,
	Resolved: 5,
};

function getPriorityBadge(priority: RequestPriority) {
	switch (priority) {
		case "Urgent":
			return (
				<Badge variant="destructive" className="text-[11px]">
					Urgent
				</Badge>
			);
		case "Normal":
			return (
				<Badge className="border-yellow-200 bg-yellow-50 text-[11px] text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400">
					Normal
				</Badge>
			);
		case "Low":
			return (
				<Badge variant="secondary" className="text-[11px]">
					Low
				</Badge>
			);
	}
}

function getSourceIcon(source: RequestSource) {
	const iconClass = "h-3.5 w-3.5 text-muted-foreground";
	switch (source) {
		case "TaxDome":
			return <Monitor className={iconClass} />;
		case "Phone":
			return <Phone className={iconClass} />;
		case "Email":
			return <Mail className={iconClass} />;
		case "WhatsApp":
			return <MessageCircle className={iconClass} />;
		case "Website":
			return <Globe className={iconClass} />;
		case "Walk-In":
			return <UserRound className={iconClass} />;
	}
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

interface SortIconProps {
	field: SortField;
	currentSortField: SortField;
	currentSortDirection: SortDirection;
}

function SortIcon({
	field,
	currentSortField,
	currentSortDirection,
}: SortIconProps) {
	if (currentSortField !== field) {
		return (
			<ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground/50" />
		);
	}
	return currentSortDirection === "asc" ? (
		<ArrowUp className="ml-1 inline h-3 w-3" />
	) : (
		<ArrowDown className="ml-1 inline h-3 w-3" />
	);
}

export default function RequestsTable({ requests }: RequestsTableProps) {
	const [sortField, setSortField] = useState<SortField>("createdAt");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedRequests = [...requests].sort((a, b) => {
		const direction = sortDirection === "asc" ? 1 : -1;

		switch (sortField) {
			case "requestNumber":
				return a.requestNumber.localeCompare(b.requestNumber) * direction;
			case "clientName":
				return a.clientName.localeCompare(b.clientName) * direction;
			case "title":
				return a.title.localeCompare(b.title) * direction;
			case "requestType":
				return a.requestType.localeCompare(b.requestType) * direction;
			case "source":
				return a.source.localeCompare(b.source) * direction;
			case "priority":
				return (
					(priorityOrder[a.priority] - priorityOrder[b.priority]) * direction
				);
			case "status":
				return (
					((statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)) *
					direction
				);
			case "createdAt":
				return (
					(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
					direction
				);
			default:
				return 0;
		}
	});

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("requestNumber")}
						>
							Request #
							<SortIcon
								field="requestNumber"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("clientName")}
						>
							Client
							<SortIcon
								field="clientName"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("title")}
						>
							Title
							<SortIcon
								field="title"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("requestType")}
						>
							Type
							<SortIcon
								field="requestType"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("source")}
						>
							Source
							<SortIcon
								field="source"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("priority")}
						>
							Priority
							<SortIcon
								field="priority"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("status")}
						>
							Status
							<SortIcon
								field="status"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
					<TableHead>
						<button
							type="button"
							className="flex items-center text-xs hover:text-foreground"
							onClick={() => handleSort("createdAt")}
						>
							Created
							<SortIcon
								field="createdAt"
								currentSortField={sortField}
								currentSortDirection={sortDirection}
							/>
						</button>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{sortedRequests.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={8}
							className="py-8 text-center text-muted-foreground"
						>
							No requests match the current filters.
						</TableCell>
					</TableRow>
				) : (
					sortedRequests.map((request) => (
						<TableRow key={request.id} className="hover:bg-muted/50">
							<TableCell className="font-mono text-xs">
								<Link
									href={`/dashboard/requests/${request.id}`}
									className="text-primary underline-offset-4 hover:underline"
								>
									{request.requestNumber}
								</Link>
							</TableCell>
							<TableCell className="text-xs">
								<Link
									href={`/dashboard/clients/${request.clientId}`}
									className="text-primary underline-offset-4 hover:underline"
								>
									{request.clientName}
								</Link>
							</TableCell>
							<TableCell className="max-w-[250px] truncate text-xs">
								{request.title}
							</TableCell>
							<TableCell>
								<Badge variant="outline" className="text-[11px]">
									{request.requestType}
								</Badge>
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-1.5">
									{getSourceIcon(request.source)}
									<span className="text-xs">{request.source}</span>
								</div>
							</TableCell>
							<TableCell>{getPriorityBadge(request.priority)}</TableCell>
							<TableCell>
								<StatusBadge>{request.status}</StatusBadge>
							</TableCell>
							<TableCell className="text-muted-foreground text-xs">
								{formatDate(request.createdAt)}
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
