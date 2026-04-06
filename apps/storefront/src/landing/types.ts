export type AbVariant = "a" | "b";

export interface CtaLink {
  label: string;
  href: string;
}

export interface LandingMeta {
  title: string;
  description: string;
  /** Path only, e.g. /create-ecommerce-website */
  canonicalPath: string;
  ogImage?: string;
  keywords?: string;
}

export interface HeroConfig {
  headline: string;
  headlineVariantB?: string;
  subheadline: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  /** LCP image — should not use lazy loading */
  heroImage?: { src: string; alt: string };
}

export interface TrustBadge {
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: "store" | "box" | "payment" | "truck" | "inventory";
}

export interface UseCaseItem {
  id: string;
  heading: string;
  description: string;
  cta: CtaLink;
  image?: { src: string; alt: string };
}

export interface PricingPlan {
  name: string;
  priceMonthly: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: CtaLink;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LandingPageConfig {
  id: string;
  niche: string;
  path: string;
  meta: LandingMeta;
  abTest?: {
    headline?: boolean;
    ctaLabel?: boolean;
  };
  hero: HeroConfig;
  trustBadges?: TrustBadge[];
  testimonials: Testimonial[];
  partnerLogos?: { name: string; alt: string }[];
  features: FeatureItem[];
  useCases: UseCaseItem[];
  pricingPlans: PricingPlan[];
  faq: FaqItem[];
  finalCta: {
    headline: string;
    subline: string;
    primaryCta: CtaLink;
  };
}
