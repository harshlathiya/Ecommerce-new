import { Link, useLocation } from "react-router-dom";
import type { LandingPageConfig } from "./types.js";
import { LandingSEO } from "./LandingSEO.js";
import { Hero } from "./Hero.js";
import { SocialProof } from "./SocialProof.js";
import { Features } from "./Features.js";
import { HowItWorks } from "./HowItWorks.js";
import { UseCases } from "./UseCases.js";
import { Pricing } from "./Pricing.js";
import { FAQ } from "./FAQ.js";
import { FinalCta } from "./CTA.js";
import { resolveAbVariant } from "./ab.js";

interface LandingPageProps {
  config: LandingPageConfig;
}

export function LandingPage({ config }: LandingPageProps) {
  const { search } = useLocation();
  const abHeadline = resolveAbVariant(config.abTest?.headline, search, "headline");
  const abCta = resolveAbVariant(config.abTest?.ctaLabel, search, "cta");
  const primaryCtaLabelOverride =
    abCta === "b" ? "Start 14-day trial" : undefined;

  return (
    <>
      <LandingSEO config={config} />
      <div className="lp-page">
        <header className="lp-nav">
          <div className="lp-nav__inner">
            <Link to="/create-ecommerce-website" className="lp-nav__brand">
              EcomSaaS
            </Link>
            <nav className="lp-nav__links" aria-label="Marketing">
              <Link to="/shopify-alternative-india">Shopify alternative India</Link>
              <Link to="/start-online-store">Start online store</Link>
              <Link to="/saree-ecommerce-website">Saree stores</Link>
              <Link to="/jewelry-store-builder">Jewelry</Link>
            </nav>
            <div className="lp-nav__ctas">
              <Link className="lp-btn lp-btn--ghost lp-btn--sm" to="/demo">
                View demo
              </Link>
              <Link className="lp-btn lp-btn--primary lp-btn--sm" to="/signup">
                Start free trial
              </Link>
            </div>
          </div>
        </header>

        <main>
          <Hero
            config={config.hero}
            abVariant={abHeadline}
            trustBadges={config.trustBadges}
            primaryCtaLabelOverride={primaryCtaLabelOverride}
          />
          <SocialProof
            testimonials={config.testimonials}
            partnerLogos={config.partnerLogos}
          />
          <Features items={config.features} />
          <HowItWorks />
          <UseCases items={config.useCases} />
          <Pricing plans={config.pricingPlans} />
          <FAQ items={config.faq} />
          <FinalCta
            headline={config.finalCta.headline}
            subline={config.finalCta.subline}
            primaryCta={config.finalCta.primaryCta}
            abVariant={`${abHeadline}-${abCta}`}
          />
        </main>

        <footer className="lp-footer">
          <div className="lp-footer__inner">
            <p className="lp-footer__copy">
              © {new Date().getFullYear()} EcomSaaS. Built for multi-tenant
              ecommerce in India and beyond.
            </p>
            <nav className="lp-footer__nav" aria-label="Footer">
              <Link to="/create-ecommerce-website">Create ecommerce website</Link>
              <Link to="/build-ecommerce-website-mern">MERN commerce</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
