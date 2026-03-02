"use server";

import { actionClient } from "@/lib/safe-action";

import { intakeFormSchema } from "@/features/intake/types";

export const submitIntakeAction = actionClient
	.inputSchema(intakeFormSchema)
	.action(async ({ parsedInput }) => {
		const {
			first_name,
			last_name,
			email,
			phone,
			client_type,
			services,
			notes,
		} = parsedInput;

		try {
			// For the prototype, we log and return success
			// In production, this would insert into Supabase
			console.log("Intake submission received:", {
				first_name,
				last_name,
				email,
				phone,
				client_type,
				services,
				notes,
			});

			// TODO: When Supabase table is created, uncomment:
			// const supabase = await createClient();
			// const { data, error } = await supabase
			//   .from("intake_submissions")
			//   .insert({
			//     first_name,
			//     last_name,
			//     email,
			//     phone,
			//     client_type,
			//     services,
			//     notes: notes || "",
			//     source: "Website",
			//   })
			//   .select()
			//   .single();

			return {
				success: true,
				data: {
					message: "Your information has been submitted successfully.",
				},
			};
		} catch (error) {
			console.error("Intake submission error:", error);
			return {
				success: false,
				data: {
					message: "Something went wrong. Please try again.",
				},
			};
		}
	});
