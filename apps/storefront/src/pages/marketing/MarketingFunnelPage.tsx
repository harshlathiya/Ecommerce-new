import { Link, useSearchParams } from "react-router-dom";

export function MarketingSignupPage() {
  const [params] = useSearchParams();
  const q = params.toString();

  return (
    <div className="lp-funnel">
      <h1>Start your free trial</h1>
      <p>
        Connect your brand workspace—this placeholder route fires conversion
        events from landing CTAs. Wire your auth or billing flow here.
      </p>
      {q ? (
        <p>
          <code>{q}</code>
        </p>
      ) : null}
      <Link to="/create-ecommerce-website">← Back to marketing</Link>
    </div>
  );
}

export function MarketingDemoPage() {
  const [params] = useSearchParams();
  const niche = params.get("niche");

  return (
    <div className="lp-funnel">
      <h1>Product demo</h1>
      <p>
        Embed a Loom, Storylane, or live sandbox here. Niche:{" "}
        <strong>{niche ?? "general"}</strong>.
      </p>
      <Link to="/create-ecommerce-website">← Back to marketing</Link>
    </div>
  );
}

export function MarketingContactPage() {
  return (
    <div className="lp-funnel">
      <h1>Talk to sales</h1>
      <p>Route your CRM webhook or calendar embed from this screen.</p>
      <Link to="/create-ecommerce-website">← Back to marketing</Link>
    </div>
  );
}
