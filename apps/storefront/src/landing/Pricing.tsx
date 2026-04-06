import type { PricingPlan } from "./types.js";
import { trackCtaClick } from "./analytics.js";

export function Pricing({ plans }: { plans: PricingPlan[] }) {
  const allFeatures = Array.from(
    new Set(plans.flatMap((p) => p.features)),
  ).slice(0, 8);

  return (
    <section className="lp-section" aria-labelledby="lp-pricing-heading">
      <div className="lp-section__inner">
        <h2 id="lp-pricing-heading" className="lp-section__title">
          Subscription pricing that stays predictable
        </h2>
        <p className="lp-section__lead">
          Monthly plans for teams who want a cheap ecommerce platform India
          budgets can plan around—without sacrificing reliability.
        </p>
        <div className="lp-pricing-grid">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.highlighted
                  ? "lp-price-card lp-price-card--highlight"
                  : "lp-price-card"
            }
            >
              <h3 className="lp-price-card__name">{plan.name}</h3>
              <p className="lp-price-card__price">
                <span className="lp-price-card__amount">{plan.priceMonthly}</span>
                {plan.priceMonthly !== "Custom" ? (
                  <span className="lp-price-card__period">/mo</span>
                ) : null}
              </p>
              <p className="lp-price-card__desc">{plan.description}</p>
              <ul className="lp-price-card__list">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                className={
                  plan.highlighted ? "lp-btn lp-btn--primary lp-btn--block" : "lp-btn lp-btn--ghost lp-btn--block"
                }
                href={plan.cta.href}
                onClick={() => trackCtaClick(plan.cta.label, `pricing_${plan.name}`)}
              >
                {plan.cta.label}
              </a>
            </article>
          ))}
        </div>

        <div className="lp-compare" role="region" aria-label="Feature comparison">
          <h3 className="lp-compare__title">At-a-glance comparison</h3>
          <div className="lp-compare__table-wrap">
            <table className="lp-compare__table">
              <caption className="lp-visually-hidden">
                Plan features compared across Starter, Growth, and Scale
              </caption>
              <thead>
                <tr>
                  <th scope="col">Capability</th>
                  {plans.map((p) => (
                    <th key={p.name} scope="col">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feat) => (
                  <tr key={feat}>
                    <th scope="row">{feat}</th>
                    {plans.map((p) => (
                      <td key={p.name + feat}>
                        {p.features.includes(feat) ? "Included" : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
