"use client";

import { Badge } from "@/components/ui/badge";
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
	BookOpen,
	Briefcase,
	Building,
	Calendar,
	CreditCard,
	FileText,
	Globe,
	Key,
	Mail,
	MessageSquare,
	Phone,
	Shield,
	Tag,
	UserCheck,
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
import type {
	AccountAssignment,
	AdvisoryEngagement,
	BusinessFormation,
	Client,
	ClientDocument,
	ClientQualityScore,
	ClientRequest,
	CompanyPurchase,
	Contact,
	Payment,
	QuarterlyRevenueData,
	ServiceBreakdownData,
	TaxReturn,
	ToolAccess,
	Touchpoint,
} from "../types";

// ============================
// Props Interface
// ============================

interface ClientDetailViewProps {
	client: Client;
	contacts: Contact[];
	taxReturns: TaxReturn[];
	advisory: AdvisoryEngagement[];
	formations: BusinessFormation[];
	purchases: CompanyPurchase[];
	documents: ClientDocument[];
	toolAccess: ToolAccess[];
	payments: Payment[];
	touchpoints: Touchpoint[];
	assignments: AccountAssignment[];
	requests: ClientRequest[];
	revenueTrend: QuarterlyRevenueData[];
	serviceBreakdown: ServiceBreakdownData[];
}

