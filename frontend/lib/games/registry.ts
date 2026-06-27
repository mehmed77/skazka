// Mexanika REGISTRY — o'z-o'zini ro'yxatga oluvchi plugin'lar (markaziy if/elif YO'Q).
// Yangi mexanika = yangi komponent + registerMechanic(...) 1 qator. GamePlayer o'zgarmaydi.
//
// Faza 7: har mexanika QABUL QILADIGAN item turlarini e'lon qiladi (accepts). Sessiya navbati
// aralash (word+letter) bo'lsa, mexanika faqat o'zi qabul qiladiganini ishlatadi (takrorlash
// ikkalasini, eshit_va_bos faqat word, harf_ovi faqat letter). Dars-tur filtri shart emas.
import type { ItemType, MechanicComponent } from "./types";

type Entry = { component: MechanicComponent; accepts: ItemType[] };

const REGISTRY = new Map<string, Entry>();

export function registerMechanic(
  key: string,
  component: MechanicComponent,
  accepts: ItemType[] = ["word"],
): void {
  REGISTRY.set(key, { component, accepts });
}

export function getMechanic(key: string): MechanicComponent | null {
  return REGISTRY.get(key)?.component ?? null;
}

export function getAccepts(key: string): ItemType[] {
  return REGISTRY.get(key)?.accepts ?? ["word"];
}

export function hasMechanic(key: string): boolean {
  return REGISTRY.has(key);
}

export function registeredKeys(): string[] {
  return [...REGISTRY.keys()];
}
