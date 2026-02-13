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
import type { ChartConfig } from "@/components/ui/chart";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
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
	CalendarDays,
	CheckCircle2,
	Clock,
	DollarSign,
	ExternalLink,
	FileCheck,
	FileText,
	Mail,
	Phone,
	Shield,
	ShieldCheck,
	User,
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
import { daysInStatusData, documentCompletionData } from "../data/mock-data";
import type { DocumentStatus, TaxReturn, TaxReturnStatus } from "../types";

interface TaxReturnDetailViewProps {
	taxReturn: TaxReturn;
}

function getStatusBadgeClasses(status: TaxReturnStatus): string {
	switch (status) {
		case "Not Started":
		case "Intake":
			return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
		case "Documents Gathering":
		case "In Preparation":
			return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
		case "In Review":
			return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
		case "Waiting on Client":
			return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800";
		case "Ready to File":
		case "E-Filed":
			return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
		case "Complete":
			return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
		default:
			return "";
	}
}

function getDocumentStatusBadge(status: DocumentStatus): string {
	switch (status) {
		case "Not Requested":
			return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
		case "Requested":
			return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
		case "Submitted":
			return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
		case "Verified":
			return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
		default:
			return "";
	}
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatDate(dateStr: string | null): string {
	if (!dateStr) return "---";
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

const daysChartConfig: ChartConfig = {
	days: {
		label: "Avg Days",
		color: "hsl(var(--chart-1))",
	},
};

const docChartConfig: ChartConfig = {
	verified: {
		label: "Verified",
		color: "hsl(142 71% 45%)",
	},
	pending: {
		label: "Pending",
		color: "hsl(var(--chart-4))",
	},
};

function DetailField({
	label,
	value,
	icon,
}: {
	label: string;
	value: React.ReactNode;
	icon?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-[11px] text-muted-foreground uppercase tracking-wider">
				{label}
			</span>
			<div className="flex items-center gap-1.5 text-sm">
				{icon}
				{value}
			</div>
		</div>
	);
}

export default function TaxReturnDetailView({
	taxReturn,
}: TaxReturnDetailViewProps) {
	return (
		<div className="space-y-6 p-4 lg:p-6">
			{/* Top Detail Sections */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{/* Return Details */}
				<Card className="py-4">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm">Return Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailField
								label="Return #"
								value={
									<span className="font-medium">
										{taxReturn.taxReturnNumber}
									</span>
								}
								icon={
									<FileText className="h-3.5 w-3.5 text-muted-foreground" />
								}
							/>
							<DetailField
								label="Client"
								value={
									<Link
										href={`/dashboard/clients/${taxReturn.clientId}`}
										className="font-medium text-primary hover:underline"
									>
										{taxReturn.clientName}
									</Link>
								}
								icon={<User className="h-3.5 w-3.5 text-muted-foreground" />}
							/>
							<DetailField
								label="Contact"
								value={
									<div className="flex flex-col">
										<span>{taxReturn.contactName}</span>
										<span className="text-[11px] text-muted-foreground">
											{taxReturn.contactRole}
										</span>
									</div>
								}
							/>
							<DetailField
								label="Tax Year"
								value={<span className="font-medium">{taxReturn.taxYear}</span>}
								icon={
									<CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
								}
							/>
							<DetailField label="Return Type" value={taxReturn.returnType} />
							<DetailField
								label="Contact Info"
								value={
									<div className="flex flex-col gap-0.5">
										<div className="flex items-center gap-1 text-[11px]">
											<Mail className="h-3 w-3 text-muted-foreground" />
											{taxReturn.contactEmail}
										</div>
										<div className="flex items-center gap-1 text-[11px]">
											<Phone className="h-3 w-3 text-muted-foreground" />
											{taxReturn.contactPhone}
										</div>
									</div>
								}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Workflow & Tracking */}
				<Card className="py-4">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm">Workflow & Tracking</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailField
								label="Status"
								value={
									<Badge
										variant="outline"
										className={getStatusBadgeClasses(taxReturn.status)}
									>
										{taxReturn.status}
									</Badge>
								}
							/>
							<DetailField
								label="Complexity"
								value={<Badge variant="outline">{taxReturn.complexity}</Badge>}
							/>
							<DetailField
								label="Intake Method"
								value={taxReturn.intakeMethod}
							/>
							<DetailField
								label="Due Date"
								value={
									<span className="font-medium">
										{formatDate(taxReturn.dueDate)}
									</span>
								}
								icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
							/>
							<DetailField
								label="Status Changed"
								value={formatDate(taxReturn.statusChangedAt)}
							/>
							<DetailField
								label="Created"
								value={formatDate(taxReturn.createdAt)}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{/* Billing & Protection */}
				<Card className="py-4">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm">Billing & Protection</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailField
								label="Fee"
								value={
									<span className="font-semibold text-base">
										{formatCurrency(taxReturn.amount)}
									</span>
								}
								icon={
									<DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
								}
							/>
							<DetailField
								label="Payment Received"
								value={
									taxReturn.paymentReceivedAt ? (
										<div className="flex items-center gap-1">
											<CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
											<span>{formatDate(taxReturn.paymentReceivedAt)}</span>
										</div>
									) : (
										<span className="text-orange-600">Pending</span>
									)
								}
							/>
							<DetailField
								label="Audit Protection"
								value={
									taxReturn.hasAuditProtection ? (
										<div className="flex items-center gap-1 text-green-600">
											<ShieldCheck className="h-3.5 w-3.5" />
											<span>Active</span>
										</div>
									) : (
										<span className="text-muted-foreground">Not purchased</span>
									)
								}
							/>
							<DetailField
								label="Identity Protection"
								value={
									taxReturn.hasIdentityProtection ? (
										<div className="flex items-center gap-1 text-green-600">
											<Shield className="h-3.5 w-3.5" />
											<span>Active</span>
										</div>
									) : (
										<span className="text-muted-foreground">Not purchased</span>
									)
								}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Internal Notes */}
				<Card className="py-4">
					<CardHeader className="pb-3">
						<CardTitle className="text-sm">Internal Notes</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{taxReturn.internalNotes || "No notes."}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Metrics Section */}
			<div>
				<h3 className="mb-3 font-semibold text-sm">Metrics</h3>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* Days in Current Status Trend */}
					<Card className="py-4">
						<CardHeader className="pb-2">
							<CardDescription className="text-xs">
								Average Days in Each Status
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ChartContainer
								config={daysChartConfig}
								className="h-[200px] w-full"
							>
								<LineChart
									data={daysInStatusData}
									margin={{ left: 12, right: 12, top: 8, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="status"
										tickLine={false}
										axisLine={false}
										tick={{ fontSize: 9 }}
										angle={-30}
										textAnchor="end"
										height={50}
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
										dataKey="days"
										stroke="hsl(var(--chart-1))"
										strokeWidth={2}
										dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
									/>
								</LineChart>
							</ChartContainer>
						</CardContent>
					</Card>

					{/* Document Completion Rate */}
					<Card className="py-4">
						<CardHeader className="pb-2">
							<CardDescription className="text-xs">
								Document Completion Rate
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ChartContainer
								config={docChartConfig}
								className="h-[200px] w-full"
							>
								<BarChart
									data={documentCompletionData}
									margin={{ left: 12, right: 12, top: 8, bottom: 0 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="documentType"
										tickLine={false}
										axisLine={false}
										tick={{ fontSize: 9 }}
										angle={-30}
										textAnchor="end"
										height={50}
									/>
									<YAxis
										tickLine={false}
										axisLine={false}
										tick={{ fontSize: 10 }}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar
										dataKey="verified"
										stackId="a"
										fill="hsl(142 71% 45%)"
										radius={[0, 0, 0, 0]}
									/>
									<Bar
										dataKey="pending"
										stackId="a"
										fill="hsl(var(--chart-4))"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</div>
			</div>

			<Separator />

			{/* Child Tabs: Documents & Team */}
			<Tabs defaultValue="documents">
				<TabsList>
					<TabsTrigger value="documents">
						<FileCheck className="mr-1.5 h-3.5 w-3.5" />
						Documents ({taxReturn.documents.length})
					</TabsTrigger>
					<TabsTrigger value="team">
						<User className="mr-1.5 h-3.5 w-3.5" />
						Team ({taxReturn.assignments.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="documents">
					{taxReturn.documents.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="text-xs">Document Type</TableHead>
									<TableHead className="text-xs">Status</TableHead>
									<TableHead className="text-xs">Tax Year</TableHead>
									<TableHead className="text-xs">File</TableHead>
									<TableHead className="text-xs">Notes</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{taxReturn.documents.map((doc) => (
									<TableRow key={doc.id}>
										<TableCell className="font-medium text-xs">
											{doc.documentType}
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className={getDocumentStatusBadge(doc.status)}
											>
												{doc.status}
											</Badge>
										</TableCell>
										<TableCell className="text-xs">{doc.taxYear}</TableCell>
										<TableCell>
											{doc.fileUrl ? (
												<a
													href={doc.fileUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-1 text-primary text-xs hover:underline"
												>
													<ExternalLink className="h-3 w-3" />
													View
												</a>
											) : (
												<span className="text-muted-foreground text-xs">
													---
												</span>
											)}
										</TableCell>
										<TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
											{doc.notes || "---"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="py-8 text-center text-muted-foreground text-sm">
							No documents have been added to this return yet.
						</div>
					)}
				</TabsContent>

				<TabsContent value="team">
					{taxReturn.assignments.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="text-xs">Team Member</TableHead>
									<TableHead className="text-xs">Title</TableHead>
									<TableHead className="text-xs">Role</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{taxReturn.assignments.map((assignment) => (
									<TableRow key={assignment.id}>
										<TableCell className="font-medium text-xs">
											{assignment.teamMemberName}
										</TableCell>
										<TableCell className="text-muted-foreground text-xs">
											{assignment.teamMemberTitle}
										</TableCell>
										<TableCell>
											<Badge variant="outline" className="text-xs">
												{assignment.assignmentRole}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="py-8 text-center text-muted-foreground text-sm">
							No team members assigned to this return yet.
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
