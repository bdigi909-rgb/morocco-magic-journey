import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";

import { markOrderStatus } from "@/lib/payments/order-store.server";

/**
 * Real HTTP endpoint — Stripe's servers POST events here directly, so this
 * must be an actual server route (not a createServerFn RPC channel).
 *
 * This is the source of truth for "did the payment actually succeed",
 * independent of whether the customer's browser ever made it back to
 * /confirmation (closed tab, network drop, etc.). The confirmation page is
 * just UX; this webhook is what should trigger real fulfillment (booking
 * confirmation email, marking the trip as paid in a database, etc.).
 *
 * Local testing:
 *   1. Install the Stripe CLI: https://docs.stripe.com/stripe-cli
 *   2. stripe login
 *   3. stripe listen --forward-to localhost:3000/api/checkout/stripe-webhook
 *   4. Copy the "whsec_..." it prints into STRIPE_WEBHOOK_SECRET in .env
 *   5. Trigger a test event: stripe trigger checkout.session.completed
 */
async function handleStripeWebhook(request: Request): Promise<Response> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error(
      "[stripe-webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET missing — see .env.example.",
    );
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  // Signature verification needs the RAW request body — never JSON.parse it
  // first, or the signature check will fail even for legitimate events.
  const rawBody = await request.text();

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id ?? session.metadata?.orderId;
      if (!orderId) {
        console.warn("[stripe-webhook] Completed session without an orderId — ignoring.", session.id);
        break;
      }
      await markOrderStatus(orderId, "paid", session.id);
      // TODO: further real fulfillment could go here — e.g. send a
      // confirmation email, notify ops. Order persistence itself is now
      // handled by Supabase (order-store.server.ts).
      console.info(`[stripe-webhook] Order ${orderId} marked paid (session ${session.id}).`);
      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id ?? session.metadata?.orderId;
      if (orderId) await markOrderStatus(orderId, "failed", session.id);
      break;
    }

    default:
      // Unhandled event types are expected — Stripe sends many kinds of
      // events; we only act on the ones relevant to this checkout flow.
      break;
  }

  // Always 200 once verified & processed, so Stripe stops retrying.
  return Response.json({ received: true });
}

export const Route = createFileRoute("/api/checkout/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => handleStripeWebhook(request),
    },
  },
});
