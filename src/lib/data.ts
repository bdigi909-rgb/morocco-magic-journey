import riadImg from "@/assets/riad.jpg";
import soukImg from "@/assets/souk.jpg";
import atlasImg from "@/assets/atlas.jpg";
import desertImg from "@/assets/hero-desert.jpg";

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
    image: atlasImg,
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
