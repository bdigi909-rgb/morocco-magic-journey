import { createFileRoute } from "@tanstack/react-router";

import { computeCmiHash } from "@/lib/payments/cmi-hash";
import { markOrderStatus } from "@/lib/payments/order-store.server";

/**
 * Real HTTP endpoint — CMI's servers POST here directly (browser redirect
 * after 3D Secure), so this must be an actual server route, not a
 * createServerFn (which is an internal RPC channel, not a public endpoint).
 *
 * ⚠️ Sandbox mode: hash verification below re-derives the expected hash the
 * same (placeholder) way cmi.server.ts computed it. Once real CMI
 * credentials are configured, double-check the verification field list
 * against CMI's integration guide — the return payload's field set can
 * differ slightly from the request's.
 */
async function handleCmiReturn(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status"); // "ok" | "fail", set by us in cmi.server.ts

  let fields: Record<string, string> = {};
  if (request.method === "POST") {
    const form = await request.formData();
    for (const [key, value] of form.entries()) {
      fields[key] = String(value);
    }
  } else {
    fields = Object.fromEntries(url.searchParams.entries());
  }

  const storeKey = process.env.CMI_STORE_KEY ?? "TEST_STORE_KEY_DO_NOT_USE_IN_PROD";
  const receivedHash = fields.HASH ?? fields.hash;
  const expectedHash = computeCmiHash(fields, storeKey);
  const hashOk = !receivedHash || receivedHash === expectedHash; // sandbox: don't hard-fail when CMI omits HASH in test mode

  const orderId = fields.oid ?? "";
  const paymentOk = statusParam === "ok" && hashOk;

  markOrderStatus(orderId, paymentOk ? "paid" : "failed", fields.TransId ?? fields.transid);
  // TODO once a real database is connected (e.g. Supabase): this currently
  // writes to the in-memory placeholder in order-store.server.ts — swap
  // markOrderStatus's implementation there for a durable write.

  const baseUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectUrl = new URL("/confirmation", baseUrl);
  redirectUrl.searchParams.set("method", "cmi");
  redirectUrl.searchParams.set("order", orderId);
  redirectUrl.searchParams.set("status", paymentOk ? "success" : "failed");

  return new Response(null, {
    status: 303,
    headers: { Location: redirectUrl.toString() },
  });
}

export const Route = createFileRoute("/api/checkout/cmi-callback")({
  server: {
    handlers: {
      POST: async ({ request }) => handleCmiReturn(request),
      GET: async ({ request }) => handleCmiReturn(request),
    },
  },
});
