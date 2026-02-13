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

import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import type { MonthlyRevenueData, StatusDistributionData } from "../types";

interface SubscriptionKpisProps {
	behindCount: number;
	totalActiveRevenue: number;
	statusDistribution: StatusDistributionData[];
	monthlyRevenue: MonthlyRevenueData[];
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
}

export default function SubscriptionKpis({
	behindCount,
	totalActiveRevenue,
	statusDistribution,
	monthlyRevenue,
}: SubscriptionKpisProps) {
	const statusChartConfig = {
		count: {
			label: "Subscriptions",
		},
		"Active - Current": {
			label: "Active - Current",
			color: "hsl(142, 71%, 45%)",
		},
		"Active - Behind": {
			label: "Active - Behind",
			color: "hsl(0, 84%, 60%)",
		},
		"Pending Setup": {
			label: "Pending Setup",
			color: "hsl(217, 91%, 60%)",
		},
		Paused: {
			label: "Paused",
			color: "hsl(45, 93%, 47%)",
		},
		Cancelled: {
			label: "Cancelled",
			color: "hsl(0, 0%, 60%)",
		},
		Completed: {
			label: "Completed",
			color: "hsl(0, 0%, 45%)",
		},
	};

	const revenueChartConfig = {
		revenue: {
			label: "Revenue",
			color: "hsl(217, 91%, 60%)",
		},
	};

	return (
		<div className="space-y-4">
			{/* Top Row: Alert KPI + Monthly Revenue Summary */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{/* Services Behind Schedule - Critical Alert KPI */}
				<Card
					className={
						behindCount > 0 ? "border-destructive/50 bg-destructive/5" : ""
					}
				>
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-1.5 text-xs">
							<AlertTriangle
								className={`h-3.5 w-3.5 ${behindCount > 0 ? "text-destructive" : "text-muted-foreground"}`}
							/>
							Services Behind Schedule
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline gap-2">
							<span
								className={`font-bold text-4xl tabular-nums ${behindCount > 0 ? "text-destructive" : "text-foreground"}`}
							>
								{behindCount}
							</span>
							{behindCount > 0 && (
								<span className="font-medium text-destructive text-sm">
									Need attention
								</span>
							)}
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							{behindCount > 0
								? "Clients with overdue deliverables or payments"
								: "All services are on track"}
						</p>
					</CardContent>
				</Card>

				{/* Monthly Recurring Revenue */}
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-1.5 text-xs">
							<DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
							Est. Monthly Revenue
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline gap-2">
							<span className="font-bold text-4xl tabular-nums">
								{formatCurrency(totalActiveRevenue)}
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							From active recurring subscriptions
						</p>
					</CardContent>
				</Card>

				{/* Total Active Subscriptions */}
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="flex items-center gap-1.5 text-xs">
							<TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
							Active Subscriptions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline gap-2">
							<span className="font-bold text-4xl tabular-nums">
								{statusDistribution
									.filter(
										(s) =>
											s.status === "Active - Current" ||
											s.status === "Active - Behind",
									)
									.reduce((sum, s) => sum + s.count, 0)}
							</span>
							<span className="text-muted-foreground text-sm">
								of {statusDistribution.reduce((sum, s) => sum + s.count, 0)}{" "}
								total
							</span>
						</div>
						<p className="mt-1 text-muted-foreground text-xs">
							Currently active service agreements
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{/* Service Health Overview - Bar Chart */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Service Health Overview</CardTitle>
						<CardDescription className="text-xs">
							Distribution by subscription status
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={statusChartConfig}
							className="aspect-[2/1] w-full"
						>
							<BarChart
								data={statusDistribution}
								layout="vertical"
								margin={{
									left: 0,
									right: 16,
									top: 0,
									bottom: 0,
								}}
							>
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
								<ChartTooltip content={<ChartTooltipContent />} />
								<Bar
									dataKey="count"
									radius={[0, 4, 4, 0]}
									fill="hsl(217, 91%, 60%)"
									barSize={20}
								/>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Recurring Revenue Over Time - Line Chart */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">
							Recurring Revenue Over Time
						</CardTitle>
						<CardDescription className="text-xs">
							Monthly active subscription revenue
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={revenueChartConfig}
							className="aspect-[2/1] w-full"
						>
							<LineChart
								data={monthlyRevenue}
								margin={{
									left: 0,
									right: 16,
									top: 8,
									bottom: 0,
								}}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="month"
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 10 }}
									interval={2}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
								/>
								<ChartTooltip
									content={
										<ChartTooltipContent
											formatter={(value) => formatCurrency(value as number)}
										/>
									}
								/>
								<Line
									type="monotone"
									dataKey="revenue"
									stroke="var(--color-revenue)"
									strokeWidth={2}
									dot={{ r: 3 }}
									activeDot={{ r: 5 }}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
