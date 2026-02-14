"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { AlertTriangle, Briefcase, MapPin, UsersRound } from "lucide-react";
import type { TeamMember } from "../types";

interface TeamMemberKpisProps {
	members: TeamMember[];
}

export default function TeamMemberKpis({ members }: TeamMemberKpisProps) {
	const activeCount = members.filter((m) => m.status === "Active").length;
	const inOfficeCount = members.filter(
		(m) => m.location === "In-Office",
	).length;
	const remoteCount = members.filter((m) => m.location === "Remote").length;

	const totalWorkItems = members.reduce((sum, m) => {
		return (
			sum +
			m.workload.taxReturnsInProgress +
			m.workload.advisoryEngagements +
			m.workload.formationsInProgress +
			m.workload.openRequests
		);
	}, 0);

	// Find the busiest member
	const busiestMember = members.reduce(
		(busiest, m) => {
			const items =
				m.workload.taxReturnsInProgress +
				m.workload.advisoryEngagements +
				m.workload.formationsInProgress +
				m.workload.openRequests;
			return items > busiest.count ? { name: m.name, count: items } : busiest;
		},
		{ name: "", count: 0 },
	);

	// Department breakdown
	const departments = members.reduce(
		(acc, m) => {
			acc[m.department] = (acc[m.department] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{/* KPI 1: Total Team Size */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<UsersRound className="h-4 w-4" />
						Team Size
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{members.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
						<span className="text-green-600">{activeCount} Active</span>
						{members.length - activeCount > 0 && (
							<span className="text-yellow-600">
								{members.length - activeCount} Other
							</span>
						)}
					</div>
				</CardContent>
			</Card>

			{/* KPI 2: Location Distribution */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<MapPin className="h-4 w-4" />
						Location Distribution
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{inOfficeCount}/{members.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
						<span className="text-green-600">{inOfficeCount} In-Office</span>
						<span className="text-blue-600">{remoteCount} Remote</span>
					</div>
				</CardContent>
			</Card>

			{/* KPI 3: Total Workload */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<Briefcase className="h-4 w-4" />
						Total Active Work Items
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{totalWorkItems}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
						{Object.entries(departments).map(([dept, count]) => (
							<span key={dept} className="text-muted-foreground">
								{dept}: {count}
							</span>
						))}
					</div>
				</CardContent>
			</Card>

			{/* KPI 4: Bottleneck Alert */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<AlertTriangle className="h-4 w-4" />
						Highest Workload
					</CardDescription>
					<CardTitle className="text-xl tabular-nums">
						{busiestMember.name}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-xs">
						{busiestMember.count} active work items — potential bottleneck
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
