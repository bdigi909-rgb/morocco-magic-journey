import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import { Slider } from "@/components/ui/slider";
import { stays } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useTrip } from "@/lib/trip-store";

export const Route = createFileRoute("/hebergement")({
  head: () => ({
    meta: [
      { title: "Riads & hôtels au Maroc — Medina Trips" },
      {
        name: "description",
        content:
          "Comparez et réservez riads, hôtels et maisons d'hôtes à Marrakech, Fès, Essaouira et dans le désert.",
      },
      { property: "og:title", content: "Riads & hôtels au Maroc — Medina Trips" },
      {
        property: "og:description",
        content: "Hébergements sélectionnés au Maroc, filtrés par ville, style et budget.",
      },
    ],
  }),
  component: StaysPage,
});

function StaysPage() {
  const { add, format, lang } = useTrip();
  const [city, setCity] = useState("all");
  const [style, setStyle] = useState("all");
  const [maxPrice, setMaxPrice] = useState(200);
  const [nights, setNights] = useState(3);

  const cities = useMemo(() => Array.from(new Set(stays.map((s) => s.city))), []);

  const results = stays.filter(
    (s) =>
      (city === "all" || s.city === city) &&
      (style === "all" || s.style === style) &&
      s.pricePerNight <= maxPrice,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Hébergements</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Riads en médina, hôtels de ville et bivouacs dans le désert — tarifs commissionnés,
        annulation gratuite jusqu'à 48 h.
      </p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Ville</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Riad">Riad</SelectItem>
              <SelectItem value="Hôtel">Hôtel</SelectItem>
              <SelectItem value="Maison d'hôtes">Maison d'hôtes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Budget max : {format(maxPrice)}</Label>
          <Slider
            value={[maxPrice]}
            min={50}
            max={200}
            step={5}
            onValueChange={(v) => setMaxPrice(v[0] ?? 200)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nights">Nuits</Label>
          <Input
            id="nights"
            type="number"
            min={1}
            max={21}
            value={nights}
            onChange={(e) => setNights(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{results.length} établissement(s)</p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s) => (
          <article
            key={s.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
          >
            <img
              src={s.image}
              alt={`${s.style} ${s.name} à ${s.city}`}
              loading="lazy"
              width={1200}
              height={800}
              className="h-44 w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-semibold">{s.name}</h2>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" /> {s.city} · {s.style}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
                  <Star className="size-4 fill-saffron text-saffron" /> {s.rating}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-display text-xl font-semibold text-foreground">
                    {format(s.pricePerNight)}
                  </span>{" "}
                  {t(lang, "night")}
                </p>
                <Button
                  onClick={() => {
                    add({
                      id: `stay-${s.id}`,
                      type: "stay",
                      name: s.name,
                      detail: `${s.city} · ${nights} nuit(s)`,
                      unitPrice: s.pricePerNight * nights,
                    });
                    toast.success(t(lang, "added"), { description: s.name });
                  }}
                >
                  {t(lang, "book")}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
