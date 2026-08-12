import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-sand/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold">Medina Trips</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Prototype MVP — réservation d'hébergements, excursions et circuits sur mesure au Maroc,
            dans un panier unique.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/hebergement" className="hover:text-foreground">
            Hébergements
          </Link>
          <Link to="/excursions" className="hover:text-foreground">
            Excursions
          </Link>
          <Link to="/circuits" className="hover:text-foreground">
            Configurateur de circuit
          </Link>
          <Link to="/mon-voyage" className="hover:text-foreground">
            Tableau de bord voyage
          </Link>
        </nav>
      </div>
    </footer>
  );
}
