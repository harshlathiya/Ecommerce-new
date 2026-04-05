import type { Testimonial } from "./types.js";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <div className="lp-stars" aria-label={`${full} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? "lp-star lp-star--on" : "lp-star"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function SocialProof({
  testimonials,
  partnerLogos,
}: {
  testimonials: Testimonial[];
  partnerLogos?: { name: string; alt: string }[];
}) {
  return (
    <section className="lp-section lp-section--compact" aria-label="Social proof">
      <div className="lp-section__inner">
        {partnerLogos?.length ? (
          <div className="lp-logos">
            <p className="lp-logos__label">Trusted by modern commerce teams</p>
            <ul className="lp-logos__row">
              {partnerLogos.map((logo) => (
                <li key={logo.name} className="lp-logos__item">
                  <span className="lp-logos__fake" aria-hidden>
                    {logo.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="lp-visually-hidden">{logo.alt}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="lp-testimonials">
          <h2 className="lp-visually-hidden">Customer testimonials</h2>
          <div className="lp-testimonial-grid">
            {testimonials.map((t) => (
              <article key={t.name} className="lp-testimonial">
                <Stars rating={t.rating} />
                <blockquote className="lp-testimonial__quote">“{t.quote}”</blockquote>
                <footer className="lp-testimonial__meta">
                  <cite className="lp-testimonial__name">{t.name}</cite>
                  <span className="lp-testimonial__role">{t.role}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <div className="lp-rating-banner">
          <p>
            <strong>4.9/5</strong> average satisfaction from onboarding teams
          </p>
        </div>
      </div>
    </section>
  );
}
