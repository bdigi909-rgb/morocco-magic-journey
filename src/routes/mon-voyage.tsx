import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, LifeBuoy, Phone, Ticket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTrip } from "@/lib/trip-store";

export const Route = createFileRoute("/mon-voyage")({
  head: () => ({
    meta: [
      { title: "Mon voyage — itinéraire & contacts | Medina Trips" },
      {
        name: "description",
        content:
          "Tableau de bord voyage : itinéraire jour par jour, réservations, contacts locaux et numéros d'urgence au Maroc.",
      },
      { property: "og:title", content: "Mon voyage — itinéraire & contacts" },
      {
        property: "og:description",
        content: "Suivez votre voyage au Maroc : itinéraire, vouchers et contacts sur place.",
      },
    ],
  }),
  component: TripDashboard,
});

const contacts = [
  { label: "Conciergerie Medina Trips", value: "+212 5 24 00 00 00" },
  { label: "Chauffeur — Hassan", value: "+212 6 61 00 00 00" },
  { label: "Police / Urgences", value: "19 · 15 (SAMU)" },
];

function TripDashboard() {
  const { itinerary, items, total, format, booked } = useTrip();
  const nights = itinerary.reduce((s, x) => s + x.nights, 0);

  let dayCursor = 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-bold sm:text-4xl">Mon voyage</h1>
          <p className="mt-2 text-muted-foreground">
            {booked ? "Réservation confirmée" : "Brouillon"} · {nights} nuit(s) ·{" "}
            {items.length} prestation(s)
          </p>
        </div>
        <Button variant="outline" className="shrink-0">
          <Download className="size-4" /> Itinéraire PDF
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="font-display text-xl font-semibold">Itinéraire jour par jour</h2>
          {itinerary.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground">Aucun itinéraire enregistré pour l'instant.</p>
              <Button asChild className="mt-4">
                <Link to="/circuits">Composer mon circuit</Link>
              </Button>
            </div>
          ) : (
            <ol className="mt-4 space-y-4">
              {itinerary.map((step) => {
                const start = dayCursor;
                dayCursor += step.nights;
                return (
                  <li
                    key={step.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-2xl border border-border bg-card p-5"
                  >
                    <span className="grid h-10 w-14 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-semibold">
                      J{start}
                      {step.nights > 1 ? `-${start + step.nights - 1}` : ""}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold">{step.city}</h3>
                      <p className="text-sm text-muted-foreground">{step.highlight}</p>
                      <Badge variant="secondary" className="mt-2">
                        {step.nights} nuit(s)
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <h2 className="mt-10 font-display text-xl font-semibold">Réservations & vouchers</h2>
          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune prestation réservée.</p>
            )}
            {items.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Ticket className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.detail}</p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-medium">
                  {format(i.unitPrice * i.qty)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <div>
            <p className="text-sm text-muted-foreground">Total voyage</p>
            <p className="font-display text-2xl font-semibold">{format(total)}</p>
          </div>
          <Separator />
          <div>
            <h2 className="flex items-center gap-2 font-display font-semibold">
              <Phone className="size-4" /> Contacts sur place
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {contacts.map((c) => (
                <li key={c.label} className="flex flex-col">
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="font-medium">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <LifeBuoy className="mt-0.5 size-4 shrink-0" />
            Assistance 7j/7 en français, anglais et espagnol pendant tout le séjour.
          </p>
        </aside>
      </div>
    </div>
  );
}
