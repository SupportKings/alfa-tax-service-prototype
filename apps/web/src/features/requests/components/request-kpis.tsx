"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { AlertCircle, CheckCircle2, Clock, Inbox } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import { mockRequests } from "../data/mock-data";

function computeKpis() {
	const openCount = mockRequests.filter(
		(r) => r.status !== "Resolved" && r.status !== "Won't Do",
	).length;

	const urgentCount = mockRequests.filter(
		(r) =>
			r.priority === "Urgent" &&
			r.status !== "Resolved" &&
			r.status !== "Won't Do",
	).length;

	const resolvedCount = mockRequests.filter(
		(r) => r.status === "Resolved",
	).length;

	const totalCount = mockRequests.length;

	return { openCount, urgentCount, resolvedCount, totalCount };
}

function computeStatusDistribution() {
	const statusColors: Record<string, string> = {
		New: "hsl(var(--chart-1))",
		Triaged: "hsl(var(--chart-2))",
		"In Progress": "hsl(var(--chart-3))",
		"Waiting on Client": "hsl(var(--chart-4))",
		"Won't Do": "hsl(var(--chart-5))",
		Resolved: "hsl(142 76% 36%)",
	};

	const statusCounts: Record<string, number> = {};
	for (const req of mockRequests) {
		statusCounts[req.status] = (statusCounts[req.status] || 0) + 1;
	}

	return Object.entries(statusCounts).map(([status, count]) => ({
		status,
		count,
		fill: statusColors[status] || "hsl(var(--chart-1))",
	}));
}

function computeWeeklyTrend() {
	const weekMap: Record<string, number> = {};

	for (const req of mockRequests) {
		const date = new Date(req.createdAt);

		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		// Use a simpler label based on month + week of month
		const weekOfMonth = Math.ceil(date.getDate() / 7);
		const simpleLabel = `${monthNames[date.getMonth()]} W${weekOfMonth}`;

		weekMap[simpleLabel] = (weekMap[simpleLabel] || 0) + 1;
	}

	// Sort chronologically
	const monthOrder = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	return Object.entries(weekMap)
		.map(([week, count]) => ({ week, count }))
		.sort((a, b) => {
			const aMonth = monthOrder.indexOf(a.week.split(" ")[0]);
			const bMonth = monthOrder.indexOf(b.week.split(" ")[0]);
			if (aMonth !== bMonth) return aMonth - bMonth;
			const aWeek = Number.parseInt(a.week.split("W")[1], 10);
			const bWeek = Number.parseInt(b.week.split("W")[1], 10);
			return aWeek - bWeek;
		});
}

const statusChartConfig: ChartConfig = {
	count: {
		label: "Requests",
	},
	New: {
		label: "New",
		color: "hsl(var(--chart-1))",
	},
	Triaged: {
		label: "Triaged",
		color: "hsl(var(--chart-2))",
	},
	"In Progress": {
		label: "In Progress",
		color: "hsl(var(--chart-3))",
	},
	"Waiting on Client": {
		label: "Waiting on Client",
		color: "hsl(var(--chart-4))",
	},
	"Won't Do": {
		label: "Won't Do",
		color: "hsl(var(--chart-5))",
	},
	Resolved: {
		label: "Resolved",
		color: "hsl(142 76% 36%)",
	},
};

const trendChartConfig: ChartConfig = {
	count: {
		label: "New Requests",
		color: "hsl(var(--chart-1))",
	},
};

export default function RequestKpis() {
	const { openCount, urgentCount, resolvedCount, totalCount } = computeKpis();
	const statusData = computeStatusDistribution();
	const trendData = computeWeeklyTrend();

	return (
		<div className="space-y-4">
			{/* KPI Cards Row */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<Card>
					<CardContent className="flex items-center gap-3 pt-6">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
							<Inbox className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<p className="font-medium text-muted-foreground text-xs">
								Open Requests
							</p>
							<p className="font-bold text-2xl">{openCount}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-3 pt-6">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/50">
							<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
						</div>
						<div>
							<p className="font-medium text-muted-foreground text-xs">
								Urgent (Open)
							</p>
							<p className="font-bold text-2xl">{urgentCount}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-3 pt-6">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50">
							<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<p className="font-medium text-muted-foreground text-xs">
								Resolved
							</p>
							<p className="font-bold text-2xl">{resolvedCount}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-3 pt-6">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-950/50">
							<Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
						</div>
						<div>
							<p className="font-medium text-muted-foreground text-xs">
								Total Requests
							</p>
							<p className="font-bold text-2xl">{totalCount}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{/* Status Breakdown Bar Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Request Status Breakdown</CardTitle>
						<CardDescription className="text-xs">
							Distribution across all request statuses
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={statusChartConfig}
							className="h-[220px] w-full"
						>
							<BarChart data={statusData} layout="vertical">
								<CartesianGrid horizontal={false} />
								<YAxis
									dataKey="status"
									type="category"
									tickLine={false}
									axisLine={false}
									width={110}
									tick={{ fontSize: 11 }}
								/>
								<XAxis type="number" tickLine={false} axisLine={false} />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Bar dataKey="count" radius={[0, 4, 4, 0]} />
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Requests Over Time Line Chart */}
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">
							Requests Received Over Time
						</CardTitle>
						<CardDescription className="text-xs">
							New requests per week - tax season spike Jan-Apr
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={trendChartConfig}
							className="h-[220px] w-full"
						>
							<LineChart data={trendData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="week"
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 10 }}
									interval={0}
									angle={-45}
									textAnchor="end"
									height={50}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent />}
								/>
								<Line
									type="monotone"
									dataKey="count"
									stroke="var(--color-count)"
									strokeWidth={2}
									dot={{ r: 4 }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
