"use client";

import { Link } from "@/components/fastLink";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";

import {
	AlertCircle,
	Calendar,
	CircleDot,
	Clock,
	FileText,
	Globe,
	Mail,
	MessageCircle,
	Monitor,
	Phone,
	Tag,
	User,
	UserCheck,
	UserRound,
} from "lucide-react";
import type {
	Request,
	RequestPriority,
	RequestSource,
	RequestSourceChannel,
} from "../types";

interface RequestDetailViewProps {
	request: Request;
}

function getPriorityBadge(priority: RequestPriority) {
	switch (priority) {
		case "Urgent":
			return (
				<Badge variant="destructive" className="text-xs">
					Urgent
				</Badge>
			);
		case "Normal":
			return (
				<Badge className="border-yellow-200 bg-yellow-50 text-xs text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400">
					Normal
				</Badge>
			);
		case "Low":
			return (
				<Badge variant="secondary" className="text-xs">
					Low
				</Badge>
			);
	}
}

function getSourceIcon(source: RequestSource) {
	const iconClass = "h-4 w-4 text-muted-foreground";
	switch (source) {
		case "TaxDome":
			return <Monitor className={iconClass} />;
		case "Phone":
			return <Phone className={iconClass} />;
		case "Email":
			return <Mail className={iconClass} />;
		case "WhatsApp":
			return <MessageCircle className={iconClass} />;
		case "Website":
			return <Globe className={iconClass} />;
		case "Walk-In":
			return <UserRound className={iconClass} />;
	}
}

function getChannelLabel(channel: RequestSourceChannel): string {
	switch (channel) {
		case "tax_dome":
			return "Tax Dome";
		case "email":
			return "Email";
		case "phone":
			return "Phone";
		case "whatsapp":
			return "WhatsApp";
		case "website":
			return "Website";
		case "in_person":
			return "In Person";
	}
}

function getChannelIcon(channel: RequestSourceChannel) {
	const iconClass = "h-4 w-4 text-muted-foreground";
	switch (channel) {
		case "tax_dome":
			return <FileText className={iconClass} />;
		case "email":
			return <Mail className={iconClass} />;
		case "phone":
			return <Phone className={iconClass} />;
		case "whatsapp":
			return <MessageCircle className={iconClass} />;
		case "website":
			return <Globe className={iconClass} />;
		case "in_person":
			return <UserCheck className={iconClass} />;
	}
}

function formatDateTime(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function RequestDetailView({ request }: RequestDetailViewProps) {
	return (
		<div className="space-y-6 p-6">
			{/* Header Section */}
			<div className="space-y-2">
				<div className="flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3">
							<h1 className="font-bold text-xl">{request.title}</h1>
						</div>
						<p className="mt-1 font-mono text-muted-foreground text-sm">
							{request.requestNumber}
						</p>
					</div>
					<div className="flex items-center gap-2">
						{getPriorityBadge(request.priority)}
						<StatusBadge>{request.status}</StatusBadge>
					</div>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Request Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<FileText className="h-4 w-4" />
							Request Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Description
							</span>
							<p className="mt-1 text-sm">{request.description}</p>
						</div>
						<Separator />
						<div className="grid grid-cols-2 gap-4">
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Type
								</span>
								<div className="mt-1">
									<Badge variant="outline" className="text-xs">
										{request.requestType}
									</Badge>
								</div>
							</div>
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Source
								</span>
								<div className="mt-1 flex items-center gap-1.5">
									{getSourceIcon(request.source)}
									<span className="text-sm">{request.source}</span>
								</div>
							</div>
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Channel
								</span>
								<div className="mt-1 flex items-center gap-1.5">
									{getChannelIcon(request.sourceChannel)}
									<span className="text-sm">
										{getChannelLabel(request.sourceChannel)}
									</span>
								</div>
							</div>
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Priority
								</span>
								<div className="mt-1">{getPriorityBadge(request.priority)}</div>
							</div>
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Status
								</span>
								<div className="mt-1">
									<StatusBadge>{request.status}</StatusBadge>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Client & Assignment */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<User className="h-4 w-4" />
							Client & Assignment
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Client
							</span>
							<div className="mt-1">
								<Link
									href={`/dashboard/clients/${request.clientId}`}
									className="font-medium text-primary text-sm underline-offset-4 hover:underline"
								>
									{request.clientName}
								</Link>
							</div>
						</div>
						<Separator />
						<div>
							<span className="font-medium text-muted-foreground text-xs">
								Assigned To
							</span>
							<div className="mt-1 flex items-center gap-2">
								<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
									<User className="h-3.5 w-3.5 text-primary" />
								</div>
								<span className="text-sm">{request.assignedTo}</span>
							</div>
						</div>
						<Separator />
						<div className="grid grid-cols-2 gap-4">
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Created
								</span>
								<div className="mt-1 flex items-center gap-1.5">
									<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
									<span className="text-sm">
										{formatDate(request.createdAt)}
									</span>
								</div>
							</div>
							<div>
								<span className="font-medium text-muted-foreground text-xs">
									Last Updated
								</span>
								<div className="mt-1 flex items-center gap-1.5">
									<Clock className="h-3.5 w-3.5 text-muted-foreground" />
									<span className="text-sm">
										{formatDate(request.updatedAt)}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Resolution (if resolved) */}
			{request.resolution && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-sm">
							<AlertCircle className="h-4 w-4 text-green-600" />
							Resolution
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm">{request.resolution}</p>
					</CardContent>
				</Card>
			)}

			{/* Activity Timeline */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-sm">
						<Tag className="h-4 w-4" />
						Activity Timeline
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative space-y-0">
						{request.timeline.map((entry, index) => {
							const isLast = index === request.timeline.length - 1;
							return (
								<div key={entry.id} className="relative flex gap-4 pb-6">
									{/* Vertical line */}
									{!isLast && (
										<div className="absolute top-5 left-[9px] h-[calc(100%-8px)] w-[2px] bg-border" />
									)}
									{/* Dot */}
									<div className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
										<CircleDot
											className={`h-5 w-5 ${
												index === 0
													? "text-primary"
													: "text-muted-foreground/60"
											}`}
										/>
									</div>
									{/* Content */}
									<div className="flex-1">
										<div className="flex items-baseline justify-between">
											<p className="font-medium text-sm">{entry.action}</p>
											<span className="text-muted-foreground text-xs">
												{formatDateTime(entry.date)}
											</span>
										</div>
										<p className="mt-0.5 text-muted-foreground text-xs">
											by {entry.user}
										</p>
										{entry.note && (
											<p className="mt-1.5 rounded-md bg-muted/50 p-2 text-sm">
												{entry.note}
											</p>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
