"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft, Download, FileText, Mail, Phone, User } from "lucide-react";
import type { IntakeSubmission } from "../types";

interface IntakeDetailViewProps {
	submission: IntakeSubmission;
	onBack: () => void;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function IntakeDetailView({
	submission,
	onBack,
}: IntakeDetailViewProps) {
	return (
		<div className="space-y-6">
			{/* Back button + header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm" onClick={onBack}>
					<ArrowLeft className="mr-1 h-4 w-4" />
					Back
				</Button>
				<div>
					<h2 className="font-semibold text-lg">
						{submission.first_name} {submission.last_name}
					</h2>
					<p className="text-muted-foreground text-sm">
						Submitted {formatDate(submission.created_at)}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Contact Info */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-base">Contact Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="flex items-center gap-3">
								<User className="h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground text-xs">Full Name</p>
									<p className="font-medium text-sm">
										{submission.first_name} {submission.last_name}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground text-xs">Email</p>
									<p className="font-medium text-sm">{submission.email}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground text-xs">Phone</p>
									<p className="font-medium text-sm">{submission.phone}</p>
								</div>
							</div>
							<div>
								<p className="text-muted-foreground text-xs">Client Type</p>
								<Badge variant="outline" className="mt-1">
									{submission.client_type}
								</Badge>
							</div>
						</div>

						<Separator />

						<div>
							<p className="mb-2 text-muted-foreground text-xs">
								Services Interested In
							</p>
							<div className="flex flex-wrap gap-2">
								{submission.services.map((service) => (
									<Badge key={service} variant="secondary">
										{service}
									</Badge>
								))}
							</div>
						</div>

						{submission.notes && (
							<>
								<Separator />
								<div>
									<p className="mb-1 text-muted-foreground text-xs">
										Additional Notes
									</p>
									<p className="text-sm">{submission.notes}</p>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				{/* Metadata */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Submission Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<p className="text-muted-foreground text-xs">Source</p>
							<Badge className="mt-1">{submission.source}</Badge>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Submitted</p>
							<p className="text-sm">{formatDate(submission.created_at)}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Documents</p>
							<p className="text-sm">
								{submission.documents.length} file
								{submission.documents.length !== 1 ? "s" : ""}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Documents */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Uploaded Documents</CardTitle>
					<CardDescription>
						{submission.documents.length > 0
							? `${submission.documents.length} document${submission.documents.length !== 1 ? "s" : ""} uploaded with this submission`
							: "No documents were uploaded with this submission"}
					</CardDescription>
				</CardHeader>
				{submission.documents.length > 0 && (
					<CardContent>
						<div className="space-y-2">
							{submission.documents.map((doc) => (
								<div
									key={doc.id}
									className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3"
								>
									<div className="flex items-center gap-3">
										<FileText className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="font-medium text-sm">{doc.file_name}</p>
											<p className="text-muted-foreground text-xs">
												{formatFileSize(doc.file_size)} &middot; {doc.file_type}
											</p>
										</div>
									</div>
									<Button variant="ghost" size="sm">
										<Download className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
