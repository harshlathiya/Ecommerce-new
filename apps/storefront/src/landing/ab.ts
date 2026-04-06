import type { AbVariant } from "./types.js";

function storageKey(scope: string): string {
  return `ecom_landing_ab_${scope}`;
}

export function resolveAbVariant(
  enabled: boolean | undefined,
  search: string,
  scope: string,
): AbVariant {
  if (!enabled) return "a";
  const params = new URLSearchParams(search);
  const q = params.get("ab");
  if (q === "a" || q === "b") return q;

  const key = storageKey(scope);
  try {
    const existing = localStorage.getItem(key);
    if (existing === "a" || existing === "b") return existing;
    const next: AbVariant = Math.random() < 0.5 ? "a" : "b";
    localStorage.setItem(key, next);
    return next;
  } catch {
    return "a";
  }
}
