import { createFileRoute } from "@tanstack/react-router";
import { Bus, Car, Clock, Info, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { airportTransports } from "@/lib/data";

export const Route = createFileRoute("/transport-aeroport")({
  head: () => ({
    meta: [
      { title: "Aéroport → Ville : bus, taxi & prix — Medina Trips" },
      {
        name: "description",
        content:
          "Comment rejoindre le centre-ville depuis les principaux aéroports du Maroc : numéros de bus, prix, durée et alternatives taxi pour Marrakech, Casablanca, Fès, Agadir et Tanger.",
      },
      { property: "og:title", content: "Aéroport → Ville : bus, taxi & prix au Maroc" },
      {
        property: "og:description",
        content: "Toutes les options de transport depuis l'aéroport pour les principales villes touristiques du Maroc.",
      },
    ],
  }),
  component: AirportTransportPage,
});

function AirportTransportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Aéroport → Ville</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Vous venez d'atterrir ? Voici comment rejoindre le centre-ville dans les principales
        destinations touristiques du Maroc — numéros de bus, prix et durée, avec l'alternative
        taxi pour comparer.
      </p>
      <p className="mt-3 flex items-start gap-2 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        Prix et fréquences indicatifs, à confirmer sur place — les tarifs des transports publics
        évoluent régulièrement.
      </p>

      <div className="mt-8 space-y-6">
        {airportTransports.map((a) => (
          <article
            key={a.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/60 px-5 py-4">
              <div>
                <h2 className="font-display text-xl font-semibold">{a.city}</h2>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {a.airportName} ({a.airportCode}) ·{" "}
                  {a.distanceKm} km du centre
                </p>
              </div>
            </div>

            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-2">
                  <Bus className="size-4 text-primary" />
                  <h3 className="font-display font-semibold">{a.bus.line}</h3>
                </div>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Prix</dt>
                    <dd className="text-right font-medium">{a.bus.priceOneWay}</dd>
                  </div>
                  {a.bus.priceReturn && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Aller-retour</dt>
                      <dd className="text-right font-medium">{a.bus.priceReturn}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Durée</dt>
                    <dd className="text-right font-medium">{a.bus.duration}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Fréquence</dt>
                    <dd className="text-right font-medium">{a.bus.frequency}</dd>
                  </div>
                  {a.bus.hours && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Horaires</dt>
                      <dd className="text-right font-medium">{a.bus.hours}</dd>
                    </div>
                  )}
                </dl>
                {a.bus.stops && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Arrêts : </span>
                    {a.bus.stops}
                  </p>
                )}
                {a.bus.note && (
                  <p className="mt-2 text-xs italic text-muted-foreground">{a.bus.note}</p>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <Car className="size-4 text-primary" />
                  <h3 className="font-display font-semibold">Taxi</h3>
                </div>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Prix indicatif</dt>
                    <dd className="text-right font-medium">{a.taxi.priceRange}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Durée</dt>
                    <dd className="text-right font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" /> {a.taxi.duration}
                      </span>
                    </dd>
                  </div>
                </dl>
                {a.taxi.note && (
                  <p className="mt-3 text-xs italic text-muted-foreground">{a.taxi.note}</p>
                )}
                <Badge variant="secondary" className="mt-3">
                  Plus rapide, moins d'attente
                </Badge>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
