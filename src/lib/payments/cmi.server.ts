import { createServerFn } from "@tanstack/react-start";

import { computeCmiHash } from "./cmi-hash";
import { recordOrder } from "./order-store.server";
import type { CheckoutRequest, CmiCheckoutResult } from "./types";

/**
 * Builds the field set + security hash for a CMI hosted-payment-page
 * redirect. The storeKey NEVER leaves the server — only the resulting
 * hash is sent to the browser as part of the auto-submit form.
 *
 * ⚠️ Sandbox mode: until CMI_CLIENT_ID / CMI_STORE_KEY / CMI_API_URL are set
 * in the environment (real values arrive once the merchant account is
 * activated), this falls back to clearly-fake test values so the flow can
 * still be exercised end-to-end in development. See .env.example.
 */
export const createCmiPaymentForm = createServerFn({ method: "POST" })
  .validator((data: CheckoutRequest) => data)
  .handler(async ({ data }): Promise<CmiCheckoutResult> => {
    const clientId = process.env.CMI_CLIENT_ID ?? "TEST_CLIENT_ID"; // placeholder — replace once activated
    const storeKey = process.env.CMI_STORE_KEY ?? "TEST_STORE_KEY_DO_NOT_USE_IN_PROD";
    const apiUrl = process.env.CMI_API_URL ?? "https://testpayment.cmi.co.ma/fim/est3Dgate";
    const baseUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:3000";

    if (!process.env.CMI_STORE_KEY) {
      console.warn(
        "[CMI] CMI_STORE_KEY is not set — using a sandbox placeholder. " +
          "Real payments will NOT work until real merchant credentials are configured.",
      );
    }

    const fields: Record<string, string> = {
      clientid: clientId,
      oid: data.orderId,
      amount: data.amountDue.toFixed(2),
      currency: "504", // ISO 4217 numeric code for MAD
      okUrl: `${baseUrl}/api/checkout/cmi-callback?status=ok`,
      failUrl: `${baseUrl}/api/checkout/cmi-callback?status=fail`,
      rnd: Date.now().toString(),
      hashAlgorithm: "ver3",
      storetype: "3d_pay",
      lang: "fr",
      email: data.email ?? "",
      // Free-form order description, kept short for the gateway's field limits.
      TranType: "Auth",
    };

    const hash = computeCmiHash(fields, storeKey);

    recordOrder({
      orderId: data.orderId,
      method: "cmi",
      currency: data.currency,
      amountDue: data.amountDue,
      email: data.email,
    });

    return {
      action: apiUrl,
      fields: { ...fields, HASH: hash },
    };
  });
