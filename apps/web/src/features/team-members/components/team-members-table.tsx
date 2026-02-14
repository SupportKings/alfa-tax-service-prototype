"use client";

import { useMemo, useState } from "react";

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
	Award,
	ChevronDown,
	ChevronUp,
	Globe,
	MapPin,
	Monitor,
} from "lucide-react";
import type { TeamMember } from "../types";

type SortField =
	| "name"
	| "role"
	| "department"
	| "status"
	| "location"
	| "workload";
type SortDirection = "asc" | "desc";

interface TeamMembersTableProps {
	members: TeamMember[];
}

function getLocationIcon(location: string) {
	switch (location) {
		case "In-Office":
			return <MapPin className="h-3.5 w-3.5" />;
		case "Remote":
			return <Globe className="h-3.5 w-3.5" />;
		case "Hybrid":
			return <Monitor className="h-3.5 w-3.5" />;
		default:
			return null;
	}
}

function getLocationColor(location: string) {
	switch (location) {
		case "In-Office":
			return "text-green-600 dark:text-green-400";
		case "Remote":
			return "text-blue-600 dark:text-blue-400";
		case "Hybrid":
			return "text-purple-600 dark:text-purple-400";
		default:
			return "text-muted-foreground";
	}
}

function getTotalWorkItems(member: TeamMember): number {
	return (
		member.workload.taxReturnsInProgress +
		member.workload.advisoryEngagements +
		member.workload.formationsInProgress +
		member.workload.openRequests
	);
}

function getWorkloadColor(items: number): string {
	if (items >= 15) return "text-red-600 dark:text-red-400";
	if (items >= 8) return "text-yellow-600 dark:text-yellow-400";
	return "text-green-600 dark:text-green-400";
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
	if (sortField !== field)
		return <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-50" />;
	return sortDirection === "asc" ? (
		<ChevronUp className="h-3 w-3" />
	) : (
		<ChevronDown className="h-3 w-3" />
	);
}

function SortableHeader({
	field,
	sortField,
	sortDirection,
	onSort,
	children,
}: {
	field: SortField;
	sortField: SortField;
	sortDirection: SortDirection;
	onSort: (field: SortField) => void;
	children: React.ReactNode;
}) {
	return (
		<TableHead
			className="group cursor-pointer select-none text-xs"
			onClick={() => onSort(field)}
		>
			<div className="flex items-center gap-1">
				{children}
				<SortIcon
					field={field}
					sortField={sortField}
					sortDirection={sortDirection}
				/>
			</div>
		</TableHead>
	);
}

export default function TeamMembersTable({ members }: TeamMembersTableProps) {
	const [sortField, setSortField] = useState<SortField>("name");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const sortedMembers = useMemo(() => {
		return [...members].sort((a, b) => {
			const multiplier = sortDirection === "asc" ? 1 : -1;
			switch (sortField) {
				case "name":
					return a.name.localeCompare(b.name) * multiplier;
				case "role":
					return a.role.localeCompare(b.role) * multiplier;
				case "department":
					return a.department.localeCompare(b.department) * multiplier;
				case "status":
					return a.status.localeCompare(b.status) * multiplier;
				case "location":
					return a.location.localeCompare(b.location) * multiplier;
				case "workload":
					return (getTotalWorkItems(a) - getTotalWorkItems(b)) * multiplier;
				default:
					return 0;
			}
		});
	}, [members, sortField, sortDirection]);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<SortableHeader
							field="name"
							sortField={sortField}
							sortDirection={sortDirection}
							onSort={handleSort}
						>
							Name
						</SortableHeader>
						<SortableHeader
							field="role"
							sortField={sortField}
							sortDirection={sortDirection}
							onSort={handleSort}
						>
							Role
						</SortableHeader>
						<SortableHeader
							field="department"
							sortField={sortField}
							sortDirection={sortDirection}
							onSort={handleSort}
						>
							Department
						</SortableHeader>
						<SortableHeader
							field="status"
							sortField={sortField}
							sortDirection={sortDirection}
							onSort={handleSort}
						>
							Status
						</SortableHeader>
						<SortableHeader
							field="location"
							sortField={sortField}
							sortDirection={sortDirection}
							onSort={handleSort}
						>
							Location
						</SortableHeader>
						<TableHead className="text-xs">Languages</TableHead>
						<TableHead className="text-xs">Certifications</TableHead>
						<SortableHeader
							field="workload"
							sortField={sortField}
							sortDirection={sortDirection}
							onSort={handleSort}
						>
							Workload
						</SortableHeader>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedMembers.map((member) => {
						const totalItems = getTotalWorkItems(member);
						return (
							<TableRow key={member.id}>
								{/* Name & Email */}
								<TableCell>
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs">
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
										<div>
											<div className="font-medium text-sm">{member.name}</div>
											<div className="text-muted-foreground text-xs">
												{member.email}
											</div>
										</div>
									</div>
								</TableCell>

								{/* Role */}
								<TableCell className="text-sm">{member.role}</TableCell>

								{/* Department */}
								<TableCell className="text-sm">{member.department}</TableCell>

								{/* Status */}
								<TableCell>
									<StatusBadge>{member.status}</StatusBadge>
								</TableCell>

								{/* Location */}
								<TableCell>
									<div
										className={`flex items-center gap-1.5 text-sm ${getLocationColor(member.location)}`}
									>
										{getLocationIcon(member.location)}
										{member.location}
									</div>
								</TableCell>

								{/* Languages */}
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{member.languages.map((lang) => (
											<span
												key={lang}
												className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px]"
											>
												{lang}
											</span>
										))}
									</div>
								</TableCell>

								{/* Certifications */}
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{member.certifications.length > 0 ? (
											member.certifications.map((cert) => (
												<span
													key={cert}
													className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
												>
													<Award className="h-3 w-3" />
													{cert}
												</span>
											))
										) : (
											<span className="text-muted-foreground text-xs">—</span>
										)}
									</div>
								</TableCell>

								{/* Workload */}
								<TableCell>
									<div className="space-y-1">
										<div
											className={`font-semibold text-sm ${getWorkloadColor(totalItems)}`}
										>
											{totalItems} items
										</div>
										<div className="flex flex-wrap gap-x-2 text-[10px] text-muted-foreground">
											{member.workload.taxReturnsInProgress > 0 && (
												<span>{member.workload.taxReturnsInProgress} tax</span>
											)}
											{member.workload.advisoryEngagements > 0 && (
												<span>
													{member.workload.advisoryEngagements} advisory
												</span>
											)}
											{member.workload.formationsInProgress > 0 && (
												<span>
													{member.workload.formationsInProgress} formations
												</span>
											)}
											{member.workload.openRequests > 0 && (
												<span>{member.workload.openRequests} requests</span>
											)}
										</div>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
