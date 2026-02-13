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
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";

import { advisoryEngagements } from "@/features/advisory/data/mock-data";
// Import mock data from each feature
import { mockClients } from "@/features/clients/data/mock-data";
import { mockFormations } from "@/features/formations/data/mock-data";
import { mockRequests } from "@/features/requests/data/mock-data";
import {
	getBehindCount,
	getTotalActiveRevenue,
	mockSubscriptions,
} from "@/features/subscriptions/data/mock-data";
import { taxReturns } from "@/features/tax-returns/data/mock-data";

import {
	AlertTriangle,
	ArrowRight,
	Briefcase,
	Building2,
	ClipboardList,
	CreditCard,
	FileText,
	MessageSquare,
	TrendingUp,
	Users,
} from "lucide-react";

// ============================
// Computed Metrics
// ============================

const activeClients = mockClients.filter((c) => c.status === "Active").length;

const completedReturns = taxReturns.filter(
	(tr) => tr.status === "Complete",
).length;
const totalReturns = taxReturns.length;
const returnsInProgress = totalReturns - completedReturns;
const taxSeasonProgress = Math.round((completedReturns / totalReturns) * 100);

const openRequests = mockRequests.filter(
	(r) => r.status !== "Resolved" && r.status !== "Won't Do",
).length;

const behindCount = getBehindCount();

// Advisory pipeline: non-complete engagements
const activeAdvisory = advisoryEngagements.filter(
	(e) => e.status !== "Complete",
);
const advisoryPipelineValue = activeAdvisory.reduce(
	(sum, e) => sum + e.amount,
	0,
);
const topAdvisory = activeAdvisory
	.sort((a, b) => b.amount - a.amount)
	.slice(0, 4);

// Monthly recurring revenue
const monthlyRecurring = Math.round(getTotalActiveRevenue());

// Recurring revenue by service type
interface RevenueByType {
	type: string;
	amount: number;
}

const revenueByType = mockSubscriptions
	.filter(
		(s) => s.status === "Active - Current" || s.status === "Active - Behind",
	)
	.reduce<RevenueByType[]>((acc, s) => {
		let monthlyAmount = s.price;
		if (s.frequency === "Quarterly") monthlyAmount = s.price / 3;
		if (s.frequency === "Annually") monthlyAmount = s.price / 12;

		const existing = acc.find((item) => item.type === s.offer_type);
		if (existing) {
			existing.amount += monthlyAmount;
		} else {
			acc.push({ type: s.offer_type, amount: monthlyAmount });
		}
		return acc;
	}, [])
	.sort((a, b) => b.amount - a.amount);

// Recent requests (5 most recent by date)
const recentRequests = [...mockRequests]
	.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	)
	.slice(0, 5);

// Active formations
const activeFormations = mockFormations.filter((f) => f.status !== "Complete");

// Quick links data
interface QuickLinkData {
	label: string;
	href: string;
	icon: React.ReactNode;
	count: number;
	statusLine: string;
}

const quickLinks: QuickLinkData[] = [
	{
		label: "Clients",
		href: "/dashboard/clients",
		icon: <Users className="h-5 w-5" />,
		count: mockClients.length,
		statusLine: `${activeClients} active`,
	},
	{
		label: "Tax Returns",
		href: "/dashboard/tax-returns",
		icon: <FileText className="h-5 w-5" />,
		count: taxReturns.length,
		statusLine: `${completedReturns} complete`,
	},
	{
		label: "Advisory",
		href: "/dashboard/advisory",
		icon: <TrendingUp className="h-5 w-5" />,
		count: advisoryEngagements.length,
		statusLine: `${activeAdvisory.length} active`,
	},
	{
		label: "Formations",
		href: "/dashboard/formations",
		icon: <Building2 className="h-5 w-5" />,
		count: mockFormations.length,
		statusLine: `${activeFormations.length} in progress`,
	},
	{
		label: "Requests",
		href: "/dashboard/requests",
		icon: <MessageSquare className="h-5 w-5" />,
		count: mockRequests.length,
		statusLine: `${openRequests} open`,
	},
	{
		label: "Subscriptions",
		href: "/dashboard/subscriptions",
		icon: <CreditCard className="h-5 w-5" />,
		count: mockSubscriptions.length,
		statusLine: `${behindCount} behind`,
	},
];

// ============================
// Helper: Priority color
// ============================

