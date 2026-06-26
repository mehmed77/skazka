// Mexanika REGISTRY — o'z-o'zini ro'yxatga oluvchi plugin'lar (markaziy if/elif YO'Q).
// Yangi mexanika = yangi komponent + registerMechanic(...) 1 qator. GamePlayer o'zgarmaydi.
import type { MechanicComponent } from "./types";

const REGISTRY = new Map<string, MechanicComponent>();

export function registerMechanic(key: string, component: MechanicComponent): void {
  REGISTRY.set(key, component);
}

export function getMechanic(key: string): MechanicComponent | null {
  return REGISTRY.get(key) ?? null;
}

export function hasMechanic(key: string): boolean {
  return REGISTRY.has(key);
}

export function registeredKeys(): string[] {
  return [...REGISTRY.keys()];
}
