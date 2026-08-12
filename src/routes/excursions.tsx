import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { excursions, guides, transports } from "@/lib/data";
import { t } from "@/lib/i18n";
import { useTrip } from "@/lib/trip-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/excursions")({
  head: () => ({
    meta: [
      { title: "Excursions, transport & guides au Maroc — Medina Trips" },
      {
        name: "description",
        content:
          "Désert de Merzouga, Atlas, cascades d'Ouzoud, souks accompagnés : réservez vos excursions, votre transport local et un guide certifié.",
      },
      { property: "og:title", content: "Excursions & guides au Maroc — Medina Trips" },
      {
        property: "og:description",
        content: "Catalogue d'excursions à la carte, transport local et guides certifiés.",
      },
    ],
  }),
  component: ExcursionsPage,
});

const themes = ["Tous", "Désert", "Montagne", "Culture", "Shopping", "Côte"] as const;

function ExcursionsPage() {
  const { add, format, lang } = useTrip();
  const [theme, setTheme] = useState<string>("Tous");

  const list = excursions.filter((e) => theme === "Tous" || e.theme === theme);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Excursions, transport & guides</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Tout ce qui se passe une fois sur place : sorties à la carte, véhicule avec ou sans
        chauffeur, et accompagnement local.
      </p>

      <Tabs defaultValue="excursions" className="mt-8">
        <TabsList>
          <TabsTrigger value="excursions">Excursions</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="excursions" className="mt-6">
          <div className="flex flex-wrap gap-2">
            {themes.map((th) => (
              <Button
                key={th}
                size="sm"
                variant={theme === th ? "default" : "outline"}
                onClick={() => setTheme(th)}
              >
                {th}
              </Button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <article
                key={e.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
              >
                <img
                  src={e.image}
                  alt={e.name}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-40 w-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <Badge variant="secondary" className="w-fit">
                    {e.theme}
                  </Badge>
                  <h2 className="font-display text-lg font-semibold leading-snug">{e.name}</h2>
                  <p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> {e.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {e.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-saffron text-saffron" /> {e.rating} ({e.reviews})
                    </span>
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-display text-xl font-semibold text-foreground">
                        {format(e.price)}
                      </span>{" "}
                      {t(lang, "person")}
                    </p>
                    <Button
                      onClick={() => {
                        add({
                          id: `exc-${e.id}`,
                          type: "excursion",
                          name: e.name,
                          detail: `${e.city} · ${e.duration}`,
                          unitPrice: e.price,
                        });
                        toast.success(t(lang, "added"), { description: e.name });
                      }}
                    >
                      {t(lang, "book")}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transport" className="mt-6 grid gap-4 sm:grid-cols-2">
          {transports.map((tr) => (
            <div
              key={tr.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="min-w-0">
                <h2 className="font-display font-semibold">{tr.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {tr.kind} · {tr.seats} places · {format(tr.pricePerDay)} {t(lang, "day")}
                </p>
              </div>
              <Button
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  add({
                    id: `tr-${tr.id}`,
                    type: "transport",
                    name: tr.name,
                    detail: `${tr.kind} · ${tr.seats} places`,
                    unitPrice: tr.pricePerDay,
                  });
                  toast.success(t(lang, "added"), { description: tr.name });
                }}
              >
                {t(lang, "book")}
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="guides" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">{g.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {g.city} · {g.speciality}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm">
                  <Star className="size-4 fill-saffron text-saffron" /> {g.rating}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.languages.map((l) => (
                  <Badge key={l} variant="secondary">
                    {l}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  <span className="font-display text-lg font-semibold text-foreground">
                    {format(g.pricePerDay)}
                  </span>{" "}
                  {t(lang, "day")}
                </span>
                <Button
                  variant="outline"
                  onClick={() => {
                    add({
                      id: `guide-${g.id}`,
                      type: "guide",
                      name: `Guide ${g.name}`,
                      detail: `${g.city} · ${g.languages.join("/")}`,
                      unitPrice: g.pricePerDay,
                    });
                    toast.success(t(lang, "added"), { description: g.name });
                  }}
                >
                  {t(lang, "book")}
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