function getPriorityVariant(
	priority: string,
): "default" | "secondary" | "destructive" | "outline" {
	switch (priority) {
		case "Urgent":
			return "destructive";
		case "Normal":
			return "secondary";
		case "Low":
			return "outline";
		default:
			return "secondary";
	}
}

// ============================
// Helper: Format currency
// ============================

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);
}

// ============================
// Main Component
// ============================

export default function DashboardOverview() {
	return (
		<div className="space-y-6 p-6">
			{/* Welcome Section */}
			<div className="space-y-1">
				<h1 className="font-bold text-2xl text-foreground">
					Welcome back, Kathy
				</h1>
				<p className="text-muted-foreground text-sm">
					Here is your business at a glance.
				</p>
			</div>

			{/* Top Row: Key Business Metrics */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Active Clients */}
				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardDescription className="text-xs">
								Active Clients
							</CardDescription>
							<Users className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{activeClients}</div>
						<p className="text-muted-foreground text-xs">
							of {mockClients.length} total clients
						</p>
					</CardContent>
				</Card>

				{/* Returns In Progress */}
				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardDescription className="text-xs">
								Returns In Progress
							</CardDescription>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{returnsInProgress}</div>
						<p className="text-muted-foreground text-xs">
							{completedReturns} of {totalReturns} complete
						</p>
					</CardContent>
				</Card>

				{/* Open Requests */}
				<Card>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardDescription className="text-xs">
								Open Requests
							</CardDescription>
							<ClipboardList className="h-4 w-4 text-muted-foreground" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{openRequests}</div>
						<p className="text-muted-foreground text-xs">
							{
								mockRequests.filter(
									(r) =>
										r.priority === "Urgent" &&
										r.status !== "Resolved" &&
										r.status !== "Won't Do",
								).length
							}{" "}
							urgent
						</p>
					</CardContent>
				</Card>

				{/* Services Behind Schedule */}
				<Card
					className={
						behindCount > 0 ? "border-red-200 dark:border-red-900" : ""
					}
				>
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardDescription className="text-xs">
								Services Behind
							</CardDescription>
							{behindCount > 0 ? (
								<AlertTriangle className="h-4 w-4 text-red-500" />
							) : (
								<Briefcase className="h-4 w-4 text-muted-foreground" />
							)}
						</div>
					</CardHeader>
					<CardContent>
						<div
							className={`font-bold text-2xl ${behindCount > 0 ? "text-red-600 dark:text-red-400" : ""}`}
						>
							{behindCount}
						</div>
						<p className="text-muted-foreground text-xs">
							subscriptions need attention
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Second Row: Revenue & Pipeline */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{/* Advisory Revenue Pipeline */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">
							Advisory Revenue Pipeline
						</CardTitle>
						<CardDescription className="text-xs">
							Active engagements value
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="font-bold text-3xl text-foreground">
							{formatCurrency(advisoryPipelineValue)}
						</div>
						<div className="space-y-3">
							{topAdvisory.map((engagement) => (
								<div
									key={engagement.id}
									className="flex items-center justify-between text-sm"
								>
									<div className="flex min-w-0 flex-1 items-center gap-2">
										<span className="truncate text-foreground">
											{engagement.client_name}
										</span>
										<StatusBadge>{engagement.status}</StatusBadge>
									</div>
									<span className="ml-3 shrink-0 font-medium text-foreground">
										{formatCurrency(engagement.amount)}
									</span>
								</div>
							))}
						</div>
						<Link
							href="/dashboard/advisory"
							className="mt-2 inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
						>
							View all advisory engagements
							<ArrowRight className="h-3 w-3" />
						</Link>
					</CardContent>
				</Card>

				{/* Recurring Revenue */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">
							Monthly Recurring Revenue
						</CardTitle>
						<CardDescription className="text-xs">
							From active subscriptions
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="font-bold text-3xl text-foreground">
							{formatCurrency(monthlyRecurring)}
							<span className="font-normal text-muted-foreground text-sm">
								{" "}
								/ month
							</span>
						</div>
						<div className="space-y-3">
							{revenueByType.map((item) => (
								<div
									key={item.type}
									className="flex items-center justify-between text-sm"
								>
									<span className="text-muted-foreground">{item.type}</span>
									<span className="font-medium text-foreground">
										{formatCurrency(Math.round(item.amount))}
									</span>
								</div>
							))}
						</div>
						<Link
							href="/dashboard/subscriptions"
							className="mt-2 inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
						>
							View all subscriptions
							<ArrowRight className="h-3 w-3" />
						</Link>
					</CardContent>
				</Card>
			</div>

			{/* Third Row: Activity Snapshots */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{/* Recent Requests */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Recent Requests</CardTitle>
						<CardDescription className="text-xs">
							Latest client requests
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{recentRequests.map((request) => (
								<div key={request.id} className="space-y-1">
									<div className="flex items-start justify-between gap-2">
										<span className="line-clamp-1 text-foreground text-sm">
											{request.title}
										</span>
										<Badge
											variant={getPriorityVariant(request.priority)}
											className="shrink-0"
										>
											{request.priority}
										</Badge>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground text-xs">
											{request.clientName}
										</span>
										<StatusBadge className="h-5 text-[10px]">
											{request.status}
										</StatusBadge>
									</div>
								</div>
							))}
						</div>
						<Link
							href="/dashboard/requests"
							className="mt-4 inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
						>
							View all requests
							<ArrowRight className="h-3 w-3" />
						</Link>
					</CardContent>
				</Card>

				{/* Tax Season Progress */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Tax Season Progress</CardTitle>
						<CardDescription className="text-xs">
							{completedReturns} of {totalReturns} returns completed
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="font-bold text-3xl text-foreground">
									{taxSeasonProgress}%
								</span>
								<span className="text-muted-foreground text-sm">complete</span>
							</div>
							<Progress value={taxSeasonProgress} className="h-3" />
						</div>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Complete</span>
								<span className="font-medium text-foreground">
									{completedReturns}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">In Progress</span>
								<span className="font-medium text-foreground">
									{
										taxReturns.filter(
											(tr) =>
												tr.status === "In Preparation" ||
												tr.status === "In Review" ||
												tr.status === "Ready to File",
										).length
									}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Waiting on Client</span>
								<span className="font-medium text-foreground">
									{
										taxReturns.filter(
											(tr) =>
												tr.status === "Waiting on Client" ||
												tr.status === "Documents Gathering",
										).length
									}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Not Started</span>
								<span className="font-medium text-foreground">
									{
										taxReturns.filter(
											(tr) =>
												tr.status === "Not Started" || tr.status === "Intake",
										).length
									}
								</span>
							</div>
						</div>
						<Link
							href="/dashboard/tax-returns"
							className="mt-2 inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
						>
							View all tax returns
							<ArrowRight className="h-3 w-3" />
						</Link>
					</CardContent>
				</Card>

				{/* Formations In Progress */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Formations In Progress</CardTitle>
						<CardDescription className="text-xs">
							{activeFormations.length} active formations
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{activeFormations.slice(0, 5).map((formation) => (
								<div key={formation.id} className="space-y-1">
									<div className="flex items-start justify-between gap-2">
										<span className="line-clamp-1 text-foreground text-sm">
											{formation.clientName}
										</span>
										<Badge variant="outline" className="shrink-0">
											{formation.entityType}
										</Badge>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground text-xs">
											{formation.stateOfIncorporation}
										</span>
										<StatusBadge className="h-5 text-[10px]">
											{formation.status}
										</StatusBadge>
									</div>
								</div>
							))}
							{activeFormations.length > 5 && (
								<p className="text-muted-foreground text-xs">
									+{activeFormations.length - 5} more
								</p>
							)}
						</div>
						<Link
							href="/dashboard/formations"
							className="mt-4 inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
						>
							View all formations
							<ArrowRight className="h-3 w-3" />
						</Link>
					</CardContent>
				</Card>
			</div>

			{/* Bottom Row: Quick Links */}
			<div>
				<h2 className="mb-3 font-semibold text-foreground text-sm">
					Quick Links
				</h2>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
					{quickLinks.map((link) => (
						<Link key={link.label} href={link.href} className="group">
							<Card className="transition-colors group-hover:border-foreground/20 group-hover:bg-accent/50">
								<CardContent className="flex flex-col items-center gap-2 pt-4 text-center">
									<div className="text-muted-foreground group-hover:text-foreground">
										{link.icon}
									</div>
									<div>
										<p className="font-medium text-foreground text-sm">
											{link.label}
										</p>
										<p className="text-muted-foreground text-xs">
											{link.count} total
										</p>
										<p className="text-[11px] text-muted-foreground">
											{link.statusLine}
										</p>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
