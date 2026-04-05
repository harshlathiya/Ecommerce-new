import type { HeroConfig, TrustBadge } from "./types.js";
import { trackCtaClick } from "./analytics.js";

interface HeroProps {
  config: HeroConfig;
  abVariant: "a" | "b";
  headlineOverride?: string;
  primaryCtaLabelOverride?: string;
  trustBadges?: TrustBadge[];
}

export function Hero({
  config,
  abVariant,
  headlineOverride,
  primaryCtaLabelOverride,
  trustBadges,
}: HeroProps) {
  const headline =
    headlineOverride ??
    (abVariant === "b" && config.headlineVariantB
      ? config.headlineVariantB
      : config.headline);
  const primaryLabel = primaryCtaLabelOverride ?? config.primaryCta.label;

  return (
    <section className="lp-hero" aria-labelledby="lp-hero-heading">
      <div className="lp-hero__grid">
        <div className="lp-hero__copy">
          <p className="lp-eyebrow">Multi-tenant ecommerce SaaS</p>
          <h1 id="lp-hero-heading" className="lp-hero__title">
            {headline}
          </h1>
          <p className="lp-hero__sub">{config.subheadline}</p>
          <div className="lp-hero__ctas">
            <a
              className="lp-btn lp-btn--primary"
              href={config.primaryCta.href}
              data-ab-variant={abVariant}
              onClick={() =>
                trackCtaClick(primaryLabel, "hero_primary", abVariant)
              }
            >
              {primaryLabel}
            </a>
            <a
              className="lp-btn lp-btn--ghost"
              href={config.secondaryCta.href}
              onClick={() =>
                trackCtaClick(config.secondaryCta.label, "hero_secondary", abVariant)
              }
            >
              {config.secondaryCta.label}
            </a>
          </div>
          {trustBadges?.length ? (
            <ul className="lp-trust-badges">
              {trustBadges.map((b) => (
                <li key={b.label} className="lp-trust-badges__item">
                  {b.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {config.heroImage ? (
          <div className="lp-hero__visual">
            <img
              className="lp-hero__img"
              src={config.heroImage.src}
              alt={config.heroImage.alt}
              width={640}
              height={420}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
