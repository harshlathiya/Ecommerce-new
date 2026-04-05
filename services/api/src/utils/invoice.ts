import { nanoid } from "nanoid";

export function nextInvoiceNumber(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `INV-${y}${m}-${nanoid(8).toUpperCase()}`;
}
