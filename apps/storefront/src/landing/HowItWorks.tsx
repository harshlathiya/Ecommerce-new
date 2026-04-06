export function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Create store",
      body: "Choose a niche template, connect your domain, and configure Razorpay or Stripe in guided steps.",
    },
    {
      n: 2,
      title: "Add products",
      body: "Import CSVs or add items manually with variants, media, and SEO fields tuned for Google.",
    },
    {
      n: 3,
      title: "Start selling",
      body: "Publish, share campaigns, and fulfill orders with inventory that stays synced across channels.",
    },
  ];

  return (
    <section className="lp-section" aria-labelledby="lp-how-heading">
      <div className="lp-section__inner">
        <h2 id="lp-how-heading" className="lp-section__title">
          How it works
        </h2>
        <p className="lp-section__lead">
          Three disciplined steps to start online store revenue—whether you are
          launching a saree boutique or a pan-India marketplace.
        </p>
        <ol className="lp-steps">
          {steps.map((s) => (
            <li key={s.n} className="lp-step">
              <span className="lp-step__num" aria-hidden>
                {s.n}
              </span>
              <div className="lp-step__body">
                <h3 className="lp-step__title">{s.title}</h3>
                <p className="lp-step__text">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
