import { createFileRoute } from "@tanstack/react-router";
import { Landmark, Music, ScrollText, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customTips, historyTimeline, monuments, musicGenres } from "@/lib/data";

export const Route = createFileRoute("/culture")({
  head: () => ({
    meta: [
      { title: "Culture & histoire du Maroc — Medina Trips" },
      {
        name: "description",
        content:
          "Découvrez l'histoire du Maroc, ses monuments incontournables, les coutumes à connaître et la musique traditionnelle avant votre voyage.",
      },
      { property: "og:title", content: "Culture & histoire du Maroc" },
      {
        property: "og:description",
        content: "Dynasties, monuments, coutumes et musique : préparez votre voyage en connaissant le Maroc.",
      },
    ],
  }),
  component: CulturePage,
});

function CulturePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Culture & découverte</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Un peu de contexte avant de partir : l'histoire, les monuments, les coutumes et la
        musique qui font l'âme du Maroc.
      </p>

      <Tabs defaultValue="histoire" className="mt-8">
        <TabsList>
          <TabsTrigger value="histoire">Histoire</TabsTrigger>
          <TabsTrigger value="monuments">Monuments</TabsTrigger>
          <TabsTrigger value="coutumes">Coutumes</TabsTrigger>
          <TabsTrigger value="musique">Musique</TabsTrigger>
        </TabsList>

        {/* Histoire */}
        <TabsContent value="histoire" className="mt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ScrollText className="size-4" />
            <p className="text-sm">Des origines à l'indépendance, en six grandes périodes.</p>
          </div>
          <ol className="mt-5 space-y-4">
            {historyTimeline.map((h, i) => (
              <li key={h.id} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    {h.period}
                  </p>
                  <h3 className="mt-0.5 font-display font-semibold">{h.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>

        {/* Monuments */}
        <TabsContent value="monuments" className="mt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Landmark className="size-4" />
            <p className="text-sm">Neuf sites incontournables à travers les villes impériales.</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {monuments.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-semibold">{m.name}</h3>
                  <Badge variant="secondary" className="shrink-0">
                    {m.city}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.period}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Coutumes */}
        <TabsContent value="coutumes" className="mt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            <p className="text-sm">Quelques repères pour voyager avec respect et aisance.</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {customTips.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Musique */}
        <TabsContent value="musique" className="mt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Music className="size-4" />
            <p className="text-sm">Quatre grandes traditions musicales, entre transe et poésie.</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {musicGenres.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display font-semibold">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.origin}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Instruments : </span>
                  {m.instruments}
                </p>
                {m.festival && (
                  <Badge variant="secondary" className="mt-3">
                    {m.festival}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
