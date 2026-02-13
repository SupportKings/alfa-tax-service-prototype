"use client";

import { Link } from "@/components/fastLink";
import { Badge } from "@/components/ui/badge";
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
import { StatusBadge } from "@/components/ui/status-badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
	Briefcase,
	Check,
	DollarSign,
	FileText,
	Minus,
	StickyNote,
	Users,
} from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import { engagementDurationData, revenueByTypeData } from "../data/mock-data";
import type { AdvisoryEngagement } from "../types";

interface AdvisoryDetailViewProps {
	engagement: AdvisoryEngagement;
}

const durationChartConfig = {
	avgDays: {
		label: "Avg Days",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

const revenueTypeChartConfig = {
	revenue: {
		label: "Revenue",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatShortCurrency(amount: number): string {
	if (amount >= 1000) {
		return `$${(amount / 1000).toFixed(0)}K`;
	}
	return `$${amount}`;
}

function getStatusColor(
	status: string,
): "green" | "blue" | "yellow" | "gray" | "orange" | "purple" {
	switch (status) {
		case "Complete":
			return "green";
		case "Implementation":
		case "Presentation Complete":
			return "blue";
		case "Analysis":
		case "Presentation Scheduled":
		case "Documents Gathering":
			return "blue";
		case "Signed":
			return "purple";
		case "Proposal Sent":
		case "Discovery Call":
			return "yellow";
		case "Inquiry":
			return "gray";
		default:
			return "gray";
	}
}

export default function AdvisoryDetailView({
	engagement,
}: AdvisoryDetailViewProps) {
	return (
		<div className="space-y-6 p-6">
			{/* Top section: Engagement Details + Pricing & Billing */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Engagement Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Briefcase className="h-5 w-5" />
							Engagement Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="font-medium text-muted-foreground text-sm">
								Engagement #
							</span>
							<p className="font-mono text-sm">
								{engagement.engagement_number}
							</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-sm">
								Client
							</span>
							<p className="text-sm">
								<Link
									href={`/dashboard/clients/${engagement.client_id}`}
									className="text-primary underline-offset-4 hover:underline"
								>
									{engagement.client_name}
								</Link>
							</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-sm">
								Engagement Type
							</span>
							<p className="text-sm">{engagement.engagement_type}</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-sm">
								Status
							</span>
							<div className="mt-1">
								<StatusBadge colorScheme={getStatusColor(engagement.status)}>
									{engagement.status}
								</StatusBadge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Pricing & Billing */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<DollarSign className="h-5 w-5" />
							Pricing & Billing
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="font-medium text-muted-foreground text-sm">
								Fee
							</span>
							<p className="font-semibold text-lg">
								{engagement.amount > 0
									? formatCurrency(engagement.amount)
									: "TBD"}
							</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-sm">
								Billing Type
							</span>
							<div className="mt-1">
								<Badge variant="secondary">{engagement.billing_type}</Badge>
							</div>
						</div>
						{engagement.hourly_rate !== null && (
							<div>
								<span className="font-medium text-muted-foreground text-sm">
									Hourly Rate
								</span>
								<p className="text-sm">
									{formatCurrency(engagement.hourly_rate)}/hr
								</p>
							</div>
						)}
						<div>
							<span className="font-medium text-muted-foreground text-sm">
								Implementation Offered?
							</span>
							<div className="mt-1 flex items-center gap-2">
								{engagement.implementation_offered ? (
									<>
										<Check className="h-4 w-4 text-green-600" />
										<span className="text-sm">Yes</span>
									</>
								) : (
									<>
										<Minus className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground text-sm">No</span>
									</>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Internal Notes */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<StickyNote className="h-5 w-5" />
						Internal Notes
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="whitespace-pre-wrap text-sm leading-relaxed">
						{engagement.internal_notes || "No internal notes recorded."}
					</p>
				</CardContent>
			</Card>

			{/* Metrics Section */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Engagement Duration Trend */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">
							Engagement Duration (Days)
						</CardTitle>
						<CardDescription>
							Average days to complete by engagement type
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={durationChartConfig}
							className="h-[200px] w-full"
						>
							<LineChart
								data={engagementDurationData}
								margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="type"
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 10 }}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 10 }}
									label={{
										value: "Days",
										angle: -90,
										position: "insideLeft",
										style: { fontSize: 10 },
									}}
								/>
								<ChartTooltip
									content={
										<ChartTooltipContent
											formatter={(value) => `${value} days`}
										/>
									}
								/>
								<Line
									type="monotone"
									dataKey="avgDays"
									stroke="var(--color-avgDays)"
									strokeWidth={2}
									dot={{ r: 4 }}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Revenue by Engagement Type */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">
							Revenue by Engagement Type
						</CardTitle>
						<CardDescription>Total revenue breakdown by type</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={revenueTypeChartConfig}
							className="h-[200px] w-full"
						>
							<BarChart
								data={revenueByTypeData}
								margin={{ left: 8, right: 16, top: 8, bottom: 0 }}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="type"
									tickLine={false}
									axisLine={false}
									tick={{ fontSize: 10 }}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickFormatter={formatShortCurrency}
									tick={{ fontSize: 10 }}
								/>
								<ChartTooltip
									content={
										<ChartTooltipContent
											formatter={(value) =>
												`$${Number(value).toLocaleString()}`
											}
										/>
									}
								/>
								<Bar
									dataKey="revenue"
									fill="var(--color-revenue)"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			{/* Child Tabs: Documents + Team */}
			<Tabs defaultValue="documents">
				<TabsList>
					<TabsTrigger value="documents" className="gap-1.5">
						<FileText className="h-4 w-4" />
						Documents ({engagement.documents.length})
					</TabsTrigger>
					<TabsTrigger value="team" className="gap-1.5">
						<Users className="h-4 w-4" />
						Team ({engagement.assignments.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="documents">
					<Card>
						<CardContent className="pt-6">
							{engagement.documents.length === 0 ? (
								<p className="py-8 text-center text-muted-foreground text-sm">
									No documents have been added to this engagement yet.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Document Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>File</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{engagement.documents.map((doc) => (
											<TableRow key={doc.id}>
												<TableCell className="font-medium">
													{doc.document_type}
												</TableCell>
												<TableCell>
													<StatusBadge>{doc.status}</StatusBadge>
												</TableCell>
												<TableCell>
													{doc.file_url ? (
														<a
															href={doc.file_url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-primary text-sm underline-offset-4 hover:underline"
														>
															View Document
														</a>
													) : (
														<span className="text-muted-foreground text-sm">
															Not uploaded
														</span>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="team">
					<Card>
						<CardContent className="pt-6">
							{engagement.assignments.length === 0 ? (
								<p className="py-8 text-center text-muted-foreground text-sm">
									No team members have been assigned to this engagement yet.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Team Member</TableHead>
											<TableHead>Title</TableHead>
											<TableHead>Role</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{engagement.assignments.map((assignment) => (
											<TableRow key={assignment.id}>
												<TableCell className="font-medium">
													{assignment.team_member_name}
												</TableCell>
												<TableCell className="text-muted-foreground">
													{assignment.team_member_title}
												</TableCell>
												<TableCell>
													<Badge variant="outline">{assignment.role}</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
