import type { FaqItem } from "./types.js";

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <section className="lp-section lp-section--muted" aria-labelledby="lp-faq-heading">
      <div className="lp-section__inner lp-section__inner--narrow">
        <h2 id="lp-faq-heading" className="lp-section__title">
          Frequently asked questions
        </h2>
        <p className="lp-section__lead">
          Straight answers for teams comparing Shopify alternatives and planning
          how to start online store operations in India.
        </p>
        <div className="lp-faq">
          {items.map((item) => (
            <details key={item.question} className="lp-faq__item">
              <summary className="lp-faq__q">{item.question}</summary>
              <p className="lp-faq__a">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
