import { createHash } from "node:crypto";

/**
 * ⚠️ SANDBOX / PLACEHOLDER IMPLEMENTATION
 *
 * This mirrors the "ver3" hash scheme used by CMI's hosted payment page
 * (same family as the Ingenico/ePayment "estv3" gateways CMI is built on):
 *
 *   1. Take every field you're about to submit EXCEPT `hash` / `encoding`.
 *   2. Sort the field names alphabetically.
 *   3. Concatenate their values with "|", escaping any literal "|" as "\|"
 *      and any literal "\" as "\\".
 *   4. Append the store key (secret, server-side only) with a trailing "|".
 *   5. SHA-512 the result and base64-encode it.
 *
 * DO NOT go live with this without checking the exact field list, escaping
 * rules, and hash algorithm version against the integration guide CMI (or
 * your acquiring bank) provides once the merchant account is activated —
 * gateway implementations vary and a mismatch here silently rejects every
 * payment. Until then this only produces internally-consistent sandbox
 * values (same request -> same hash), not a real CMI-accepted signature.
 */
export function computeCmiHash(fields: Record<string, string>, storeKey: string): string {
  const orderedKeys = Object.keys(fields)
    .filter((k) => !["hash", "encoding"].includes(k.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");

  const hashString =
    orderedKeys.map((k) => escape(fields[k] ?? "")).join("|") + "|" + escape(storeKey);

  return createHash("sha512").update(hashString, "utf-8").digest("base64");
}
