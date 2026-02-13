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
import {
	StatusBadge,
	type StatusColorScheme,
} from "@/components/ui/status-badge";
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
	Building2,
	CheckCircle2,
	Circle,
	ClipboardList,
	DollarSign,
	ExternalLink,
	FileText,
	Hash,
	Landmark,
	MapPin,
	Notebook,
	ShieldCheck,
	User,
	Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { mockFormations } from "../data/mock-data";
import type { BusinessFormation, FormationDocument } from "../types";

interface FormationDetailViewProps {
	formation: BusinessFormation;
}

// Status workflow steps
const statusWorkflow: BusinessFormation["status"][] = [
	"Info Gathering",
	"Name Search",
	"Name Approved",
	"State Filing",
	"Awaiting EIN",
	"Awaiting State Tax ID",
	"Complete",
];

function getStatusIndex(status: BusinessFormation["status"]): number {
	return statusWorkflow.indexOf(status);
}

function getDocStatusColor(
	status: FormationDocument["status"],
): StatusColorScheme {
	switch (status) {
		case "Verified":
			return "green";
		case "Submitted":
			return "blue";
		case "Requested":
			return "orange";
		case "Not Requested":
			return "gray";
		default:
			return "gray";
	}
}

function getStatusBadgeColor(
	status: BusinessFormation["status"],
): StatusColorScheme {
	switch (status) {
		case "Complete":
			return "green";
		case "Info Gathering":
			return "gray";
		case "Name Search":
			return "blue";
		case "Name Approved":
			return "purple";
		case "State Filing":
			return "orange";
		case "Awaiting EIN":
			return "yellow";
		case "Awaiting State Tax ID":
			return "yellow";
		default:
			return "gray";
	}
}

// Chart data for days in stage
const daysInStageData = [
	{ stage: "Info Gathering", days: 5 },
	{ stage: "Name Search", days: 7 },
	{ stage: "Name Approved", days: 3 },
	{ stage: "State Filing", days: 12 },
	{ stage: "Awaiting EIN", days: 8 },
	{ stage: "Awaiting Tax ID", days: 15 },
];

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

function computeEntityTypeData() {
	const entityCounts: Record<string, number> = {};
	for (const f of mockFormations) {
		entityCounts[f.entityType] = (entityCounts[f.entityType] || 0) + 1;
	}
	return Object.entries(entityCounts)
		.map(([type, count]) => ({ type, count }))
		.sort((a, b) => b.count - a.count);
}

