import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Currency = "EUR" | "MAD" | "USD";
export type Lang = "fr" | "en" | "es";

export type CartItem = {
  id: string;
  type: "stay" | "excursion" | "transport" | "guide" | "package";
  name: string;
  detail: string;
  unitPrice: number; // EUR
  qty: number;
};

export type ItineraryStep = { id: string; city: string; nights: number; highlight: string };

const RATES: Record<Currency, number> = { EUR: 1, MAD: 10.85, USD: 1.09 };
const SYMBOL: Record<Currency, string> = { EUR: "€", MAD: "DH", USD: "$" };

type Ctx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  format: (eur: number) => string;
  booked: boolean;
  confirm: () => void;
  itinerary: ItineraryStep[];
  setItinerary: (steps: ItineraryStep[]) => void;
};

const TripContext = createContext<Ctx | null>(null);

const KEY = "atlas-trip-v1";

export function TripProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [lang, setLang] = useState<Lang>("fr");
  const [booked, setBooked] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryStep[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        items?: CartItem[];
        currency?: Currency;
        lang?: Lang;
        booked?: boolean;
        itinerary?: ItineraryStep[];
      };
      if (parsed.items) setItems(parsed.items);
      if (parsed.currency) setCurrency(parsed.currency);
      if (parsed.lang) setLang(parsed.lang);
      if (parsed.booked) setBooked(parsed.booked);
      if (parsed.itinerary) setItinerary(parsed.itinerary);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ items, currency, lang, booked, itinerary }),
      );
    } catch {
      /* ignore */
    }
  }, [items, currency, lang, booked, itinerary]);

  const add: Ctx["add"] = useCallback((item) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i));
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(30, qty)) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const format = useCallback(
    (eur: number) => {
      const value = eur * RATES[currency];
      return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)} ${SYMBOL[currency]}`;
    },
    [currency],
  );

  const total = useMemo(() => items.reduce((s, i) => s + i.unitPrice * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value: Ctx = {
    items,
    add,
    remove,
    setQty,
    clear,
    total,
    count,
    currency,
    setCurrency,
    lang,
    setLang,
    format,
    booked,
    confirm: () => setBooked(true),
    itinerary,
    setItinerary,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside TripProvider");
  return ctx;
}
