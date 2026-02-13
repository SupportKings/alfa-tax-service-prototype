"use client";

import { Link } from "@/components/fastLink";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ArrowLeft, Pencil } from "lucide-react";

interface AdvisoryDetailHeaderProps {
	engagementNumber: string;
	clientName: string;
}

export default function AdvisoryDetailHeader({
	engagementNumber,
	clientName,
}: AdvisoryDetailHeaderProps) {
	return (
		<div className="sticky top-0 z-10 flex h-[45px] flex-shrink-0 items-center justify-between border-border border-b px-4 py-2 lg:px-6">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				<Link
					href="/dashboard/advisory"
					className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Advisory
				</Link>
				<span className="text-muted-foreground">/</span>
				<h1 className="font-medium text-[13px]">
					{engagementNumber} - {clientName}
				</h1>
			</div>
			<Button
				size="sm"
				variant="outline"
				className="flex items-center"
				type="button"
			>
				<Pencil className="mr-[6px] h-4 w-4" />
				Edit
			</Button>
		</div>
	);
}
