import type { Metadata } from "next";

import IntakeForm from "@/features/intake/components/intake-form";

export const metadata: Metadata = {
	title: "Get Started | Alfa Tax Services",
	description:
		"Start your tax journey with Alfa Tax Services. Fill out our intake form to get started.",
};

export default function IntakePage() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
			<div className="mb-10 text-center">
				<h1 className="mb-3 font-bold text-3xl tracking-tight">
					Get Started with Alfa Tax Services
				</h1>
				<p className="text-muted-foreground">
					Fill out the form below and our team will reach out to get you set up.
					It only takes a few minutes.
				</p>
			</div>

			<div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
				<IntakeForm />
			</div>
		</div>
	);
}
