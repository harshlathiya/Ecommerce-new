import type { FeatureItem } from "./types.js";
import {
  IconBox,
  IconInventory,
  IconPayment,
  IconStore,
  IconTruck,
} from "./icons.js";

const iconMap = {
  store: IconStore,
  box: IconBox,
  payment: IconPayment,
  truck: IconTruck,
  inventory: IconInventory,
} as const;

export function Features({ items }: { items: FeatureItem[] }) {
  return (
    <section className="lp-section" aria-labelledby="lp-features-heading">
      <div className="lp-section__inner">
        <h2 id="lp-features-heading" className="lp-section__title">
          Everything you need to create ecommerce website experiences that sell
        </h2>
        <p className="lp-section__lead">
          From catalog to payout, the platform stays out of your way—so you can
          focus on merchandising, campaigns, and customer love.
        </p>
        <ul className="lp-feature-grid">
          {items.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <li key={f.title} className="lp-feature-card">
                <div className="lp-feature-card__icon" aria-hidden>
                  <Icon />
                </div>
                <h3 className="lp-feature-card__title">{f.title}</h3>
                <p className="lp-feature-card__desc">{f.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
