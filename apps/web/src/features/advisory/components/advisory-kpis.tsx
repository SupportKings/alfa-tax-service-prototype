"use client";

import { useMemo } from "react";

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

import { Briefcase } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import type { AdvisoryEngagement, AdvisoryQuarterlyRevenue } from "../types";

interface AdvisoryKpisProps {
	engagements: AdvisoryEngagement[];
	quarterlyRevenue: AdvisoryQuarterlyRevenue[];
}

const stageChartConfig = {
	count: {
		label: "Engagements",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

const revenueChartConfig = {
	revenue: {
		label: "Revenue",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

function formatCurrency(amount: number): string {
	if (amount >= 1000) {
		return `$${(amount / 1000).toFixed(0)}K`;
	}
	return `$${amount}`;
}

export default function AdvisoryKpis({
	engagements,
	quarterlyRevenue,
}: AdvisoryKpisProps) {
	const activeCount = useMemo(
		() => engagements.filter((e) => e.status !== "Complete").length,
		[engagements],
	);

	const stageDistribution = useMemo(() => {
		const distribution: Record<string, number> = {};
		for (const e of engagements) {
			distribution[e.status] = (distribution[e.status] || 0) + 1;
		}
		return Object.entries(distribution)
			.map(([stage, count]) => ({ stage, count }))
			.sort((a, b) => b.count - a.count);
	}, [engagements]);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			{/* Active Engagements KPI */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription>Active Engagements</CardDescription>
					<CardTitle className="flex items-baseline gap-2 text-3xl">
						{activeCount}
						<span className="font-normal text-muted-foreground text-sm">
							of {engagements.length} total
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<Briefcase className="h-3.5 w-3.5" />
						<span>Engagements not yet complete</span>
					</div>
				</CardContent>
			</Card>

			{/* Stage Distribution Bar Chart */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription>Engagement Stage Distribution</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={stageChartConfig}
						className="h-[160px] w-full"
					>
						<BarChart
							data={stageDistribution}
							layout="vertical"
							margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
						>
							<CartesianGrid horizontal={false} />
							<YAxis
								dataKey="stage"
								type="category"
								tickLine={false}
								axisLine={false}
								width={100}
								tick={{ fontSize: 10 }}
							/>
							<XAxis
								type="number"
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 10 }}
							/>
							<ChartTooltip content={<ChartTooltipContent hideLabel />} />
							<Bar
								dataKey="count"
								fill="var(--color-count)"
								radius={[0, 4, 4, 0]}
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Revenue Over Time Line Chart */}
			<Card>
				<CardHeader className="pb-2">
					<CardDescription>Advisory Revenue Over Time</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={revenueChartConfig}
						className="h-[160px] w-full"
					>
						<LineChart
							data={quarterlyRevenue}
							margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="quarter"
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 10 }}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickFormatter={formatCurrency}
								tick={{ fontSize: 10 }}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										formatter={(value) => `$${Number(value).toLocaleString()}`}
									/>
								}
							/>
							<Line
								type="monotone"
								dataKey="revenue"
								stroke="var(--color-revenue)"
								strokeWidth={2}
								dot={{ r: 4 }}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
