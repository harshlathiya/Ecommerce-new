import type { CtaLink } from "./types.js";
import { trackCtaClick } from "./analytics.js";

interface FinalCtaProps {
  headline: string;
  subline: string;
  primaryCta: CtaLink;
  abVariant?: string;
}

export function FinalCta({ headline, subline, primaryCta, abVariant }: FinalCtaProps) {
  return (
    <section className="lp-final-cta" aria-labelledby="lp-final-cta-heading">
      <div className="lp-final-cta__inner">
        <h2 id="lp-final-cta-heading" className="lp-final-cta__title">
          {headline}
        </h2>
        <p className="lp-final-cta__sub">{subline}</p>
        <a
          className="lp-btn lp-btn--primary lp-btn--lg"
          href={primaryCta.href}
          data-ab-variant={abVariant}
          onClick={() =>
            trackCtaClick(primaryCta.label, "final_cta", abVariant)
          }
        >
          {primaryCta.label}
        </a>
      </div>
    </section>
  );
}
