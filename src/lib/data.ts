import riadImg from "@/assets/riad.jpg";
import soukImg from "@/assets/souk.jpg";
import atlasImg from "@/assets/atlas.jpg";
import desertImg from "@/assets/hero-desert.jpg";
import ouzoudImg from "@/assets/ouzoud.jpg";

export type Money = number; // EUR base

export type Stay = {
  id: string;
  name: string;
  city: string;
  style: "Riad" | "Hôtel" | "Maison d'hôtes";
  rating: number;
  reviews: number;
  pricePerNight: Money;
  image: string;
  tags: string[];
};

export type Excursion = {
  id: string;
  name: string;
  city: string;
  theme: "Désert" | "Montagne" | "Culture" | "Shopping" | "Côte";
  duration: string;
  rating: number;
  reviews: number;
  price: Money;
  image: string;
};

export type Transport = {
  id: string;
  name: string;
  kind: "Location" | "Chauffeur" | "Minibus" | "Transfert";
  pricePerDay: Money;
  seats: number;
};

export type Guide = {
  id: string;
  name: string;
  city: string;
  languages: string[];
  speciality: string;
  pricePerDay: Money;
  rating: number;
};

export const stays: Stay[] = [
  {
    id: "riad-el-fenn",
    name: "Riad El Fenn",
    city: "Marrakech",
    style: "Riad",
    rating: 4.9,
    reviews: 412,
    pricePerNight: 145,
    image: riadImg,
    tags: ["Médina", "Piscine", "Petit-déjeuner inclus"],
  },
  {
    id: "dar-seffarine",
    name: "Dar Seffarine",
    city: "Fès",
    style: "Maison d'hôtes",
    rating: 4.8,
    reviews: 233,
    pricePerNight: 92,
    image: soukImg,
    tags: ["Médina", "Terrasse", "Familial"],
  },
  {
    id: "kasbah-atlas",
    name: "Kasbah Atlas Lodge",
    city: "Ouarzazate",
    style: "Hôtel",
    rating: 4.6,
    reviews: 158,
    pricePerNight: 78,
    image: atlasImg,
    tags: ["Vue montagne", "Demi-pension"],
  },
  {
    id: "camp-merzouga",
    name: "Luxury Camp Merzouga",
    city: "Merzouga",
    style: "Maison d'hôtes",
    rating: 4.9,
    reviews: 501,
    pricePerNight: 120,
    image: desertImg,
    tags: ["Désert", "Dîner berbère", "Bivouac"],
  },
  {
    id: "essaouira-blue",
    name: "Villa Blue Essaouira",
    city: "Essaouira",
    style: "Riad",
    rating: 4.7,
    reviews: 187,
    pricePerNight: 88,
    image: riadImg,
    tags: ["Bord de mer", "Surf", "Calme"],
  },
  {
    id: "casa-business",
    name: "Hôtel Anfa Business",
    city: "Casablanca",
    style: "Hôtel",
    rating: 4.4,
    reviews: 96,
    pricePerNight: 110,
    image: atlasImg,
    tags: ["Aéroport 20 min", "Coworking"],
  },
];

export const excursions: Excursion[] = [
  {
    id: "merzouga-2j",
    name: "Dunes de Merzouga — 2 jours en 4x4",
    city: "Marrakech",
    theme: "Désert",
    duration: "2 jours",
    rating: 4.9,
    reviews: 720,
    price: 189,
    image: desertImg,
  },
  {
    id: "atlas-imlil",
    name: "Vallée d'Imlil & villages berbères",
    city: "Marrakech",
    theme: "Montagne",
    duration: "1 jour",
    rating: 4.7,
    reviews: 340,
    price: 55,
    image: atlasImg,
  },
  {
    id: "souk-guide",
    name: "Souks accompagnés — artisanat & anti-arnaque",
    city: "Marrakech",
    theme: "Shopping",
    duration: "3 h",
    rating: 4.8,
    reviews: 265,
    price: 39,
    image: soukImg,
  },
  {
    id: "fes-medina",
    name: "Médina de Fès & tanneries",
    city: "Fès",
    theme: "Culture",
    duration: "1 jour",
    rating: 4.6,
    reviews: 198,
    price: 48,
    image: soukImg,
  },
  {
    id: "essaouira-day",
    name: "Essaouira, port & remparts",
    city: "Essaouira",
    theme: "Côte",
    duration: "1 jour",
    rating: 4.5,
    reviews: 152,
    price: 45,
    image: riadImg,
  },
  {
    id: "ouzoud",
    name: "Cascades d'Ouzoud",
    city: "Marrakech",
    theme: "Montagne",
    duration: "1 jour",
    rating: 4.7,
    reviews: 410,
    price: 42,
    image: ouzoudImg,
  },
];

