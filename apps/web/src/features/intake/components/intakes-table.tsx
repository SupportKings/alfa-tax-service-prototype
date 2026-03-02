"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { ArrowDown, ArrowUp, ArrowUpDown, FileText } from "lucide-react";
import type { IntakeSubmission } from "../types";

type SortField = "name" | "email" | "client_type" | "source" | "created_at";
type SortDirection = "asc" | "desc";

interface IntakesTableProps {
	submissions: IntakeSubmission[];
	onSelect: (submission: IntakeSubmission) => void;
}

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
		return <ArrowUpDown className="ml-1 inline h-3 w-3" />;
	}
	return sortDirection === "asc" ? (
		<ArrowUp className="ml-1 inline h-3 w-3" />
	) : (
		<ArrowDown className="ml-1 inline h-3 w-3" />
	);
}

function getSourceVariant(source: string): "default" | "secondary" | "outline" {
	switch (source) {
		case "Website":
			return "default";
		case "Email":
			return "secondary";
		case "Phone":
			return "outline";
		case "Text":
			return "outline";
		default:
			return "outline";
	}
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function IntakesTable({
	submissions,
	onSelect,
}: IntakesTableProps) {
	const [sortField, setSortField] = useState<SortField>("created_at");
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

	function handleSort(field: SortField) {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	}

	const sorted = [...submissions].sort((a, b) => {
		const dir = sortDirection === "asc" ? 1 : -1;
		switch (sortField) {
			case "name":
				return (
					dir *
					`${a.first_name} ${a.last_name}`.localeCompare(
						`${b.first_name} ${b.last_name}`,
					)
				);
			case "email":
				return dir * a.email.localeCompare(b.email);
			case "client_type":
				return dir * a.client_type.localeCompare(b.client_type);
			case "source":
				return dir * a.source.localeCompare(b.source);
			case "created_at":
				return (
					dir *
					(new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
				);
			default:
				return 0;
		}
	});

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<button
								type="button"
								onClick={() => handleSort("name")}
								className="flex items-center font-medium"
							>
								Name
								<SortIcon
									sortField={sortField}
									sortDirection={sortDirection}
									field="name"
								/>
							</button>
						</TableHead>
						<TableHead>
							<button
								type="button"
								onClick={() => handleSort("email")}
								className="flex items-center font-medium"
							>
								Email
								<SortIcon
									sortField={sortField}
									sortDirection={sortDirection}
									field="email"
								/>
							</button>
						</TableHead>
						<TableHead className="hidden md:table-cell">Phone</TableHead>
						<TableHead className="hidden lg:table-cell">
							<button
								type="button"
								onClick={() => handleSort("client_type")}
								className="flex items-center font-medium"
							>
								Type
								<SortIcon
									sortField={sortField}
									sortDirection={sortDirection}
									field="client_type"
								/>
							</button>
						</TableHead>
						<TableHead>Services</TableHead>
						<TableHead className="hidden md:table-cell">
							<button
								type="button"
								onClick={() => handleSort("source")}
								className="flex items-center font-medium"
							>
								Source
								<SortIcon
									sortField={sortField}
									sortDirection={sortDirection}
									field="source"
								/>
							</button>
						</TableHead>
						<TableHead className="hidden sm:table-cell">Docs</TableHead>
						<TableHead>
							<button
								type="button"
								onClick={() => handleSort("created_at")}
								className="flex items-center font-medium"
							>
								Submitted
								<SortIcon
									sortField={sortField}
									sortDirection={sortDirection}
									field="created_at"
								/>
							</button>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sorted.map((submission) => (
						<TableRow
							key={submission.id}
							className="cursor-pointer hover:bg-muted/50"
							onClick={() => onSelect(submission)}
						>
							<TableCell className="font-medium">
								{submission.first_name} {submission.last_name}
							</TableCell>
							<TableCell className="text-muted-foreground">
								{submission.email}
							</TableCell>
							<TableCell className="hidden text-muted-foreground md:table-cell">
								{submission.phone}
							</TableCell>
							<TableCell className="hidden lg:table-cell">
								<Badge variant="outline">{submission.client_type}</Badge>
							</TableCell>
							<TableCell>
								<div className="flex flex-wrap gap-1">
									{submission.services.slice(0, 2).map((service) => (
										<Badge
											key={service}
											variant="secondary"
											className="text-xs"
										>
											{service}
										</Badge>
									))}
									{submission.services.length > 2 && (
										<Badge variant="outline" className="text-xs">
											+{submission.services.length - 2}
										</Badge>
									)}
								</div>
							</TableCell>
							<TableCell className="hidden md:table-cell">
								<Badge variant={getSourceVariant(submission.source)}>
									{submission.source}
								</Badge>
							</TableCell>
							<TableCell className="hidden sm:table-cell">
								{submission.documents.length > 0 ? (
									<span className="flex items-center gap-1 text-muted-foreground text-sm">
										<FileText className="h-3 w-3" />
										{submission.documents.length}
									</span>
								) : (
									<span className="text-muted-foreground text-sm">-</span>
								)}
							</TableCell>
							<TableCell className="text-muted-foreground text-sm">
								{formatDate(submission.created_at)}
							</TableCell>
						</TableRow>
					))}
					{sorted.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={8}
								className="py-8 text-center text-muted-foreground"
							>
								No intake submissions found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
