"use client";

import type * as React from "react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/components/ui/sidebar";

import {
	BarChart3,
	DollarSign,
	FolderOpen,
	Settings,
	UsersRound,
} from "lucide-react";
import { SidebarItemComponent } from "./sidebar-item";

export function NavSecondary({
	...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					<SidebarItemComponent
						href="/dashboard/payments"
						label="Payments"
						icon={<DollarSign size={16} />}
						badge="Soon"
					/>
					<SidebarItemComponent
						href="/dashboard/documents"
						label="Documents"
						icon={<FolderOpen size={16} />}
						badge="Soon"
					/>
					<SidebarItemComponent
						href="/dashboard/reports"
						label="Reports"
						icon={<BarChart3 size={16} />}
						badge="Soon"
					/>
					<SidebarItemComponent
						href="/dashboard/team-members"
						label="Team"
						icon={<UsersRound size={16} />}
					/>
					<SidebarItemComponent
						href="/dashboard/settings/profile"
						label="Settings"
						icon={<Settings size={16} />}
					/>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
