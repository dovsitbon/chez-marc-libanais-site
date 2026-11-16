import carte from "@/data/carte.json";
import type { Locale } from "@/lib/locales";

// La carte (data/carte.json), typée.

export type Text = { name: string; desc: string; note?: string };
export type Item = {
  id: string;
  price: number | null;
  arabic: string;
  translit: string;
  photo?: string;
  signature?: boolean;
  veg?: boolean;
  check?: boolean;
} & Record<Locale, Text>;
export type CategoryId = "froids" | "chauds" | "grillades" | "menus" | "desserts" | "boissons";
export type Category = { id: CategoryId; items: Item[] } & Record<Locale, string>;

export const CATEGORIES = carte.categories as Category[];
export const CHECKED = carte.checked;

const all = new Map<string, Item>(CATEGORIES.flatMap((c) => c.items.map((i) => [i.id, i] as const)));
export const itemById = (id: string) => all.get(id) ?? null;
export const categoryOf = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;
