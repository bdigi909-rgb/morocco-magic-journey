import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, Car, ExternalLink, Map, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { carRentalCategories, packages, stays } from "@/lib/data";
import { useTrip } from "@/lib/trip-store";

export const Route = createFileRoute("/comparateur")({
  head: () => ({
    meta: [
      { title: "Comparateur prix Maroc — voiture, riads, circuits — Medina Trips" },
      {
        name: "description",
        content:
          "Comparez les prix de location de voiture, riads/hôtels, circuits organisés et taxi aéroport au Maroc avant de réserver.",
      },
      { property: "og:title", content: "Comparateur prix Maroc — Medina Trips" },
      {
        property: "og:description",
        content: "Location de voiture, hébergement, circuits organisés : tous les prix indicatifs au même endroit.",
      },
    ],
  }),
  component: ComparateurPage,
});

function ComparateurPage() {
  const { format } = useTrip();

  const stayMin = Math.min(...stays.map((s) => s.pricePerNight));
  const stayMax = Math.max(...stays.map((s) => s.pricePerNight));
  const packageMin = Math.min(...packages.map((p) => p.price));
  const packageMax = Math.max(...packages.map((p) => p.price));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Comparateur de prix</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Renseignez-vous avant de réserver : voici les prix indicatifs du marché pour organiser
        votre séjour au Maroc, tous services confondus.
      </p>

      {/* Location de voiture */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <Car className="size-5 text-primary" />
          <h2 className="font-display text-2xl font-semibold">Location de voiture</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Prix indicatifs, hors haute saison (juillet-août : compter +40 à 60 %).
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {carRentalCategories.map((c) => (
            <div key={c.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold">{c.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{c.examples}</p>
              <p className="mt-3 font-display text-xl font-semibold">{c.priceRangeMad}</p>
              <p className="text-sm text-muted-foreground">{c.priceRangeEur}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Idéal pour : </span>
                {c.bestFor}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a href={c.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored">
                  Voir les offres <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Taxi aéroport */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bus className="size-5 text-primary" />
            <div>
              <h2 className="font-display text-lg font-semibold">Taxi & bus aéroport</h2>
              <p className="text-sm text-muted-foreground">
                Prix et numéros de bus pour Marrakech, Casablanca, Fès, Agadir, Tanger
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/transport-aeroport">Voir le détail</Link>
          </Button>
        </div>
      </section>

      {/* Riads / hôtels */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Riads & hôtels</h2>
            <p className="text-sm text-muted-foreground">
              De {format(stayMin)} {"à "} {format(stayMax)} / nuit selon ville et standing
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/hebergement">Comparer les hébergements</Link>
          </Button>
        </div>
      </section>

      {/* Circuits organisés */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Map className="size-5 text-primary" />
            <div>
              <h2 className="font-display text-lg font-semibold">Circuits organisés</h2>
              <p className="text-sm text-muted-foreground">
                De {format(packageMin)} {"à "} {format(packageMax)} — clé en main ou sur mesure
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/circuits">Voir les circuits</Link>
          </Button>
        </div>
      </section>

      <p className="mt-8 flex items-start gap-2 rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
        <TrendingUp className="mt-0.5 size-4 shrink-0" />
        Ces prix sont indicatifs et évoluent selon la saison. Réservez sur Medina Trips pour
        l'hébergement et les circuits ; pour la location de voiture, comparez et réservez via nos
        partenaires.
      </p>
    </div>
  );
}
