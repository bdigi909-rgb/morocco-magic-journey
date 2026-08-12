import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bed, Car, Compass, Map, ShoppingBasket, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImg from "@/assets/hero-desert.jpg";
import { packages } from "@/lib/data";
import { useTrip } from "@/lib/trip-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medina Trips — tout votre voyage au Maroc en un seul panier" },
      {
        name: "description",
        content:
          "Riads, transport, excursions, guides et circuits sur mesure au Maroc : planifiez, réservez et suivez tout votre séjour depuis une seule plateforme.",
      },
      { property: "og:title", content: "Medina Trips — votre voyage au Maroc, de A à Z" },
      {
        property: "og:description",
        content:
          "Hébergement, transport local, excursions, guides et circuits sur mesure réunis dans un panier unique.",
      },
    ],
  }),
  component: Index,
});

const modules = [
  { icon: Bed, title: "Hébergement", text: "Riads, hôtels et maisons d'hôtes vérifiés." },
  { icon: Car, title: "Transport local", text: "Location, chauffeur, minibus, transferts." },
  { icon: Compass, title: "Excursions", text: "Désert, Atlas, cascades, villes impériales." },
  { icon: Map, title: "Circuits sur mesure", text: "Étapes modulables, budget en direct." },
  { icon: UserRound, title: "Guides certifiés", text: "FR / EN / ES, par ville ou séjour." },
  { icon: ShoppingBasket, title: "Shopping accompagné", text: "Souks & artisanat, sans arnaque." },
];

function Index() {
  const { format } = useTrip();
  const navigate = useNavigate();
  const [travellers, setTravellers] = useState(2);
  const [style, setStyle] = useState("mix");

  return (
    <div>
      <section className="relative">
        <img
          src={heroImg}
          alt="Dunes du Sahara marocain au coucher du soleil"
          width={1920}
          height={1080}
          className="h-[70vh] min-h-[460px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Maroc · Europe → Marrakech, Fès, Sahara
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
              Tout votre voyage au Maroc, dans un seul panier.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Du billet d'avion au retour : hébergement, transport, excursions, guide et shopping
              accompagné — réservés en une fois, suivis jour par jour.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="from">Départ</Label>
            <Input id="from" defaultValue="Paris (CDG)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start">Dates</Label>
            <Input id="start" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pax">Voyageurs</Label>
            <Input
              id="pax"
              type="number"
              min={1}
              max={20}
              value={travellers}
              onChange={(e) => setTravellers(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div className="space-y-2">
            <Label>Type de voyage</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detente">Détente</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
                <SelectItem value="aventure">Aventure</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="mix">Mix</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="self-end" onClick={() => navigate({ to: "/circuits" })}>
            Planifier mon voyage
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Six modules, un parcours continu
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.title} className="rounded-2xl border border-border bg-card p-5">
              <m.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-display font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Circuits clé en main</h2>
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/circuits">Tout voir</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <Link
              key={p.id}
              to="/circuits"
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={1200}
                height={800}
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-lg font-semibold leading-snug">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.includes.join(" · ")}</p>
                <p className="mt-auto pt-3 font-display text-xl font-semibold">
                  {format(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
