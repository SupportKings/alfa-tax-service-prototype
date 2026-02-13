"use client";

import { useMemo, useState } from "react";

import { Link } from "@/components/fastLink";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type {
	TaxReturn,
	TaxReturnFilterState,
	TaxReturnStatus,
} from "../types";

interface TaxReturnsTableProps {
	data: TaxReturn[];
	filters: TaxReturnFilterState;
}

type SortField =
	| "taxReturnNumber"
	| "clientName"
	| "taxYear"
	| "returnType"
	| "status"
	| "complexity"
	| "dueDate"
	| "amount";

type SortDirection = "asc" | "desc";

function getStatusBadgeClasses(status: TaxReturnStatus): string {
	switch (status) {
		case "Not Started":
		case "Intake":
			return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
		case "Documents Gathering":
		case "In Preparation":
			return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
		case "In Review":
			return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
		case "Waiting on Client":
			return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
		case "Ready to File":
		case "E-Filed":
			return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
		case "Complete":
			return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
		default:
			return "";
	}
}

function getComplexityBadgeClasses(complexity: string): string {
	switch (complexity) {
		case "Simple":
			return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700";
		case "Standard":
			return "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800";
		case "Complex":
			return "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800";
		default:
			return "";
	}
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

const statusOrder: Record<TaxReturnStatus, number> = {
	"Not Started": 0,
	Intake: 1,
	"Documents Gathering": 2,
	"In Preparation": 3,
	"In Review": 4,
	"Waiting on Client": 5,
	"Ready to File": 6,
	"E-Filed": 7,
	Complete: 8,
};

export default function TaxReturnsTable({
	data,
	filters,
}: TaxReturnsTableProps) {
	const [sortField, setSortField] = useState<SortField>("taxReturnNumber");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	const filteredData = useMemo(() => {
		return data.filter((item) => {
			if (filters.status !== "all" && item.status !== filters.status) {
				return false;
			}
			if (
				filters.returnType !== "all" &&
				item.returnType !== filters.returnType
			) {
				return false;
			}
			if (
				filters.complexity !== "all" &&
				item.complexity !== filters.complexity
			) {
				return false;
			}
			if (filters.taxYear !== "all" && item.taxYear !== filters.taxYear) {
				return false;
			}
			return true;
		});
	}, [data, filters]);

	const sortedData = useMemo(() => {
		const sorted = [...filteredData].sort((a, b) => {
			let comparison = 0;

			switch (sortField) {
				case "taxReturnNumber":
					comparison = a.taxReturnNumber.localeCompare(b.taxReturnNumber);
					break;
				case "clientName":
					comparison = a.clientName.localeCompare(b.clientName);
					break;
				case "taxYear":
					comparison = a.taxYear - b.taxYear;
					break;
				case "returnType":
					comparison = a.returnType.localeCompare(b.returnType);
					break;
				case "status":
					comparison = statusOrder[a.status] - statusOrder[b.status];
					break;
				case "complexity": {
					const complexityOrder = { Simple: 0, Standard: 1, Complex: 2 };
					comparison =
						complexityOrder[a.complexity] - complexityOrder[b.complexity];
					break;
				}
				case "dueDate":
					comparison =
						new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
					break;
				case "amount":
					comparison = a.amount - b.amount;
					break;
			}

			return sortDirection === "asc" ? comparison : -comparison;
		});

		return sorted;
	}, [filteredData, sortField, sortDirection]);

	function handleSort(field: SortField) {
		if (sortField === field) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	}

	function renderSortIcon(field: SortField) {
		if (sortField !== field) {
			return (
				<ArrowUpDown className="ml-1 inline h-3 w-3 text-muted-foreground" />
			);
		}
		return sortDirection === "asc" ? (
			<ArrowUp className="ml-1 inline h-3 w-3" />
		) : (
			<ArrowDown className="ml-1 inline h-3 w-3" />
		);
	}

	return (
		<div>
			<div className="mb-2 text-muted-foreground text-xs">
				{sortedData.length} of {data.length} returns
			</div>
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead>
							<button
								type="button"
								className="flex items-center font-medium text-xs"
								onClick={() => handleSort("taxReturnNumber")}
							>
								Return #{renderSortIcon("taxReturnNumber")}
							</button>
						</TableHead>
						<TableHead>
							<button
								type="button"
								className="flex items-center font-medium text-xs"
								onClick={() => handleSort("clientName")}
							>
								Client
								{renderSortIcon("clientName")}
							</button>
						</TableHead>
						<TableHead>
							<button
								type="button"
								className="flex items-center font-medium text-xs"
								onClick={() => handleSort("taxYear")}
							>
								Tax Year
								{renderSortIcon("taxYear")}
							</button>
						</TableHead>
						<TableHead>
							<button
								type="button"
								className="flex items-center font-medium text-xs"
								onClick={() => handleSort("returnType")}
							>
								Type
								{renderSortIcon("returnType")}
							</button>
						</TableHead>
						<TableHead>
							<button
								type="button"
								className="flex items-center font-medium text-xs"
								onClick={() => handleSort("status")}
							>
								Status
								{renderSortIcon("status")}
							</button>
						</TableHead>
						<TableHead>
							<button
								type="button"
								className="flex items-center font-medium text-xs"
								onClick={() => handleSort("complexity")}
							>
								Complexity
								{renderSortIcon("complexity")}
							</button>
						</TableHead>
						<TableHead>
							<button
								type="button"
								className="flex items-center font-medium text-xs"
								onClick={() => handleSort("dueDate")}
							>
								Due Date
								{renderSortIcon("dueDate")}
							</button>
						</TableHead>
						<TableHead className="text-right">
							<button
								type="button"
								className="ml-auto flex items-center font-medium text-xs"
								onClick={() => handleSort("amount")}
							>
								Fee
								{renderSortIcon("amount")}
							</button>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedData.map((item) => (
						<TableRow
							key={item.id}
							className="cursor-pointer hover:bg-muted/50"
						>
							<TableCell>
								<Link
									href={`/dashboard/tax-returns/${item.id}`}
									className="font-medium text-primary text-xs hover:underline"
								>
									{item.taxReturnNumber}
								</Link>
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<Link
										href={`/dashboard/clients/${item.clientId}`}
										className="font-medium text-xs hover:underline"
									>
										{item.clientName}
									</Link>
									<span className="text-[11px] text-muted-foreground">
										{item.clientType}
									</span>
								</div>
							</TableCell>
							<TableCell className="text-xs">{item.taxYear}</TableCell>
							<TableCell className="text-xs">{item.returnType}</TableCell>
							<TableCell>
								<Badge
									variant="outline"
									className={getStatusBadgeClasses(item.status)}
								>
									{item.status}
								</Badge>
							</TableCell>
							<TableCell>
								<Badge
									variant="outline"
									className={getComplexityBadgeClasses(item.complexity)}
								>
									{item.complexity}
								</Badge>
							</TableCell>
							<TableCell className="text-xs">
								{formatDate(item.dueDate)}
							</TableCell>
							<TableCell className="text-right font-medium text-xs tabular-nums">
								{formatCurrency(item.amount)}
							</TableCell>
						</TableRow>
					))}
					{sortedData.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={8}
								className="py-8 text-center text-muted-foreground"
							>
								No tax returns match the current filters.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
