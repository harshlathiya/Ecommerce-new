import type { UseCaseItem } from "./types.js";
import { trackCtaClick } from "./analytics.js";

export function UseCases({ items }: { items: UseCaseItem[] }) {
  return (
    <section className="lp-section lp-section--muted" aria-labelledby="lp-usecases-heading">
      <div className="lp-section__inner">
        <h2 id="lp-usecases-heading" className="lp-section__title">
          Use cases built for high-intent shoppers
        </h2>
        <p className="lp-section__lead">
          Spin up niche landing experiences like online store for saree business
          or jewelry ecommerce website builder pages—each tuned for search and
          conversion.
        </p>
        <div className="lp-usecase-list">
          {items.map((uc, i) => (
            <article
              key={uc.id}
              className={`lp-usecase ${i % 2 === 1 ? "lp-usecase--reverse" : ""}`}
            >
              <div className="lp-usecase__body">
                <h3 className="lp-usecase__title">{uc.heading}</h3>
                <p className="lp-usecase__desc">{uc.description}</p>
                <a
                  className="lp-link-cta"
                  href={uc.cta.href}
                  onClick={() => trackCtaClick(uc.cta.label, `usecase_${uc.id}`)}
                >
                  {uc.cta.label}
                </a>
              </div>
              {uc.image ? (
                <div className="lp-usecase__media">
                  <img
                    src={uc.image.src}
                    alt={uc.image.alt}
                    width={560}
                    height={360}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
