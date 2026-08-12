import { createClient } from "@supabase/supabase-js";

/**
 * Order persistence backed by Supabase (table: public.orders — see
 * supabase/orders.sql). Uses the SERVICE ROLE key, which must only ever be
 * read server-side (createServerFn handlers / server routes) — never send
 * it to the client, and never use the anon/public key here.
 */

export type OrderStatus = "pending" | "paid" | "failed";

export type Order = {
  orderId: string;
  method: "stripe" | "cmi";
  currency: string;
  amountDue: number;
  email?: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  /** Provider-specific reference (Stripe session id, CMI transaction id, etc.) */
  providerRef?: string;
};

type OrderRow = {
  order_id: string;
  method: "stripe" | "cmi";
  currency: string;
  amount_due: number;
  email: string | null;
  status: OrderStatus;
  provider_ref: string | null;
  created_at: string;
  updated_at: string;
};

let cachedClient: ReturnType<typeof createClient> | undefined;

function getSupabase() {
  if (cachedClient) return cachedClient;
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured — see .env.example. " +
        "Use the service role key here (server-only), never the anon/public key.",
    );
  }
  cachedClient = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  return cachedClient;
}

function fromRow(row: OrderRow): Order {
  return {
    orderId: row.order_id,
    method: row.method,
    currency: row.currency,
    amountDue: row.amount_due,
    email: row.email ?? undefined,
    status: row.status,
    providerRef: row.provider_ref ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

export async function recordOrder(
  order: Omit<Order, "status" | "createdAt" | "updatedAt">,
): Promise<Order> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mmj_orders")
    .insert({
      order_id: order.orderId,
      method: order.method,
      currency: order.currency,
      amount_due: order.amountDue,
      email: order.email ?? null,
      provider_ref: order.providerRef ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error(`[orders] recordOrder failed for ${order.orderId}:`, error.message);
    throw new Error(`Could not record order: ${error.message}`);
  }
  return fromRow(data as OrderRow);
}

export async function markOrderStatus(
  orderId: string,
  status: OrderStatus,
  providerRef?: string,
): Promise<Order | undefined> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mmj_orders")
    .update({
      status,
      ...(providerRef ? { provider_ref: providerRef } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("order_id", orderId)
    .select()
    .maybeSingle();

  if (error) {
    console.error(`[orders] markOrderStatus failed for ${orderId}:`, error.message);
    return undefined;
  }
  if (!data) {
    console.warn(`[orders] markOrderStatus: unknown orderId "${orderId}" (no matching row)`);
    return undefined;
  }
  return fromRow(data as OrderRow);
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mmj_orders")
    .select()
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    console.error(`[orders] getOrder failed for ${orderId}:`, error.message);
    return undefined;
  }
  return data ? fromRow(data as OrderRow) : undefined;
}
