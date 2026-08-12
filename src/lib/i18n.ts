import type { Lang } from "./trip-store";

type Dict = Record<string, { fr: string; en: string; es: string }>;

export const dict: Dict = {
  nav_stays: { fr: "Hébergements", en: "Stays", es: "Alojamientos" },
  nav_transport_airport: { fr: "Aéroport", en: "Airport", es: "Aeropuerto" },
  nav_excursions: { fr: "Excursions", en: "Excursions", es: "Excursiones" },
  nav_circuits: { fr: "Circuits", en: "Trip builder", es: "Circuitos" },
  nav_cart: { fr: "Panier", en: "Cart", es: "Carrito" },
  nav_trip: { fr: "Mon voyage", en: "My trip", es: "Mi viaje" },
  book: { fr: "Ajouter au voyage", en: "Add to trip", es: "Añadir al viaje" },
  added: { fr: "Ajouté à votre voyage", en: "Added to your trip", es: "Añadido a tu viaje" },
  from: { fr: "à partir de", en: "from", es: "desde" },
  night: { fr: "/ nuit", en: "/ night", es: "/ noche" },
  day: { fr: "/ jour", en: "/ day", es: "/ día" },
  person: { fr: "/ pers.", en: "/ person", es: "/ pers." },
};

export function t(lang: Lang, key: keyof typeof dict | string): string {
  const entry = dict[key];
  return entry ? entry[lang] : String(key);
}
