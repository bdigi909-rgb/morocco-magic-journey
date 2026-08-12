import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cityOptions, defaultItinerary, packages } from "@/lib/data";
import { useTrip, type ItineraryStep } from "@/lib/trip-store";

export const Route = createFileRoute("/circuits")({
  head: () => ({
    meta: [
      { title: "Configurateur de circuit au Maroc — Medina Trips" },
      {
        name: "description",
        content:
          "Composez votre circuit étape par étape : villes, nombre de nuits, budget estimé, ou partez d'un circuit clé en main.",
      },
      { property: "og:title", content: "Configurateur de circuit au Maroc" },
      {
        property: "og:description",
        content: "Construisez un itinéraire sur mesure au Maroc et estimez son budget en direct.",
      },
    ],
  }),
  component: CircuitsPage,
});

const PER_NIGHT = 110; // hébergement + transport + activités, estimation EUR / pers.

function CircuitsPage() {
  const { format, add, setItinerary } = useTrip();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<ItineraryStep[]>(defaultItinerary);
  const [newCity, setNewCity] = useState(cityOptions[0]!);
  const [travellers, setTravellers] = useState(2);

  const totalNights = steps.reduce((s, x) => s + x.nights, 0);
  const estimate = totalNights * PER_NIGHT * travellers;

  const move = (index: number, dir: -1 | 1) => {
    const next = [...steps];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    setSteps(next);
  };

  const setNights = (id: string, delta: number) =>
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, nights: Math.max(1, s.nights + delta) } : s)),
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Configurateur de circuit</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Ajoutez, réordonnez et ajustez vos étapes. Le budget estimé se met à jour en direct.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-display font-semibold">{s.city}</h2>
                <p className="truncate text-sm text-muted-foreground">{s.highlight}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    aria-label="Retirer une nuit"
                    onClick={() => setNights(s.id, -1)}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="text-sm tabular-nums">{s.nights} nuit(s)</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    aria-label="Ajouter une nuit"
                    onClick={() => setNights(s.id, 1)}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="Monter"
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="Descendre"
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-destructive"
                  aria-label="Supprimer l'étape"
                  onClick={() => setSteps((prev) => prev.filter((x) => x.id !== s.id))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-border p-4">
            <div className="min-w-[180px] flex-1 space-y-2">
              <Label>Ajouter une étape</Label>
              <Select value={newCity} onValueChange={setNewCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setSteps((prev) => [
                  ...prev,
                  {
                    id: `s${Date.now()}`,
                    city: newCity,
                    nights: 2,
                    highlight: "Étape libre — à personnaliser",
                  },
                ])
              }
            >
              <Plus className="size-4" /> Ajouter
            </Button>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Récapitulatif</h2>
          <div className="space-y-2">
            <Label>Voyageurs</Label>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                aria-label="Moins de voyageurs"
                onClick={() => setTravellers((v) => Math.max(1, v - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center tabular-nums">{travellers}</span>
              <Button
                size="icon"
                variant="outline"
                aria-label="Plus de voyageurs"
                onClick={() => setTravellers((v) => Math.min(20, v + 1))}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Étapes</dt>
              <dd>{steps.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Nuits</dt>
              <dd>{totalNights}</dd>
            </div>
          </dl>
          <p className="rounded-xl bg-secondary p-3 text-sm">
            Budget estimé
            <span className="mt-1 block font-display text-2xl font-semibold">
              {format(estimate)}
            </span>
          </p>
          <Button
            className="w-full"
            disabled={steps.length === 0}
            onClick={() => {
              setItinerary(steps);
              add({
                id: `circuit-${totalNights}n-${steps.length}e`,
                type: "package",
                name: `Circuit sur mesure — ${steps.map((s) => s.city).join(" › ")}`,
                detail: `${totalNights} nuits · ${travellers} voyageur(s)`,
                unitPrice: estimate,
              });
              toast.success("Circuit ajouté au panier");
              navigate({ to: "/panier" });
            }}
          >
            Ajouter ce circuit au panier
          </Button>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold">Circuits clé en main</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <article
              key={p.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={1200}
                height={800}
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-display text-lg font-semibold leading-snug">{p.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.includes.map((inc) => (
                    <Badge key={inc} variant="secondary">
                      {inc}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="font-display text-xl font-semibold">{format(p.price)}</span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      add({
                        id: `pkg-${p.id}`,
                        type: "package",
                        name: p.name,
                        detail: `${p.nights} nuits · tout compris`,
                        unitPrice: p.price,
                      });
                      toast.success("Circuit ajouté au panier", { description: p.name });
                    }}
                  >
                    Réserver
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
