import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Landmark, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createCmiPaymentForm } from "@/lib/payments/cmi.server";
import { createStripeCheckout } from "@/lib/payments/stripe.server";
import { defaultMethodForCurrency, type PaymentMethod } from "@/lib/payments/types";
import { useTrip } from "@/lib/trip-store";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier voyage — Medina Trips" },
      {
        name: "description",
        content:
          "Hébergement, transport, excursions et guide réunis dans un panier unique avec paiement en acompte ou intégral.",
      },
      { property: "og:title", content: "Panier voyage — Medina Trips" },
      {
        property: "og:description",
        content: "Un seul panier pour tout votre voyage au Maroc.",
      },
    ],
  }),
  component: CartPage,
});

/** Submits a plain object as a browser-navigating POST form (used for the
 * CMI hosted-payment-page redirect, which needs a real form POST — not a
 * fetch — so the user's browser lands on CMI's 3D Secure page). */
function submitAutoForm(action: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  for (const [key, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

function CartPage() {
  const { items, remove, setQty, total, currency, format, clear } = useTrip();
  const [payment, setPayment] = useState<"full" | "deposit">("deposit");
  const [method, setMethod] = useState<PaymentMethod>(defaultMethodForCurrency(currency));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const deposit = Math.round(total * 0.3);
  const dueNow = payment === "full" ? total : deposit;

  const handlePay = async () => {
    if (items.length === 0) return;
    if (!email) {
      toast.error("Merci de renseigner votre e-mail de confirmation.");
      return;
    }

    setLoading(true);
    const orderId = `MT-${Date.now()}`;

    try {
      if (method === "stripe") {
        const { url } = await createStripeCheckout({
          data: { orderId, items, currency, amountDue: dueNow, plan: payment, email },
        });
        window.location.href = url;
        return; // navigating away
      }

      // CMI expects amounts in MAD — convert if the cart is currently
      // shown in another currency (format() only formats for display,
      // this recomputes the raw MAD amount for the gateway).
      const madAmount = currency === "MAD" ? dueNow : dueNow * 10.85;

      const { action, fields } = await createCmiPaymentForm({
        data: {
          orderId,
          items,
          currency: "MAD",
          amountDue: madAmount,
          plan: payment,
          email,
        },
      });
      submitAutoForm(action, fields);
      // browser navigates to CMI's hosted page — no further code runs here
    } catch (err) {
      console.error(err);
      toast.error("Le paiement n'a pas pu être initié. Réessayez dans un instant.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Votre voyage</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">Votre panier est vide.</p>
          <Button asChild className="mt-4">
            <Link to="/hebergement">Commencer par l'hébergement</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={i.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">{i.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{i.detail}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7"
                      aria-label="Diminuer"
                      onClick={() => setQty(i.id, i.qty - 1)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="text-sm tabular-nums">{i.qty}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7"
                      aria-label="Augmenter"
                      onClick={() => setQty(i.id, i.qty + 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-display font-semibold">
                    {format(i.unitPrice * i.qty)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    aria-label="Retirer"
                    onClick={() => remove(i.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="ghost" onClick={clear}>
              Vider le panier
            </Button>
          </div>

          <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold">Paiement sécurisé</h2>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total voyage</dt>
                <dd className="font-medium">{format(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Frais de service</dt>
                <dd className="font-medium">Inclus</dd>
              </div>
            </dl>

            <div className="space-y-2">
              <Label>Montant à régler</Label>
              <RadioGroup
                value={payment}
                onValueChange={(v) => setPayment(v as "full" | "deposit")}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <RadioGroupItem value="deposit" id="deposit" />
                  <Label htmlFor="deposit" className="cursor-pointer">
                    Acompte 30 % — {format(deposit)}
                  </Label>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="cursor-pointer">
                    Paiement intégral — {format(total)}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Méthode de paiement</Label>
              <RadioGroup
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <RadioGroupItem value="stripe" id="pm-stripe" />
                  <Label htmlFor="pm-stripe" className="flex cursor-pointer items-center gap-2">
                    <CreditCard className="size-4" /> Carte bancaire (Stripe) — EUR / USD
                  </Label>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                  <RadioGroupItem value="cmi" id="pm-cmi" />
                  <Label htmlFor="pm-cmi" className="flex cursor-pointer items-center gap-2">
                    <Landmark className="size-4" /> CMI — paiement local (MAD)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail de confirmation</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button className="w-full" disabled={loading} onClick={handlePay}>
              {loading ? "Redirection en cours…" : `Payer ${format(dueNow)}`}
            </Button>
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              {method === "cmi"
                ? "Paiement CMI en mode sandbox tant que le compte marchand n'est pas activé — aucun débit réel."
                : "Paiement sécurisé via Stripe Checkout."}
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
