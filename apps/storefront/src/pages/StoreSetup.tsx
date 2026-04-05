import { useState } from "react";
import { Button, Input, Card } from "@ecom/ui";
import { getClient } from "../api.js";

export function StoreSetup() {
  const [slug, setSlug] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function connect() {
    setErr(null);
    setBusy(true);
    try {
      const client = getClient();
      const res = await client.stores.getBySlug(slug.trim());
      localStorage.setItem("ecom_store_id", res.data.store._id);
      localStorage.setItem("ecom_store_slug", res.data.store.slug);
      window.location.reload();
    } catch {
      setErr("Store not found. Check the slug or ask your admin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1rem" }}>
      <Card>
        <h1 style={{ marginTop: 0 }}>Choose your store</h1>
        <p style={{ color: "color-mix(in oklab, CanvasText 70%, transparent)" }}>
          Enter the store slug (e.g. <code>saree-boutique</code>) configured by the
          platform admin.
        </p>
        <label htmlFor="slug" style={{ display: "block", marginBottom: 8 }}>
          Store slug
        </label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="my-store"
          autoComplete="off"
        />
        {err ? (
          <p role="alert" style={{ color: "crimson", marginTop: 8 }}>
            {err}
          </p>
        ) : null}
        <div style={{ marginTop: 16 }}>
          <Button variant="primary" disabled={busy || !slug.trim()} onClick={() => void connect()}>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