export default function FormationDetailView({
	formation,
}: FormationDetailViewProps) {
	const currentStatusIndex = getStatusIndex(formation.status);
	const entityTypeData = computeEntityTypeData();

	return (
		<div className="space-y-6 p-6">
			{/* Top Section: Formation Details + Names & Status */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Formation Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<Building2 className="h-4 w-4" />
							Formation Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Formation #
								</span>
								<p className="font-mono font-semibold text-sm">
									{formation.formationNumber}
								</p>
							</div>
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Entity Type
								</span>
								<div className="mt-0.5">
									<Badge variant="secondary">{formation.entityType}</Badge>
								</div>
							</div>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Client
							</span>
							<p className="text-sm">
								<Link
									href={`/dashboard/clients/${formation.clientId}`}
									className="text-primary hover:underline"
								>
									{formation.clientName}
								</Link>
							</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Requesting Contact
							</span>
							<p className="text-sm">
								{formation.requestingContact}
								<span className="ml-1 text-muted-foreground">
									({formation.requestingContactRole})
								</span>
							</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								State of Incorporation
							</span>
							<p className="flex items-center gap-1 text-sm">
								<MapPin className="h-3 w-3 text-muted-foreground" />
								{formation.stateOfIncorporation}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Names & Status */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<ClipboardList className="h-4 w-4" />
							Names & Status
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Status Workflow */}
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Current Status
							</span>
							<div className="mt-1">
								<StatusBadge
									colorScheme={getStatusBadgeColor(formation.status)}
								>
									{formation.status}
								</StatusBadge>
							</div>
						</div>

						{/* Status Progress */}
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Workflow Progress
							</span>
							<div className="mt-2 flex items-center gap-1">
								{statusWorkflow.map((step, index) => {
									const isComplete = index <= currentStatusIndex;
									const isCurrent = index === currentStatusIndex;
									return (
										<div key={step} className="flex items-center gap-1">
											{isComplete ? (
												<CheckCircle2
													className={`h-4 w-4 ${
														isCurrent ? "text-primary" : "text-green-500"
													}`}
												/>
											) : (
												<Circle className="h-4 w-4 text-muted-foreground/40" />
											)}
											{index < statusWorkflow.length - 1 && (
												<div
													className={`h-0.5 w-3 ${
														index < currentStatusIndex
															? "bg-green-500"
															: "bg-muted-foreground/20"
													}`}
												/>
											)}
										</div>
									);
								})}
							</div>
							<div className="mt-1 text-[10px] text-muted-foreground">
								Step {currentStatusIndex + 1} of {statusWorkflow.length}
							</div>
						</div>

						{/* Proposed Names */}
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Proposed Names
							</span>
							<ul className="mt-1 space-y-0.5">
								{formation.proposedNames.map((name) => (
									<li
										key={name}
										className={`text-sm ${
											name === formation.confirmedName
												? "font-semibold text-primary"
												: "text-muted-foreground"
										}`}
									>
										{name === formation.confirmedName ? "* " : "- "}
										{name}
									</li>
								))}
							</ul>
						</div>

						{/* Confirmed Name */}
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Confirmed Name
							</span>
							<p className="font-semibold text-sm">
								{formation.confirmedName || (
									<span className="font-normal text-muted-foreground italic">
										Not yet confirmed
									</span>
								)}
							</p>
						</div>

						{/* Registered Agent */}
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Registered Agent
							</span>
							<p className="flex items-center gap-1 text-sm">
								<User className="h-3 w-3 text-muted-foreground" />
								{formation.registeredAgent}
								<Badge variant="outline" className="ml-1 text-[10px]">
									{formation.registeredAgentType}
								</Badge>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Key Identifiers -- CRITICAL SECTION */}
			<Card className="border-primary/20 bg-primary/[0.02]">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						<ShieldCheck className="h-4 w-4 text-primary" />
						Key Identifiers
					</CardTitle>
					<CardDescription>
						Critical business identifiers needed for banking, taxes, DUNS
						number, and government contracting
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6 sm:grid-cols-3">
						{/* EIN */}
						<div className="rounded-lg border border-primary/10 bg-background p-4">
							<div className="flex items-center gap-2">
								<Hash className="h-4 w-4 text-primary" />
								<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
									EIN (Federal)
								</span>
							</div>
							{formation.ein ? (
								<p className="mt-2 font-bold font-mono text-lg tracking-wider">
									{formation.ein}
								</p>
							) : (
								<p className="mt-2 text-muted-foreground text-sm italic">
									Pending
								</p>
							)}
						</div>

						{/* State Tax ID */}
						<div className="rounded-lg border border-primary/10 bg-background p-4">
							<div className="flex items-center gap-2">
								<Landmark className="h-4 w-4 text-primary" />
								<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
									State Tax ID
								</span>
							</div>
							{formation.stateTaxId ? (
								<p className="mt-2 font-bold font-mono text-lg tracking-wider">
									{formation.stateTaxId}
								</p>
							) : (
								<p className="mt-2 text-muted-foreground text-sm italic">
									Pending
								</p>
							)}
						</div>

						{/* Fee */}
						<div className="rounded-lg border border-primary/10 bg-background p-4">
							<div className="flex items-center gap-2">
								<DollarSign className="h-4 w-4 text-primary" />
								<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
									Formation Fee
								</span>
							</div>
							<p className="mt-2 font-bold text-lg">
								${formation.amount.toLocaleString()}.00
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Internal Notes */}
			{formation.internalNotes && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<Notebook className="h-4 w-4" />
							Internal Notes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{formation.internalNotes}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Metrics Charts */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
							className="h-[240px] w-full"
						>
							<BarChart
								data={daysInStageData}
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
							className="h-[240px] w-full"
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

			{/* Child Tabs: Documents + Team */}
			<Tabs defaultValue="documents" className="w-full">
				<TabsList>
					<TabsTrigger value="documents" className="gap-1.5">
						<FileText className="h-3.5 w-3.5" />
						Documents
					</TabsTrigger>
					<TabsTrigger value="team" className="gap-1.5">
						<Users className="h-3.5 w-3.5" />
						Team
					</TabsTrigger>
				</TabsList>

				<TabsContent value="documents">
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">Formation Documents</CardTitle>
							<CardDescription>
								Articles of Organization, Member Info, Name Search Results, EIN
								Confirmation, State Certificate
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Document Type</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>File</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{formation.documents.map((doc) => (
										<TableRow key={doc.id}>
											<TableCell className="font-medium">
												{doc.documentType}
											</TableCell>
											<TableCell>
												<StatusBadge
													colorScheme={getDocStatusColor(doc.status)}
												>
													{doc.status}
												</StatusBadge>
											</TableCell>
											<TableCell>
												{doc.fileUrl ? (
													<a
														href={doc.fileUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
													>
														View
														<ExternalLink className="h-3 w-3" />
													</a>
												) : (
													<span className="text-muted-foreground text-sm italic">
														No file
													</span>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="team">
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">Team Assignments</CardTitle>
							<CardDescription>
								Team members assigned to this formation
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Team Member</TableHead>
										<TableHead>Job Title</TableHead>
										<TableHead>Role</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{formation.team.map((member) => (
										<TableRow key={member.id}>
											<TableCell className="font-medium">
												{member.teamMemberName}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{member.jobTitle}
											</TableCell>
											<TableCell>
												<Badge variant="outline">{member.assignmentType}</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
