import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Download, XCircle } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useTrip } from "@/lib/trip-store";

const searchSchema = z.object({
  method: z.enum(["stripe", "cmi"]).optional(),
  order: z.string().optional(),
  status: z.enum(["success", "failed", "cancelled"]).optional(),
  session_id: z.string().optional(), // stripe checkout session id
});

export const Route = createFileRoute("/confirmation")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Confirmation de paiement — Medina Trips" },
      { name: "description", content: "Récapitulatif de votre réservation et de votre paiement." },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { method, order, status } = Route.useSearch();
  const { items, total, format, confirm, clear } = useTrip();
  const navigate = useNavigate();

  // Stripe's success_url doesn't include a status param — its presence
  // (with a session_id) implies success since Stripe only redirects there
  // after a completed payment.
  const isSuccess = status === "success" || (method === "stripe" && !status);

  useEffect(() => {
    if (isSuccess) confirm();
  }, [isSuccess, confirm]);

  if (!method && !order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Aucune confirmation de paiement à afficher.</p>
        <Button asChild className="mt-4">
          <Link to="/panier">Retour au panier</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      {isSuccess ? (
        <CheckCircle2 className="mx-auto size-14 text-primary" />
      ) : (
        <XCircle className="mx-auto size-14 text-destructive" />
      )}

      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        {isSuccess ? "Paiement confirmé" : "Le paiement n'a pas abouti"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {isSuccess
          ? "Votre réservation est enregistrée. Un e-mail de confirmation vous a été envoyé."
          : "Aucun montant n'a été prélevé. Vous pouvez réessayer depuis votre panier."}
      </p>

      {order && (
        <p className="mt-3 text-sm text-muted-foreground">
          Référence commande : <span className="font-mono">{order}</span>
          {method && <> · {method === "stripe" ? "Stripe" : "CMI"}</>}
        </p>
      )}

      {isSuccess && items.length > 0 && (
        <div className="mt-8 space-y-2 rounded-2xl border border-border bg-card p-5 text-left">
          <h2 className="font-display font-semibold">Récapitulatif</h2>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{i.name}</span>
              <span>{format(i.unitPrice * i.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total voyage</span>
            <span>{format(total)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {isSuccess ? (
          <>
            <Button
              onClick={() => {
                clear();
                navigate({ to: "/mon-voyage" });
              }}
            >
              Voir mon voyage
            </Button>
            <Button variant="outline">
              <Download className="size-4" /> Itinéraire PDF
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link to="/panier">Réessayer le paiement</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
