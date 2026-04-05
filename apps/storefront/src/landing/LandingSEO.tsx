import { Helmet } from "react-helmet-async";
import type { LandingPageConfig } from "./types.js";

function absoluteUrl(path: string): string {
  const base =
    (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${path}`;
}

export function LandingSEO({ config }: { config: LandingPageConfig }) {
  const { meta } = config;
  const url = absoluteUrl(meta.canonicalPath);
  const og = meta.ogImage ?? meta.canonicalPath;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Multi-tenant ecommerce SaaS",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "999",
      priceCurrency: "INR",
      description: "Monthly subscription plans for ecommerce stores",
    },
    description: meta.description,
    url,
  };

  return (
    <Helmet>
      <html lang="en" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta
        property="og:image"
        content={og.startsWith("http") ? og : absoluteUrl(og)}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta
        name="twitter:image"
        content={og.startsWith("http") ? og : absoluteUrl(og)}
      />

      <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
    </Helmet>
  );
}