// ============================
// Helpers
// ============================

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function formatDateTime(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

function getStatusColor(
	status: string,
): "green" | "yellow" | "red" | "orange" | "blue" | "gray" | "purple" {
	const s = status.toLowerCase();
	if (
		s.includes("active") ||
		s.includes("complete") ||
		s.includes("verified") ||
		s.includes("granted") ||
		s.includes("resolved")
	)
		return "green";
	if (
		s.includes("blocked") ||
		s.includes("churned") ||
		s.includes("cancelled") ||
		s.includes("failed") ||
		s.includes("issue") ||
		s.includes("wrong") ||
		s.includes("won't")
	)
		return "red";
	if (
		s.includes("pending") ||
		s.includes("paused") ||
		s.includes("review") ||
		s.includes("draft") ||
		s.includes("prospect")
	)
		return "yellow";
	if (
		s.includes("new") ||
		s.includes("requested") ||
		s.includes("triaged") ||
		s.includes("waiting")
	)
		return "orange";
	if (
		s.includes("progress") ||
		s.includes("entry") ||
		s.includes("prep") ||
		s.includes("filing") ||
		s.includes("implementation") ||
		s.includes("discovery") ||
		s.includes("collection") ||
		s.includes("search") ||
		s.includes("application")
	)
		return "blue";
	if (s.includes("submitted") || s.includes("needs")) return "purple";
	return "gray";
}

function getQualityScoreColorScheme(
	score: ClientQualityScore,
): "green" | "blue" | "yellow" | "red" {
	switch (score) {
		case "excellent":
			return "green";
		case "good":
			return "blue";
		case "fair":
			return "yellow";
		case "poor":
			return "red";
		default:
			return "green";
	}
}

function formatQualityScoreLabel(score: ClientQualityScore): string {
	return score.charAt(0).toUpperCase() + score.slice(1);
}

// ============================
// Detail Field Component
// ============================

function DetailField({
	label,
	value,
	icon,
}: {
	label: string;
	value: string | null | undefined;
	icon?: React.ReactNode;
}) {
	return (
		<div className="space-y-1">
			<span className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
				{icon}
				{label}
			</span>
			<p className="text-sm">{value || "---"}</p>
		</div>
	);
}

// ============================
// Main Component
// ============================

export default function ClientDetailView({
	client,
	contacts,
	taxReturns,
	advisory,
	formations,
	purchases,
	documents,
	toolAccess,
	payments,
	touchpoints,
	assignments,
	requests,
	revenueTrend,
	serviceBreakdown,
}: ClientDetailViewProps) {
	const revenueChartConfig = {
		revenue: {
			label: "Revenue",
			color: "var(--chart-1)",
		},
	};

	const serviceChartConfig = {
		count: {
			label: "Active Services",
			color: "var(--chart-2)",
		},
	};

	return (
		<div className="space-y-6 p-6">
			{/* ========================== */}
			{/* Client Info + Business + Internal Sections */}
			{/* ========================== */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Client Information */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Building className="h-4 w-4" />
							Client Information
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						<DetailField label="Client Name" value={client.full_name} />
						<DetailField
							label="Email"
							value={client.email}
							icon={<Mail className="h-3 w-3" />}
						/>
						<DetailField
							label="Phone"
							value={client.phone}
							icon={<Phone className="h-3 w-3" />}
						/>
						<DetailField label="Type" value={client.client_type} />
						<DetailField
							label="Language"
							value={client.language}
							icon={<Globe className="h-3 w-3" />}
						/>
						<DetailField label="Source" value={client.source} />
					</CardContent>
				</Card>

				{/* Business Details */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Briefcase className="h-4 w-4" />
							Business Details
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						<DetailField label="Industry" value={client.industry} />
						<DetailField
							label="Legal Structure"
							value={client.legal_structure}
						/>
						<DetailField
							label="State of Incorporation"
							value={client.state_of_incorporation}
						/>
						<DetailField
							label="Date of Incorporation"
							value={
								client.date_of_incorporation
									? formatDate(client.date_of_incorporation)
									: null
							}
							icon={<Calendar className="h-3 w-3" />}
						/>
						<DetailField label="Website" value={client.website} />
						<DetailField
							label="EIN"
							value={client.tax_id_ein}
							icon={<Shield className="h-3 w-3" />}
						/>
						<DetailField label="State Tax ID" value={client.state_tax_id} />
						<DetailField
							label="Registered Agent"
							value={client.registered_agent}
						/>
					</CardContent>
				</Card>

				{/* Internal */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Tag className="h-4 w-4" />
							Status & Internal
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="space-y-1">
							<span className="font-medium text-muted-foreground text-xs">
								Status
							</span>
							<div>
								<StatusBadge colorScheme={getStatusColor(client.status)}>
									{client.status}
								</StatusBadge>
							</div>
						</div>
						<div className="space-y-1">
							<span className="font-medium text-muted-foreground text-xs">
								Quality Rating
							</span>
							<div>
								<Badge
									variant={
										client.quality === "Great"
											? "default"
											: client.quality === "Good"
												? "secondary"
												: client.quality === "Difficult"
													? "destructive"
													: "outline"
									}
								>
									{client.quality}
								</Badge>
							</div>
						</div>
						<div className="space-y-1">
							<span className="font-medium text-muted-foreground text-xs">
								Quality Score
							</span>
							<div className="flex items-center gap-2">
								<StatusBadge
									colorScheme={getQualityScoreColorScheme(client.qualityScore)}
								>
									{formatQualityScoreLabel(client.qualityScore)}
								</StatusBadge>
								<span className="text-muted-foreground text-xs">
									Avg Response: {client.avgResponseDays.toFixed(1)} days
								</span>
							</div>
						</div>
						<div className="space-y-1">
							<span className="font-medium text-muted-foreground text-xs">
								Internal Notes
							</span>
							<p className="rounded-md bg-muted/50 p-2 text-sm leading-relaxed">
								{client.internal_notes || "No notes."}
							</p>
						</div>
						<DetailField
							label="Client Since"
							value={formatDate(client.created_at)}
							icon={<Calendar className="h-3 w-3" />}
						/>
					</CardContent>
				</Card>
			</div>

			{/* ========================== */}
			{/* Metrics KPIs */}
			{/* ========================== */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Revenue Trend */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">
							Revenue from Client (All Services)
						</CardTitle>
						<CardDescription className="text-xs">
							Quarter vs Total Payments Received
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={revenueChartConfig}
							className="h-[200px] w-full"
						>
							<LineChart
								data={revenueTrend}
								margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
							>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis
									dataKey="quarter"
									tick={{ fontSize: 11 }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 11 }}
									tickLine={false}
									axisLine={false}
									tickFormatter={(v) => `$${(v as number).toLocaleString()}`}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									type="monotone"
									dataKey="revenue"
									stroke="var(--color-revenue)"
									strokeWidth={2}
									dot={{ r: 3 }}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>

				{/* Active Services Breakdown */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm">Active Services Breakdown</CardTitle>
						<CardDescription className="text-xs">
							Offer Type vs Count of Active Purchases
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={serviceChartConfig}
							className="h-[200px] w-full"
						>
							<BarChart
								data={serviceBreakdown}
								margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
							>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis
									dataKey="service"
									tick={{ fontSize: 11 }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 11 }}
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
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

			{/* ========================== */}
			{/* Child Tabs - All 11 */}
			{/* ========================== */}
			<Tabs defaultValue="contacts" className="w-full">
				<TabsList className="flex w-full flex-wrap gap-1">
					<TabsTrigger value="contacts" className="text-xs">
						<Users className="mr-1 h-3 w-3" />
						Contacts ({contacts.length})
					</TabsTrigger>
					<TabsTrigger value="tax-returns" className="text-xs">
						<FileText className="mr-1 h-3 w-3" />
						Tax Returns ({taxReturns.length})
					</TabsTrigger>
					<TabsTrigger value="advisory" className="text-xs">
						<BookOpen className="mr-1 h-3 w-3" />
						Advisory ({advisory.length})
					</TabsTrigger>
					<TabsTrigger value="formations" className="text-xs">
						<Building className="mr-1 h-3 w-3" />
						Formations ({formations.length})
					</TabsTrigger>
					<TabsTrigger value="services" className="text-xs">
						<Briefcase className="mr-1 h-3 w-3" />
						Services ({purchases.length})
					</TabsTrigger>
					<TabsTrigger value="documents" className="text-xs">
						<FileText className="mr-1 h-3 w-3" />
						Documents ({documents.length})
					</TabsTrigger>
					<TabsTrigger value="tool-access" className="text-xs">
						<Key className="mr-1 h-3 w-3" />
						Tool Access ({toolAccess.length})
					</TabsTrigger>
					<TabsTrigger value="payments" className="text-xs">
						<CreditCard className="mr-1 h-3 w-3" />
						Payments ({payments.length})
					</TabsTrigger>
					<TabsTrigger value="touchpoints" className="text-xs">
						<MessageSquare className="mr-1 h-3 w-3" />
						Touchpoints ({touchpoints.length})
					</TabsTrigger>
					<TabsTrigger value="team" className="text-xs">
						<UserCheck className="mr-1 h-3 w-3" />
						Team ({assignments.length})
					</TabsTrigger>
					<TabsTrigger value="requests" className="text-xs">
						<MessageSquare className="mr-1 h-3 w-3" />
						Requests ({requests.length})
					</TabsTrigger>
				</TabsList>

				{/* ---- Contacts Tab ---- */}
				<TabsContent value="contacts">
					<Card>
						<CardContent className="pt-6">
							{contacts.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No contacts for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>Phone</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Primary?</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{contacts.map((contact) => (
											<TableRow key={contact.id}>
												<TableCell className="font-medium">
													{contact.full_name}
												</TableCell>
												<TableCell>{contact.role}</TableCell>
												<TableCell className="font-mono text-sm">
													{contact.phone}
												</TableCell>
												<TableCell>{contact.email}</TableCell>
												<TableCell>
													{contact.is_primary ? (
														<Badge variant="default">Primary</Badge>
													) : (
														<span className="text-muted-foreground text-sm">
															No
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

				{/* ---- Tax Returns Tab ---- */}
				<TabsContent value="tax-returns">
					<Card>
						<CardContent className="pt-6">
							{taxReturns.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No tax returns for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Return #</TableHead>
											<TableHead>Tax Year</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Complexity</TableHead>
											<TableHead>Due Date</TableHead>
											<TableHead className="text-right">Fee</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{taxReturns.map((tr) => (
											<TableRow key={tr.id}>
												<TableCell className="font-mono text-sm">
													{tr.tax_return_number}
												</TableCell>
												<TableCell>{tr.tax_year}</TableCell>
												<TableCell>{tr.return_type}</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(tr.status)}>
														{tr.status}
													</StatusBadge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															tr.complexity === "Complex"
																? "destructive"
																: tr.complexity === "Standard"
																	? "secondary"
																	: "outline"
														}
													>
														{tr.complexity}
													</Badge>
												</TableCell>
												<TableCell>{formatDate(tr.due_at)}</TableCell>
												<TableCell className="text-right font-mono">
													{formatCurrency(tr.amount)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ---- Advisory Tab ---- */}
				<TabsContent value="advisory">
					<Card>
						<CardContent className="pt-6">
							{advisory.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No advisory engagements for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Engagement #</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Fee</TableHead>
											<TableHead>Billing</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{advisory.map((adv) => (
											<TableRow key={adv.id}>
												<TableCell className="font-mono text-sm">
													{adv.engagement_number}
												</TableCell>
												<TableCell>{adv.engagement_type}</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(adv.status)}>
														{adv.status}
													</StatusBadge>
												</TableCell>
												<TableCell className="text-right font-mono">
													{formatCurrency(adv.amount)}
												</TableCell>
												<TableCell>{adv.billing_type}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ---- Formations Tab ---- */}
				<TabsContent value="formations">
					<Card>
						<CardContent className="pt-6">
							{formations.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No business formations for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Formation #</TableHead>
											<TableHead>Entity Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>State</TableHead>
											<TableHead>Confirmed Name</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{formations.map((bf) => (
											<TableRow key={bf.id}>
												<TableCell className="font-mono text-sm">
													{bf.formation_number}
												</TableCell>
												<TableCell>{bf.entity_type}</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(bf.status)}>
														{bf.status}
													</StatusBadge>
												</TableCell>
												<TableCell>{bf.state_of_incorporation}</TableCell>
												<TableCell>{bf.confirmed_name || "---"}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ---- Services Tab ---- */}
				<TabsContent value="services">
					<Card>
						<CardContent className="pt-6">
							{purchases.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No services for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Service</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Price</TableHead>
											<TableHead>Frequency</TableHead>
											<TableHead>Start Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{purchases.map((cp) => (
											<TableRow key={cp.id}>
												<TableCell className="font-medium">
													{cp.service_name}
												</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(cp.status)}>
														{cp.status}
													</StatusBadge>
												</TableCell>
												<TableCell className="text-right font-mono">
													{formatCurrency(cp.price)}
												</TableCell>
												<TableCell>{cp.frequency}</TableCell>
												<TableCell>{formatDate(cp.start_date)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ---- Documents Tab ---- */}
				<TabsContent value="documents">
					<Card>
						<CardContent className="pt-6">
							{documents.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No documents for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Document Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Tax Year</TableHead>
											<TableHead>Related To</TableHead>
											<TableHead>File</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{documents.map((doc) => (
											<TableRow key={doc.id}>
												<TableCell className="font-medium">
													{doc.document_type}
												</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(doc.status)}>
														{doc.status}
													</StatusBadge>
												</TableCell>
												<TableCell>{doc.tax_year}</TableCell>
												<TableCell className="text-muted-foreground text-sm">
													{doc.related_entity_type}
												</TableCell>
												<TableCell>
													{doc.file_url ? (
														<a
															href={doc.file_url}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-600 text-sm hover:underline"
														>
															View
														</a>
													) : (
														<span className="text-muted-foreground text-sm">
															---
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

				{/* ---- Tool Access Tab ---- */}
				<TabsContent value="tool-access">
					<Card>
						<CardContent className="pt-6">
							{toolAccess.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No tool access records for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Tool</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Login</TableHead>
											<TableHead>2FA?</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{toolAccess.map((ta) => (
											<TableRow key={ta.id}>
												<TableCell className="font-medium">
													{ta.tool_name}
												</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(ta.status)}>
														{ta.status}
													</StatusBadge>
												</TableCell>
												<TableCell className="font-mono text-sm">
													{ta.login_username}
												</TableCell>
												<TableCell>
													{ta.has_two_factor ? (
														<Badge variant="default">Yes</Badge>
													) : (
														<Badge variant="destructive">No</Badge>
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

				{/* ---- Payments Tab ---- */}
				<TabsContent value="payments">
					<Card>
						<CardContent className="pt-6">
							{payments.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No payment records for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead>Direction</TableHead>
											<TableHead>Method</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>For</TableHead>
											<TableHead>Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{payments.map((pay) => (
											<TableRow key={pay.id}>
												<TableCell className="text-right font-medium font-mono">
													{formatCurrency(pay.amount)}
												</TableCell>
												<TableCell>
													<Badge
														variant={
															pay.direction === "Inbound"
																? "default"
																: "secondary"
														}
													>
														{pay.direction}
													</Badge>
												</TableCell>
												<TableCell>{pay.payment_method}</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(pay.status)}>
														{pay.status}
													</StatusBadge>
												</TableCell>
												<TableCell className="text-muted-foreground text-sm">
													{pay.related_entity_type}
												</TableCell>
												<TableCell>{formatDate(pay.paid_at)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ---- Touchpoints Tab ---- */}
				<TabsContent value="touchpoints">
					<Card>
						<CardContent className="pt-6">
							{touchpoints.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No touchpoints for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Type</TableHead>
											<TableHead>Direction</TableHead>
											<TableHead>Subject</TableHead>
											<TableHead>Date</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{touchpoints.map((tp) => (
											<TableRow key={tp.id}>
												<TableCell>
													<Badge variant="outline">{tp.touchpoint_type}</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															tp.direction === "Inbound"
																? "default"
																: "secondary"
														}
													>
														{tp.direction}
													</Badge>
												</TableCell>
												<TableCell className="max-w-[300px] truncate text-sm">
													{tp.subject}
												</TableCell>
												<TableCell>{formatDateTime(tp.occurred_at)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ---- Team Tab ---- */}
				<TabsContent value="team">
					<Card>
						<CardContent className="pt-6">
							{assignments.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No team assignments for this client.
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
										{assignments.map((aa) => (
											<TableRow key={aa.id}>
												<TableCell className="font-medium">
													{aa.team_member_name}
												</TableCell>
												<TableCell className="text-muted-foreground text-sm">
													{aa.team_member_title}
												</TableCell>
												<TableCell>
													<Badge
														variant={
															aa.assignment_type === "Owner"
																? "default"
																: "secondary"
														}
													>
														{aa.assignment_type}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* ---- Requests Tab ---- */}
				<TabsContent value="requests">
					<Card>
						<CardContent className="pt-6">
							{requests.length === 0 ? (
								<p className="py-4 text-center text-muted-foreground text-sm">
									No requests for this client.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Request #</TableHead>
											<TableHead>Title</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Priority</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{requests.map((req) => (
											<TableRow key={req.id}>
												<TableCell className="font-mono text-sm">
													{req.request_number}
												</TableCell>
												<TableCell className="max-w-[250px] truncate font-medium">
													{req.title}
												</TableCell>
												<TableCell>
													<Badge variant="outline">{req.request_type}</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															req.priority === "Urgent"
																? "destructive"
																: req.priority === "Normal"
																	? "secondary"
																	: "outline"
														}
													>
														{req.priority}
													</Badge>
												</TableCell>
												<TableCell>
													<StatusBadge colorScheme={getStatusColor(req.status)}>
														{req.status}
													</StatusBadge>
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
