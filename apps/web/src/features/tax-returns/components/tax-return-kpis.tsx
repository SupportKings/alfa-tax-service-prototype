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

import { FileText } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import {
	completionTrendData,
	statusDistributionData,
	taxReturns,
} from "../data/mock-data";

const inProgressCount = taxReturns.filter(
	(r) => r.status !== "Complete",
).length;

const pipelineChartConfig: ChartConfig = {
	count: {
		label: "Returns",
		color: "hsl(var(--chart-1))",
	},
};

const trendChartConfig: ChartConfig = {
	completed: {
		label: "Completed",
		color: "hsl(142 71% 45%)",
	},
};

export default function TaxReturnKpis() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			{/* Single Value KPI */}
			<Card className="py-4">
				<CardHeader className="pb-2">
					<CardDescription className="text-xs">
						Returns In Progress
					</CardDescription>
					<CardTitle className="flex items-baseline gap-2 text-3xl tabular-nums">
						{inProgressCount}
						<span className="font-normal text-muted-foreground text-sm">
							of {taxReturns.length}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<FileText className="h-3.5 w-3.5" />
						<span>Not yet at Complete status</span>
					</div>
				</CardContent>
			</Card>

			{/* Pipeline Stage Distribution - Bar Chart */}
			<Card className="py-4">
				<CardHeader className="pb-2">
					<CardDescription className="text-xs">
						Pipeline Stage Distribution
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={pipelineChartConfig}
						className="h-[140px] w-full"
					>
						<BarChart
							data={statusDistributionData}
							layout="vertical"
							margin={{ left: 0, right: 12, top: 0, bottom: 0 }}
						>
							<CartesianGrid horizontal={false} />
							<YAxis
								dataKey="status"
								type="category"
								tickLine={false}
								axisLine={false}
								width={90}
								tick={{ fontSize: 10 }}
							/>
							<XAxis type="number" hide />
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Bar
								dataKey="count"
								radius={[0, 4, 4, 0]}
								fill="hsl(var(--chart-1))"
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* Completion Trend - Line Chart */}
			<Card className="py-4">
				<CardHeader className="pb-2">
					<CardDescription className="text-xs">
						Returns Completed Over Time
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={trendChartConfig}
						className="h-[140px] w-full"
					>
						<LineChart
							data={completionTrendData}
							margin={{ left: 12, right: 12, top: 8, bottom: 0 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="week"
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 10 }}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 10 }}
							/>
							<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="completed"
								stroke="hsl(142 71% 45%)"
								strokeWidth={2}
								dot={{ r: 3, fill: "hsl(142 71% 45%)" }}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
