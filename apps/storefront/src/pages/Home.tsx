import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@ecom/api-client";
import { formatCurrency } from "@ecom/utils";
import { Card, Button, Input } from "@ecom/ui";
import { getClient } from "../api.js";

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const client = getClient();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    void client.products
      .list(params.toString())
      .then((r) => setProducts(r.data.products))
      .catch((e: Error) => setErr(e.message));
  }, [q]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Products</h1>
      <div style={{ marginBottom: "1.5rem", maxWidth: 360 }}>
        <Input
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search products"
        />
      </div>
      {err ? <p role="alert">{err}</p> : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((p) => (
          <Card key={p._id}>
            {p.images[0] ? (
              <img
                src={p.images[0]}
                alt=""
                loading="lazy"
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
            ) : null}
            <h2 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>{p.title}</h2>
            <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>
              {formatCurrency(
                p.discountPercent
                  ? p.price * (1 - p.discountPercent / 100)
                  : p.price
              )}
            </p>
            <Link to={`/product/${p._id}`}>
              <Button variant="primary">View</Button>
            </Link>
          </Card>
        ))}
      </div>
      {!err && products.length === 0 ? (
        <p>No products yet. Add some from the admin dashboard.</p>
      ) : null}
    </div>
  );
}