export const transports: Transport[] = [
  { id: "dacia", name: "Dacia Duster (sans chauffeur)", kind: "Location", pricePerDay: 38, seats: 5 },
  { id: "berline-chauffeur", name: "Berline avec chauffeur", kind: "Chauffeur", pricePerDay: 95, seats: 4 },
  { id: "minibus", name: "Minibus 15 places + chauffeur", kind: "Minibus", pricePerDay: 160, seats: 15 },
  { id: "transfert-rak", name: "Transfert aéroport Marrakech", kind: "Transfert", pricePerDay: 25, seats: 4 },
];

export const guides: Guide[] = [
  {
    id: "youssef",
    name: "Youssef B.",
    city: "Marrakech",
    languages: ["FR", "EN", "ES"],
    speciality: "Médina & artisanat",
    pricePerDay: 85,
    rating: 4.9,
  },
  {
    id: "hind",
    name: "Hind M.",
    city: "Fès",
    languages: ["FR", "EN"],
    speciality: "Histoire & patrimoine",
    pricePerDay: 80,
    rating: 4.8,
  },
  {
    id: "brahim",
    name: "Brahim O.",
    city: "Merzouga",
    languages: ["FR", "ES"],
    speciality: "Désert & astronomie",
    pricePerDay: 90,
    rating: 5,
  },
];

export type TripStep = {
  id: string;
  city: string;
  nights: number;
  highlight: string;
};

export const defaultItinerary: TripStep[] = [
  { id: "s1", city: "Marrakech", nights: 3, highlight: "Médina, Jardin Majorelle, souks" },
  { id: "s2", city: "Aït-Ben-Haddou", nights: 1, highlight: "Ksar classé UNESCO" },
  { id: "s3", city: "Merzouga", nights: 2, highlight: "Dunes, bivouac, lever de soleil" },
  { id: "s4", city: "Essaouira", nights: 2, highlight: "Port, remparts, plage" },
];

export const cityOptions = [
  "Marrakech",
  "Fès",
  "Chefchaouen",
  "Merzouga",
  "Essaouira",
  "Ouarzazate",
  "Rabat",
  "Casablanca",
  "Agadir",
  "Aït-Ben-Haddou",
];

export const packages = [
  {
    id: "pkg-7j",
    name: "7 jours — Marrakech, Essaouira & Désert",
    nights: 7,
    price: 890,
    image: desertImg,
    includes: ["Riad 4★", "Transport privé", "3 excursions", "Guide 2 jours"],
  },
  {
    id: "pkg-villes",
    name: "10 jours — Villes impériales",
    nights: 10,
    price: 1240,
    image: soukImg,
    includes: ["Hôtels centre-ville", "Chauffeur", "Fès, Meknès, Rabat"],
  },
  {
    id: "pkg-atlas",
    name: "5 jours — Atlas & vallées",
    nights: 5,
    price: 640,
    image: atlasImg,
    includes: ["Lodge montagne", "4x4", "Randonnées guidées"],
  },
];

export const heroImage = desertImg;

// ---- Transport aéroport --------------------------------------------------

export type AirportTransport = {
  id: string;
  city: string;
  airportName: string;
  airportCode: string;
  distanceKm: number;
  bus: {
    line: string;
    operator: string;
    priceOneWay: string;
    priceReturn?: string;
    duration: string;
    frequency: string;
    hours?: string;
    stops?: string;
    note?: string;
  };
  taxi: {
    priceRange: string;
    duration: string;
    note?: string;
  };
};

