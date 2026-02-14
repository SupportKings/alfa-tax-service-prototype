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

import { Crown, FileText } from "lucide-react";
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

const pendingKathyCount = taxReturns.filter((r) => r.pendingKathyReview).length;

const complexityDistribution = {
	simple: taxReturns.filter((r) => r.complexity === "Simple").length,
	standard: taxReturns.filter((r) => r.complexity === "Standard").length,
	complex: taxReturns.filter((r) => r.complexity === "Complex").length,
};

const pipelineChartConfig: ChartConfig = {
	count: {
		label: "Returns",
		color: "var(--chart-1)",
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
		<div className="space-y-4">
			{/* Top row: Key metrics */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{/* Returns In Progress */}
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

				{/* Pending Owner Review */}
				<Card className="border-amber-200 py-4 dark:border-amber-800">
					<CardHeader className="pb-2">
						<CardDescription className="text-xs">
							Pending Owner Review
						</CardDescription>
						<CardTitle className="flex items-baseline gap-2 text-3xl tabular-nums">
							{pendingKathyCount}
							<span className="font-normal text-muted-foreground text-sm">
								Returns
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2 text-amber-600 text-xs dark:text-amber-400">
							<Crown className="h-3.5 w-3.5" />
							<span>Awaiting Kathy&apos;s review</span>
						</div>
					</CardContent>
				</Card>

				{/* Complexity Distribution */}
				<Card className="py-4">
					<CardHeader className="pb-2">
						<CardDescription className="text-xs">
							Complexity Breakdown
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-2.5 w-2.5 rounded-full bg-green-500" />
									<span className="text-xs">Simple</span>
								</div>
								<span className="font-medium text-xs tabular-nums">
									{complexityDistribution.simple}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
									<span className="text-xs">Standard</span>
								</div>
								<span className="font-medium text-xs tabular-nums">
									{complexityDistribution.standard}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-2.5 w-2.5 rounded-full bg-red-500" />
									<span className="text-xs">Complex</span>
								</div>
								<span className="font-medium text-xs tabular-nums">
									{complexityDistribution.complex}
								</span>
							</div>
						</div>
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
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent />}
								/>
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

			{/* Pipeline Stage Distribution - Full Width */}
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
								fill="var(--chart-1)"
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
