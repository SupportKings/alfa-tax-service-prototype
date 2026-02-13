// ============================
// Service Subscription Types for Alfa Tax Service Prototype
// ============================

export type SubscriptionStatus =
	| "Pending Setup"
	| "Active - Current"
	| "Active - Behind"
	| "Paused"
	| "Cancelled"
	| "Completed";

export type ServiceFrequency =
	| "One-Time"
	| "Monthly"
	| "Quarterly"
	| "Annually";

export type OfferType = "Tax" | "Bookkeeping" | "Advisory" | "Formation";

export interface ServiceOffer {
	id: string;
	name: string;
	offer_type: OfferType;
	price: number;
	billing_frequency: ServiceFrequency;
	is_active: boolean;
}

export interface ServiceSubscription {
	id: string;
	client_id: string;
	client_name: string;
	client_type: "Individual" | "Business";
	offer_id: string;
	service_name: string;
	offer_type: OfferType;
	status: SubscriptionStatus;
	price: number;
	frequency: ServiceFrequency;
	start_date: string;
	end_date: string | null;
	internal_notes: string;
	created_at: string;
	// Detail-view related data
	payments: SubscriptionPayment[];
	activity: SubscriptionActivity[];
}

export interface SubscriptionPayment {
	id: string;
	subscription_id: string;
	amount: number;
	payment_method: "Credit Card" | "Check" | "Cash" | "Bank Transfer";
	status: "Pending" | "Completed" | "Failed" | "Refunded";
	paid_at: string;
}

export interface SubscriptionActivity {
	id: string;
	subscription_id: string;
	action: string;
	description: string;
	performed_by: string;
	occurred_at: string;
}

// ============================
// Chart Data Types
// ============================

export interface MonthlyRevenueData {
	month: string;
	revenue: number;
}

export interface StatusDistributionData {
	status: string;
	count: number;
	color: string;
}
