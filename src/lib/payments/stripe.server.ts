import { createServerFn } from "@tanstack/react-start";

import { recordOrder } from "./order-store.server";
import type { CheckoutRequest, StripeCheckoutResult } from "./types";

/**
 * Creates a Stripe Checkout Session for the current cart and returns the
 * hosted checkout URL to redirect the browser to.
 *
 * Requires the "stripe" package (added to package.json) and STRIPE_SECRET_KEY
 * set in the environment. Reads env vars inside the handler (not at module
 * scope) since Start injects per-request env on some runtimes.
 */
export const createStripeCheckout = createServerFn({ method: "POST" })
  .validator((data: CheckoutRequest) => data)
  .handler(async ({ data }): Promise<StripeCheckoutResult> => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured. Add it to your environment (see .env.example).",
      );
    }

    // Lazy import so the "stripe" package is only loaded server-side.
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secretKey);

    const currency = data.currency.toLowerCase(); // stripe wants lowercase iso codes

    // Stripe expects amounts in the smallest currency unit (cents for EUR/USD).
    const toStripeAmount = (amount: number) => Math.round(amount * 100);

    // Bill a single line item for the amount actually due now (handles
    // deposit vs. full payment cleanly without re-deriving cart math on Stripe's side).
    const planLabel = data.plan === "deposit" ? "Acompte (30%)" : "Paiement intégral";

    const baseUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: toStripeAmount(data.amountDue),
            product_data: {
              name: `Medina Trips — ${planLabel}`,
              description: data.items.map((i) => `${i.name} x${i.qty}`).join(", ").slice(0, 500),
            },
          },
          quantity: 1,
        },
      ],
      customer_email: data.email,
      client_reference_id: data.orderId,
      metadata: { orderId: data.orderId, plan: data.plan },
      success_url: `${baseUrl}/confirmation?method=stripe&order=${data.orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/panier?payment=cancelled`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    // Recorded as "pending" now; the webhook (stripe-webhook.ts) is the
    // source of truth that flips this to "paid" once Stripe confirms —
    // don't rely solely on the browser making it back to /confirmation.
    recordOrder({
      orderId: data.orderId,
      method: "stripe",
      currency: data.currency,
      amountDue: data.amountDue,
      email: data.email,
      providerRef: session.id,
    });

    return { url: session.url };
  });
