"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	CalendarDays,
	ClipboardList,
	FileText,
	TrendingUp,
} from "lucide-react";
import type { IntakeSubmission } from "../types";

interface IntakesKpisProps {
	submissions: IntakeSubmission[];
}

export default function IntakesKpis({ submissions }: IntakesKpisProps) {
	const now = new Date();
	const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

	const thisWeek = submissions.filter(
		(s) => new Date(s.created_at) >= sevenDaysAgo,
	).length;

	const thisMonth = submissions.filter(
		(s) => new Date(s.created_at) >= thirtyDaysAgo,
	).length;

	const totalDocuments = submissions.reduce(
		(sum, s) => sum + s.documents.length,
		0,
	);

	const sourceBreakdown = submissions.reduce(
		(acc, s) => {
			acc[s.source] = (acc[s.source] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<ClipboardList className="h-4 w-4" />
						Total Intakes
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{submissions.length}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-xs">
						All intake submissions received
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<TrendingUp className="h-4 w-4" />
						This Week
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">{thisWeek}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-xs">
						{thisMonth} in the last 30 days
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<FileText className="h-4 w-4" />
						Documents Uploaded
					</CardDescription>
					<CardTitle className="text-3xl tabular-nums">
						{totalDocuments}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-xs">
						Across all submissions
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardDescription className="flex items-center gap-2 text-xs">
						<CalendarDays className="h-4 w-4" />
						By Source
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
						{Object.entries(sourceBreakdown).map(([source, count]) => (
							<span key={source} className="text-muted-foreground">
								{count} {source}
							</span>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
