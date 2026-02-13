"use client";

import type React from "react";
import { useMemo, useState } from "react";

import { Link } from "@/components/fastLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { ArrowUpDown, Check, Minus } from "lucide-react";
import type { AdvisoryEngagement } from "../types";

interface AdvisoryTableProps {
	engagements: AdvisoryEngagement[];
}

type SortField =
	| "engagement_number"
	| "client_name"
	| "engagement_type"
	| "status"
	| "amount"
	| "billing_type";
type SortDirection = "asc" | "desc";

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function getStatusColor(
	status: string,
): "green" | "blue" | "yellow" | "gray" | "orange" | "purple" {
	switch (status) {
		case "Complete":
			return "green";
		case "Implementation":
		case "Presentation Complete":
			return "blue";
		case "Analysis":
		case "Presentation Scheduled":
		case "Documents Gathering":
			return "blue";
		case "Signed":
			return "purple";
		case "Proposal Sent":
		case "Discovery Call":
			return "yellow";
		case "Inquiry":
			return "gray";
		default:
			return "gray";
	}
}

function getBillingBadgeVariant(
	billingType: string,
): "default" | "secondary" | "outline" {
	switch (billingType) {
		case "Annual":
			return "default";
		case "Hourly":
			return "secondary";
		case "One-Time":
			return "outline";
		default:
			return "outline";
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
		<Button
			variant="ghost"
			size="sm"
			className="-ml-3 h-8 font-medium text-foreground"
			onClick={() => onSort(field)}
			type="button"
		>
			{children}
			<ArrowUpDown className="ml-1 h-3 w-3" />
		</Button>
	);
}

export default function AdvisoryTable({ engagements }: AdvisoryTableProps) {
	const [sortField, setSortField] = useState<SortField>("engagement_number");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedEngagements = useMemo(() => {
		return [...engagements].sort((a, b) => {
			const multiplier = sortDirection === "asc" ? 1 : -1;

			switch (sortField) {
				case "amount":
					return (a.amount - b.amount) * multiplier;
				case "engagement_number":
				case "client_name":
				case "engagement_type":
				case "status":
				case "billing_type":
					return a[sortField].localeCompare(b[sortField]) * multiplier;
				default:
					return 0;
			}
		});
	}, [engagements, sortField, sortDirection]);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<SortableHeader field="engagement_number" onSort={handleSort}>
							Engagement #
						</SortableHeader>
					</TableHead>
					<TableHead>
						<SortableHeader field="client_name" onSort={handleSort}>
							Client
						</SortableHeader>
					</TableHead>
					<TableHead>
						<SortableHeader field="engagement_type" onSort={handleSort}>
							Type
						</SortableHeader>
					</TableHead>
					<TableHead>
						<SortableHeader field="status" onSort={handleSort}>
							Status
						</SortableHeader>
					</TableHead>
					<TableHead>
						<SortableHeader field="amount" onSort={handleSort}>
							Fee
						</SortableHeader>
					</TableHead>
					<TableHead>
						<SortableHeader field="billing_type" onSort={handleSort}>
							Billing
						</SortableHeader>
					</TableHead>
					<TableHead className="text-center">Implementation?</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{sortedEngagements.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={7}
							className="h-24 text-center text-muted-foreground"
						>
							No engagements match the current filters.
						</TableCell>
					</TableRow>
				) : (
					sortedEngagements.map((engagement) => (
						<TableRow key={engagement.id} className="hover:bg-muted/50">
							<TableCell className="font-medium">
								<Link
									href={`/dashboard/advisory/${engagement.id}`}
									className="text-primary underline-offset-4 hover:underline"
								>
									{engagement.engagement_number}
								</Link>
							</TableCell>
							<TableCell>
								<Link
									href={`/dashboard/clients/${engagement.client_id}`}
									className="text-primary underline-offset-4 hover:underline"
								>
									{engagement.client_name}
								</Link>
							</TableCell>
							<TableCell>
								<span className="text-sm">{engagement.engagement_type}</span>
							</TableCell>
							<TableCell>
								<StatusBadge colorScheme={getStatusColor(engagement.status)}>
									{engagement.status}
								</StatusBadge>
							</TableCell>
							<TableCell className="font-medium">
								{engagement.amount > 0
									? formatCurrency(engagement.amount)
									: "--"}
							</TableCell>
							<TableCell>
								<Badge
									variant={getBillingBadgeVariant(engagement.billing_type)}
								>
									{engagement.billing_type}
								</Badge>
							</TableCell>
							<TableCell className="text-center">
								{engagement.implementation_offered ? (
									<Check className="mx-auto h-4 w-4 text-green-600" />
								) : (
									<Minus className="mx-auto h-4 w-4 text-muted-foreground" />
								)}
							</TableCell>
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}
