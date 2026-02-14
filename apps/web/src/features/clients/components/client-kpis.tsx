"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { Award, TrendingUp, UserCheck, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { Client, MonthlyTrendData } from "../types";

interface ClientKpisProps {
	clients: Client[];
	trendData: MonthlyTrendData[];
}

export default function ClientKpis({ clients, trendData }: ClientKpisProps) {
	const prospectsCount = clients.filter(
		(c) => c.status === "New Lead" || c.status === "Prospect",
	).length;

	const statusBreakdown = {
		active: clients.filter((c) => c.status === "Active").length,
		onHold: clients.filter((c) => c.status === "On Hold").length,
		churned: clients.filter((c) => c.status === "Churned").length,
		newLead: clients.filter((c) => c.status === "New Lead").length,
		prospect: clients.filter((c) => c.status === "Prospect").length,
	};

	const qualityDistribution = {
		excellent: clients.filter((c) => c.qualityScore === "excellent").length,
		good: clients.filter((c) => c.qualityScore === "good").length,
		fair: clients.filter((c) => c.qualityScore === "fair").length,
		poor: clients.filter((c) => c.qualityScore === "poor").length,
	};

	const chartConfig = {
		count: {
			label: "New Clients",
			color: "var(--chart-1)",
		},
	};

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{/* KPI 1: Prospects Pending Conversion */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<UserCheck className="h-4 w-4" />
						Prospects Pending Conversion
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{prospectsCount}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-xs">
						{statusBreakdown.newLead} new leads, {statusBreakdown.prospect}{" "}
						prospects
					</p>
				</CardContent>
			</Card>

			{/* KPI 2: Client Status Breakdown */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<Users className="h-4 w-4" />
						Client Status Breakdown
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{clients.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
						<span className="text-green-600">
							{statusBreakdown.active} Active
						</span>
						<span className="text-yellow-600">
							{statusBreakdown.onHold} On Hold
						</span>
						<span className="text-red-600">
							{statusBreakdown.churned} Churned
						</span>
						<span className="text-orange-600">
							{statusBreakdown.newLead + statusBreakdown.prospect} Pipeline
						</span>
					</div>
				</CardContent>
			</Card>

			{/* KPI 3: New Clients Over Time */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<TrendingUp className="h-4 w-4" />
						New Clients Over Time
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="h-[80px] w-full">
						<LineChart
							data={trendData}
							margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
						>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis
								dataKey="month"
								tick={{ fontSize: 10 }}
								tickLine={false}
								axisLine={false}
								interval="preserveStartEnd"
							/>
							<YAxis hide domain={[0, "auto"]} />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="count"
								stroke="var(--color-count)"
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* KPI 4: Client Quality Distribution */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<Award className="h-4 w-4" />
						Client Quality Distribution
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{clients.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
						<span className="text-green-600">
							{qualityDistribution.excellent} Excellent
						</span>
						<span className="text-blue-600">
							{qualityDistribution.good} Good
						</span>
						<span className="text-yellow-600">
							{qualityDistribution.fair} Fair
						</span>
						<span className="text-red-600">
							{qualityDistribution.poor} Poor
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
