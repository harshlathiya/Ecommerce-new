export function computeShipping(subtotal: number): number {
  if (subtotal >= 100) return 0;
  return Math.min(15, Math.max(5, subtotal * 0.05));
}