export const airportTransports: AirportTransport[] = [
  {
    id: "rak",
    city: "Marrakech",
    airportName: "Aéroport Marrakech-Ménara",
    airportCode: "RAK",
    distanceKm: 6,
    bus: {
      line: "Ligne 19 (ALSA)",
      operator: "ALSA",
      priceOneWay: "30 MAD",
      priceReturn: "50 MAD (aller-retour, valable 15 jours)",
      duration: "20-25 min",
      frequency: "toutes les 20-30 min",
      hours: "6h - 23h15",
      stops: "Bab Doukkala, Guéliz, Hivernage, gare ferroviaire, Jemaa el-Fna",
    },
    taxi: {
      priceRange: "≈ 200 MAD (forfait affiché, jour comme nuit)",
      duration: "15-20 min",
      note: "Petits taxis au compteur en théorie, mais forfait souvent appliqué pour l'aéroport — négocier ou demander le compteur avant de monter.",
    },
  },
  {
    id: "cmn",
    city: "Casablanca",
    airportName: "Aéroport Mohammed V",
    airportCode: "CMN",
    distanceKm: 30,
    bus: {
      line: "Train ONCF (recommandé) + bus CTM en alternative",
      operator: "ONCF / CTM",
      priceOneWay: "≈ 40-50 MAD (train, 2ᵉ/1ʳᵉ classe)",
      duration: "35-45 min (train)",
      frequency: "1 train/heure",
      hours: "4h50 - 22h50",
      stops: "Gare souterraine de l'aéroport → Casa Voyageurs / Casa Port",
      note: "Le train est plus rapide et fiable que le bus sur ce trajet (30 km). Le bus CTM existe mais prend ≈ 1h.",
    },
    taxi: {
      priceRange: "≈ 250-300 MAD (grand taxi)",
      duration: "35-60 min selon trafic",
    },
  },
  {
    id: "fez",
    city: "Fès",
    airportName: "Aéroport Fès-Saïss",
    airportCode: "FEZ",
    distanceKm: 15,
    bus: {
      line: "Ligne 16",
      operator: "City Bus Fès",
      priceOneWay: "4 MAD",
      duration: "≈ 40 min",
      frequency: "toutes les 30-60 min",
      stops: "Gare ONCF de Fès",
      note: "Très économique mais peu pratique avec de gros bagages ; peu de passage tard le soir.",
    },
    taxi: {
      priceRange: "120-150 MAD (ville nouvelle) / 150-170 MAD (médina)",
      duration: "20-25 min",
    },
  },
  {
    id: "aga",
    city: "Agadir",
    airportName: "Aéroport Agadir Al Massira",
    airportCode: "AGA",
    distanceKm: 23,
    bus: {
      line: "AE Aerobus (ALSA)",
      operator: "ALSA",
      priceOneWay: "50 MAD",
      priceReturn: "80 MAD (aller-retour)",
      duration: "≈ 50 min",
      frequency: "toutes les heures",
      stops: "Zone balnéaire → pôle Vallée des Oiseaux (centre-ville)",
      note: "Ligne directe dédiée, billetterie disponible dans l'aéroport.",
    },
    taxi: {
      priceRange: "150 MAD (jour) / 200 MAD (après 19h)",
      duration: "≈ 20-35 min",
    },
  },
  {
    id: "tng",
    city: "Tanger",
    airportName: "Aéroport Tanger-Ibn Battouta",
    airportCode: "TNG",
    distanceKm: 12,
    bus: {
      line: "Ligne AE Aerobus (ALSA)",
      operator: "ALSA",
      priceOneWay: "40 MAD",
      duration: "≈ 40 min",
      frequency: "≈ toutes les heures",
      stops: "Gare ferroviaire, Nejma, Moulay Ismail",
    },
    taxi: {
      priceRange: "≈ 90-110 MAD",
      duration: "20-25 min",
    },
  },
];

// ---- Comparateur : location de voiture (affiliation) ----------------------
//
// ⚠️ affiliateUrl pointe vers une recherche générique (non-affiliée) sur des
// comparateurs reconnus au Maroc. Remplace par ton propre lien d'affiliation
// une fois inscrit à un programme partenaire (ex: RentalCars.com Affiliates,
// DiscoverCars.com Affiliate Program, ou un accord direct avec une agence
// locale) — c'est ce lien qui doit porter ton identifiant de commission.

export type CarRentalCategory = {
  id: string;
  name: string;
  examples: string;
  priceRangeMad: string;
  priceRangeEur: string;
  bestFor: string;
  affiliateUrl: string;
};

export const carRentalCategories: CarRentalCategory[] = [
  {
    id: "economique",
    name: "Économique",
    examples: "Dacia Logan, Sandero, Hyundai i10",
    priceRangeMad: "200 - 350 MAD/jour",
    priceRangeEur: "≈ 18 - 32 €/jour",
    bestFor: "Villes, budget serré",
    affiliateUrl: "https://www.discovercars.com/morocco",
  },
  {
    id: "compacte",
    name: "Compacte / Berline",
    examples: "Renault Clio, Peugeot 308, VW Golf",
    priceRangeMad: "300 - 500 MAD/jour",
    priceRangeEur: "≈ 28 - 46 €/jour",
    bestFor: "Trajets entre villes, confort",
    affiliateUrl: "https://www.discovercars.com/morocco",
  },
  {
    id: "suv",
    name: "SUV / Crossover",
    examples: "Dacia Duster, Hyundai Tucson, Kia Sportage",
    priceRangeMad: "450 - 700 MAD/jour",
    priceRangeEur: "≈ 42 - 65 €/jour",
    bestFor: "Routes de montagne, familles",
    affiliateUrl: "https://www.discovercars.com/morocco",
  },
  {
    id: "4x4",
    name: "4x4",
    examples: "Toyota Land Cruiser, Dacia Duster 4x4",
    priceRangeMad: "550 - 900 MAD/jour",
    priceRangeEur: "≈ 51 - 83 €/jour",
    bestFor: "Désert, pistes non goudronnées",
    affiliateUrl: "https://www.discovercars.com/morocco",
  },
  {
    id: "premium",
    name: "Premium / Luxe",
    examples: "Mercedes Classe C, BMW Série 3, Audi A4",
    priceRangeMad: "800 - 2 500 MAD/jour",
    priceRangeEur: "≈ 74 - 230 €/jour",
    bestFor: "Voyage d'affaires, occasion spéciale",
    affiliateUrl: "https://www.discovercars.com/morocco",
  },
];
