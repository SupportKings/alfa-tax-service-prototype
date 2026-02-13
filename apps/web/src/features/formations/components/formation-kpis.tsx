"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { Building2, Clock, FileCheck, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { mockFormations } from "../data/mock-data";

function computeKpiData() {
	const inProgress = mockFormations.filter(
		(f) => f.status !== "Complete",
	).length;
	const complete = mockFormations.filter((f) => f.status === "Complete").length;
	const totalRevenue = mockFormations.length * 500;

	// Days in each stage (simulated averages)
	const daysInStage = [
		{ stage: "Info Gathering", days: 5 },
		{ stage: "Name Search", days: 7 },
		{ stage: "Name Approved", days: 3 },
		{ stage: "State Filing", days: 12 },
		{ stage: "Awaiting EIN", days: 8 },
		{ stage: "Awaiting State Tax ID", days: 15 },
	];

	// Count by entity type
	const entityCounts: Record<string, number> = {};
	for (const f of mockFormations) {
		entityCounts[f.entityType] = (entityCounts[f.entityType] || 0) + 1;
	}
	const entityTypeData = Object.entries(entityCounts)
		.map(([type, count]) => ({ type, count }))
		.sort((a, b) => b.count - a.count);

	// Count by status
	const statusCounts: Record<string, number> = {};
	for (const f of mockFormations) {
		statusCounts[f.status] = (statusCounts[f.status] || 0) + 1;
	}

	return {
		inProgress,
		complete,
		totalRevenue,
		daysInStage,
		entityTypeData,
		statusCounts,
	};
}

const daysChartConfig: ChartConfig = {
	days: {
		label: "Avg Days",
		color: "hsl(221, 83%, 53%)",
	},
};

const entityChartConfig: ChartConfig = {
	count: {
		label: "Count",
		color: "hsl(262, 83%, 58%)",
	},
};

export default function FormationKpis() {
	const { inProgress, complete, totalRevenue, daysInStage, entityTypeData } =
		computeKpiData();

	return (
		<div className="space-y-6">
			{/* Summary KPI Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="pt-0">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
								<Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							</div>
							<div>
								<p className="text-muted-foreground text-sm">In Progress</p>
								<p className="font-bold text-2xl">{inProgress}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-0">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50">
								<FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Completed</p>
								<p className="font-bold text-2xl">{complete}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-0">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/50">
								<Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<p className="text-muted-foreground text-sm">
									Total Formations
								</p>
								<p className="font-bold text-2xl">{mockFormations.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-0">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/50">
								<TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Total Revenue</p>
								<p className="font-bold text-2xl">
									${totalRevenue.toLocaleString()}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Days in Each Stage */}
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Days in Each Stage</CardTitle>
						<CardDescription>
							Average days formations spend in each workflow stage
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={daysChartConfig}
							className="h-[280px] w-full"
						>
							<BarChart
								data={daysInStage}
								layout="vertical"
								margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
							>
								<CartesianGrid horizontal={false} />
								<YAxis
									dataKey="stage"
									type="category"
									tickLine={false}
									axisLine={false}
									width={120}
									tick={{ fontSize: 11 }}
								/>
								<XAxis type="number" hide />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Bar
									dataKey="days"
									fill="var(--color-days)"
									radius={[0, 4, 4, 0]}
								/>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Formations by Entity Type */}
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Formations by Entity Type</CardTitle>
						<CardDescription>
							Distribution of formations across entity types
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={entityChartConfig}
							className="h-[280px] w-full"
						>
							<BarChart
								data={entityTypeData}
								margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="type"
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 11 }}
								/>
								<YAxis tickLine={false} axisLine={false} />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Bar
									dataKey="count"
									fill="var(--color-count)"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
