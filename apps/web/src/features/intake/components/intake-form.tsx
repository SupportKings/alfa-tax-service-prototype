"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitIntakeAction } from "@/features/intake/actions/submitIntake";
import {
	CLIENT_TYPE_OPTIONS,
	type ClientTypeOption,
	type IntakeFormInput,
	intakeFormSchema,
	SERVICE_OPTIONS,
	type ServiceOption,
} from "@/features/intake/types";

import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

export default function IntakeForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [files, setFiles] = useState<File[]>([]);

	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		client_type: "" as ClientTypeOption | "",
		services: [] as ServiceOption[],
		notes: "",
	});

	function updateField(field: string, value: string) {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	}

	function toggleService(service: ServiceOption) {
		setFormData((prev) => ({
			...prev,
			services: prev.services.includes(service)
				? prev.services.filter((s) => s !== service)
				: [...prev.services, service],
		}));
		if (errors.services) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next.services;
				return next;
			});
		}
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const selectedFiles = e.target.files;
		if (selectedFiles) {
			setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
		}
		e.target.value = "";
	}

	function removeFile(index: number) {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErrors({});

		const validation = intakeFormSchema.safeParse(formData);
		if (!validation.success) {
			const fieldErrors: Record<string, string> = {};
			for (const issue of validation.error.issues) {
				const field = issue.path[0]?.toString();
				if (field && !fieldErrors[field]) {
					fieldErrors[field] = issue.message;
				}
			}
			setErrors(fieldErrors);
			return;
		}

		setIsSubmitting(true);
		try {
			const result = await submitIntakeAction(
				validation.data as IntakeFormInput,
			);
			if (result?.data?.success) {
				setIsSubmitted(true);
			} else {
				setErrors({ _form: "Something went wrong. Please try again." });
			}
		} catch {
			setErrors({ _form: "Something went wrong. Please try again." });
		} finally {
			setIsSubmitting(false);
		}
	}

	if (isSubmitted) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
					<CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
				</div>
				<h2 className="mb-2 font-semibold text-2xl">Thank You!</h2>
				<p className="mb-1 max-w-md text-muted-foreground">
					Your information has been submitted successfully. Our team will review
					your submission and be in touch shortly.
				</p>
				<p className="text-muted-foreground text-sm">
					If you have any questions, feel free to reach out to us directly.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{errors._form && (
				<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
					{errors._form}
				</div>
			)}

			{/* Personal Information */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Personal Information</h3>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="first_name">First Name *</Label>
						<Input
							id="first_name"
							placeholder="Enter your first name"
							value={formData.first_name}
							onChange={(e) => updateField("first_name", e.target.value)}
						/>
						{errors.first_name && (
							<p className="text-red-500 text-sm">{errors.first_name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="last_name">Last Name *</Label>
						<Input
							id="last_name"
							placeholder="Enter your last name"
							value={formData.last_name}
							onChange={(e) => updateField("last_name", e.target.value)}
						/>
						{errors.last_name && (
							<p className="text-red-500 text-sm">{errors.last_name}</p>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="email">Email *</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={(e) => updateField("email", e.target.value)}
						/>
						{errors.email && (
							<p className="text-red-500 text-sm">{errors.email}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number *</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="(210) 555-0100"
							value={formData.phone}
							onChange={(e) => updateField("phone", e.target.value)}
						/>
						{errors.phone && (
							<p className="text-red-500 text-sm">{errors.phone}</p>
						)}
					</div>
				</div>
			</div>

			{/* Client Type */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">
					Are you filing as an individual or a business?
				</h3>
				<div className="flex gap-3">
					{CLIENT_TYPE_OPTIONS.map((type) => (
						<button
							key={type}
							type="button"
							onClick={() => updateField("client_type", type)}
							className={`rounded-lg border px-6 py-3 font-medium text-sm transition-colors ${
								formData.client_type === type
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50 hover:bg-muted"
							}`}
						>
							{type}
						</button>
					))}
				</div>
				{errors.client_type && (
					<p className="text-red-500 text-sm">{errors.client_type}</p>
				)}
			</div>

			{/* Services */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">
					What services are you interested in? *
				</h3>
				<p className="text-muted-foreground text-sm">Select all that apply.</p>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{SERVICE_OPTIONS.map((service) => (
						<label
							key={service}
							className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
								formData.services.includes(service)
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50 hover:bg-muted"
							}`}
						>
							<Checkbox
								checked={formData.services.includes(service)}
								onCheckedChange={() => toggleService(service)}
							/>
							<span className="text-sm">{service}</span>
						</label>
					))}
				</div>
				{errors.services && (
					<p className="text-red-500 text-sm">{errors.services}</p>
				)}
			</div>

			{/* Document Upload */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Upload Documents</h3>
				<p className="text-muted-foreground text-sm">
					Upload any relevant documents (W-2s, 1099s, prior returns, etc.). This
					is optional — you can always provide documents later.
				</p>

				<div className="rounded-lg border-2 border-border border-dashed p-6 text-center transition-colors hover:border-primary/50">
					<Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
					<p className="mb-2 text-sm">
						<label
							htmlFor="file-upload"
							className="cursor-pointer font-medium text-primary hover:underline"
						>
							Click to upload
						</label>{" "}
						or drag and drop
					</p>
					<p className="text-muted-foreground text-xs">
						PDF, JPG, PNG up to 10MB each
					</p>
					<input
						id="file-upload"
						type="file"
						multiple
						accept=".pdf,.jpg,.jpeg,.png"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>

				{files.length > 0 && (
					<div className="space-y-2">
						{files.map((file, index) => (
							<div
								key={`${file.name}-${index}`}
								className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2"
							>
								<div className="flex items-center gap-3 truncate">
									<span className="truncate text-sm">{file.name}</span>
									<span className="whitespace-nowrap text-muted-foreground text-xs">
										{formatFileSize(file.size)}
									</span>
								</div>
								<button
									type="button"
									onClick={() => removeFile(index)}
									className="ml-2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Additional Notes */}
			<div className="space-y-4">
				<h3 className="font-medium text-lg">Additional Notes</h3>
				<Textarea
					placeholder="Anything else you'd like us to know? (optional)"
					value={formData.notes}
					onChange={(e) => updateField("notes", e.target.value)}
					rows={4}
				/>
				{errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
			</div>

			{/* Submit */}
			<div className="border-t pt-6">
				<Button
					type="submit"
					size="lg"
					className="w-full sm:w-auto"
					disabled={isSubmitting}
				>
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Submit
				</Button>
			</div>
		</form>
	);
}
