import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { t } from "@/lib/i18n";
import { useTrip, type Currency, type Lang } from "@/lib/trip-store";

const links = [
  { to: "/transport-aeroport", key: "nav_transport_airport" },
  { to: "/comparateur", key: "nav_compare" },
  { to: "/hebergement", key: "nav_stays" },
  { to: "/excursions", key: "nav_excursions" },
  { to: "/circuits", key: "nav_circuits" },
  { to: "/mon-voyage", key: "nav_trip" },
] as const;

export function SiteHeader() {
  const { count, currency, setCurrency, lang, setLang } = useTrip();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
            M
          </span>
          <span className="truncate font-display text-lg font-semibold">Medina Trips</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {t(lang, l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <SelectTrigger className="hidden h-9 w-[72px] sm:flex" aria-label="Langue">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">FR</SelectItem>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="es">ES</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="hidden h-9 w-[86px] sm:flex" aria-label="Devise">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="MAD">MAD</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild size="sm" className="relative">
            <Link to="/panier">
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">{t(lang, "nav_cart")}</span>
              {count > 0 && (
                <span className="ml-1 rounded-full bg-primary-foreground/20 px-2 text-xs">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border/70 px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {t(lang, l.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
