"use client";

import { Link } from "@/components/fastLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	AlertTriangle,
	Calendar,
	CheckCircle2,
	Clock,
	CreditCard,
	DollarSign,
	FileText,
	RefreshCw,
	User,
	XCircle,
} from "lucide-react";
import type { ServiceSubscription, SubscriptionPayment } from "../types";

interface SubscriptionDetailViewProps {
	subscription: ServiceSubscription;
}

function getStatusBadge(status: ServiceSubscription["status"]) {
	switch (status) {
		case "Active - Current":
			return (
				<Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
					Active - Current
				</Badge>
			);
		case "Active - Behind":
			return (
				<Badge variant="destructive" className="gap-1">
					<AlertTriangle className="h-3 w-3" />
					Active - Behind
				</Badge>
			);
		case "Pending Setup":
			return (
				<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
					Pending Setup
				</Badge>
			);
		case "Paused":
			return (
				<Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
					Paused
				</Badge>
			);
		case "Cancelled":
			return (
				<Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
					Cancelled
				</Badge>
			);
		case "Completed":
			return (
				<Badge className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">
					Completed
				</Badge>
			);
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

function formatShortDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function getPaymentStatusIcon(status: SubscriptionPayment["status"]) {
	switch (status) {
		case "Completed":
			return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
		case "Pending":
			return <Clock className="h-4 w-4 text-amber-600" />;
		case "Failed":
			return <XCircle className="h-4 w-4 text-destructive" />;
		case "Refunded":
			return <RefreshCw className="h-4 w-4 text-blue-600" />;
	}
}

function getActivityIcon(action: string) {
	if (action.toLowerCase().includes("payment")) {
		return <DollarSign className="h-4 w-4 text-emerald-600" />;
	}
	if (
		action.toLowerCase().includes("cancel") ||
		action.toLowerCase().includes("missed")
	) {
		return <XCircle className="h-4 w-4 text-destructive" />;
	}
	if (action.toLowerCase().includes("status")) {
		return <AlertTriangle className="h-4 w-4 text-amber-600" />;
	}
	return <FileText className="h-4 w-4 text-muted-foreground" />;
}

export default function SubscriptionDetailView({
	subscription: sub,
}: SubscriptionDetailViewProps) {
	const frequencySuffix: Record<string, string> = {
		Monthly: "/mo",
		Quarterly: "/qtr",
		Annually: "/yr",
		"One-Time": "",
	};

	return (
		<div className="space-y-6 p-6">
			{/* Behind Alert Banner */}
			{sub.status === "Active - Behind" && (
				<div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
					<div>
						<p className="font-semibold text-destructive text-sm">
							This service is behind schedule
						</p>
						<p className="mt-1 text-muted-foreground text-sm">
							{sub.internal_notes}
						</p>
					</div>
				</div>
			)}

			{/* Header Section */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="font-bold text-2xl">{sub.service_name}</h1>
						{getStatusBadge(sub.status)}
					</div>
					<p className="mt-1 text-muted-foreground text-sm">
						Subscription {sub.id.toUpperCase()}
					</p>
				</div>
				<div className="text-right">
					<p className="font-bold font-mono text-2xl">
						{formatCurrency(sub.price)}
						<span className="font-normal text-muted-foreground text-sm">
							{frequencySuffix[sub.frequency] || ""}
						</span>
					</p>
					<p className="text-muted-foreground text-sm">
						{sub.frequency} billing
					</p>
				</div>
			</div>

			{/* Info Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Service Details */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<FileText className="h-4 w-4" />
							Service Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Client
							</span>
							<p className="text-sm">
								<Link
									href={`/dashboard/clients/${sub.client_id}`}
									className="text-primary underline-offset-4 hover:underline"
								>
									{sub.client_name}
								</Link>
								<span className="ml-2 text-muted-foreground text-xs">
									({sub.client_type})
								</span>
							</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Service Type
							</span>
							<p className="text-sm">
								{sub.offer_type} - {sub.service_name}
							</p>
						</div>
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Billing Frequency
							</span>
							<p className="text-sm">{sub.frequency}</p>
						</div>
						<div className="flex gap-8">
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Start Date
								</span>
								<p className="flex items-center gap-1.5 text-sm">
									<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
									{formatDate(sub.start_date)}
								</p>
							</div>
							{sub.end_date && (
								<div>
									<span className="font-medium text-muted-foreground text-xs">
										End Date
									</span>
									<p className="flex items-center gap-1.5 text-sm">
										<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
										{formatDate(sub.end_date)}
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Internal Notes */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<User className="h-4 w-4" />
							Internal Notes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm leading-relaxed">
							{sub.internal_notes || "No notes recorded."}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Payment History */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						<CreditCard className="h-4 w-4" />
						Payment History
					</CardTitle>
					<CardDescription className="text-xs">
						{sub.payments.length} payment
						{sub.payments.length !== 1 ? "s" : ""} on record
					</CardDescription>
				</CardHeader>
				<CardContent>
					{sub.payments.length === 0 ? (
						<p className="py-8 text-center text-muted-foreground text-sm">
							No payments recorded yet.
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead>Date</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Method</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sub.payments.map((payment) => (
									<TableRow key={payment.id}>
										<TableCell className="text-muted-foreground">
											{formatShortDate(payment.paid_at)}
										</TableCell>
										<TableCell className="font-mono">
											{formatCurrency(payment.amount)}
										</TableCell>
										<TableCell>{payment.payment_method}</TableCell>
										<TableCell>
											<div className="flex items-center gap-1.5">
												{getPaymentStatusIcon(payment.status)}
												<span className="text-sm">{payment.status}</span>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Activity Timeline */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						<Clock className="h-4 w-4" />
						Activity Timeline
					</CardTitle>
					<CardDescription className="text-xs">
						Recent actions and status changes
					</CardDescription>
				</CardHeader>
				<CardContent>
					{sub.activity.length === 0 ? (
						<p className="py-8 text-center text-muted-foreground text-sm">
							No activity recorded yet.
						</p>
					) : (
						<div className="space-y-4">
							{sub.activity.map((act, idx) => (
								<div key={act.id} className="flex gap-3">
									<div className="flex flex-col items-center">
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
											{getActivityIcon(act.action)}
										</div>
										{idx < sub.activity.length - 1 && (
											<div className="mt-1 w-px flex-1 bg-border" />
										)}
									</div>
									<div className="pb-4">
										<p className="font-medium text-sm">{act.action}</p>
										<p className="text-muted-foreground text-sm">
											{act.description}
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											{formatShortDate(act.occurred_at)} - {act.performed_by}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex gap-3">
				<Button variant="outline" asChild>
					<Link href="/dashboard/subscriptions">Back to Subscriptions</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href={`/dashboard/clients/${sub.client_id}`}>
						View Client Profile
					</Link>
				</Button>
			</div>
		</div>
	);
}
