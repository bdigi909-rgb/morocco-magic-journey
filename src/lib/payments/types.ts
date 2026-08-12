import type { CartItem, Currency } from "@/lib/trip-store";

export type PaymentMethod = "stripe" | "cmi";

export type PaymentPlan = "full" | "deposit";

export type CheckoutRequest = {
  orderId: string;
  items: CartItem[];
  currency: Currency;
  /** Amount actually due now, in the given currency's smallest reasonable unit (not cents) */
  amountDue: number;
  plan: PaymentPlan;
  email?: string;
};

export type StripeCheckoutResult = {
  url: string;
};

export type CmiCheckoutResult = {
  /** URL to POST the auto-submit form to (CMI's hosted payment page) */
  action: string;
  /** Form fields to submit, including the computed HASH */
  fields: Record<string, string>;
};

/** Recommend a default payment method based on the selected currency. */
export function defaultMethodForCurrency(currency: Currency): PaymentMethod {
  return currency === "MAD" ? "cmi" : "stripe";
}
