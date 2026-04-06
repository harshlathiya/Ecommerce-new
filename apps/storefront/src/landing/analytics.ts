declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export function initAnalytics(): void {
  if (!GA_ID || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: true });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params ?? {});
}

export function trackCtaClick(
  label: string,
  location: string,
  variant?: string,
): void {
  trackEvent("cta_click", {
    cta_label: label,
    cta_location: location,
    ...(variant ? { ab_variant: variant } : {}),
  });
}
