"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";
import { mockIntakeSubmissions } from "../data/mock-data";
import type { IntakeSubmission } from "../types";
import IntakeDetailView from "./intake-detail-view";
import IntakesKpis from "./intakes-kpis";
import IntakesTable from "./intakes-table";

export default function IntakesContent() {
	const [search, setSearch] = useState("");
	const [selectedSubmission, setSelectedSubmission] =
		useState<IntakeSubmission | null>(null);

	const filteredSubmissions = useMemo(() => {
		if (!search) return mockIntakeSubmissions;
		const searchLower = search.toLowerCase();
		return mockIntakeSubmissions.filter((s) => {
			const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
			return (
				fullName.includes(searchLower) ||
				s.email.toLowerCase().includes(searchLower) ||
				s.phone.includes(search) ||
				s.services.some((svc) => svc.toLowerCase().includes(searchLower))
			);
		});
	}, [search]);

	if (selectedSubmission) {
		return (
			<div className="p-6">
				<IntakeDetailView
					submission={selectedSubmission}
					onBack={() => setSelectedSubmission(null)}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-6">
			<IntakesKpis submissions={mockIntakeSubmissions} />

			{/* Search */}
			<div className="relative max-w-sm">
				<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search by name, email, phone, or service..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-9"
				/>
			</div>

			{/* Results count */}
			<div className="text-muted-foreground text-sm">
				Showing {filteredSubmissions.length} of {mockIntakeSubmissions.length}{" "}
				intake submissions
			</div>

			{/* Table */}
			<IntakesTable
				submissions={filteredSubmissions}
				onSelect={setSelectedSubmission}
			/>
		</div>
	);
}
