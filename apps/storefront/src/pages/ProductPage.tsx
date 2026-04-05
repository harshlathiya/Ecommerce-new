import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "@ecom/api-client";
import { formatCurrency } from "@ecom/utils";
import { Button, Card } from "@ecom/ui";
import { getClient } from "../api.js";

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [variantSku, setVariantSku] = useState<string | undefined>();
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const client = getClient();
    void client.products
      .get(id)
      .then((r) => {
        setProduct(r.data.product);
        const v = r.data.product.variants[0];
        setVariantSku(v?.sku ?? v?.name);
      })
      .catch(() => setMsg("Product not found"));
  }, [id]);

  async function addToCart() {
    if (!product || !id) return;
    setMsg(null);
    try {
      const client = getClient();
      const guest = localStorage.getItem("ecom_guest_cart");
      const res = await client.cart.add({
        productId: id,
        quantity: qty,
        variantSku: variantSku,
        guestToken: guest ?? undefined,
      });
      if (res.data.guestToken) {
        localStorage.setItem("ecom_guest_cart", res.data.guestToken);
      }
      setMsg("Added to cart");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  if (!product) {
    return <p>{msg || "Loading…"}</p>;
  }

  const price =
    product.discountPercent != null
      ? product.price * (1 - product.discountPercent / 100)
      : product.price;

  return (
    <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
      <div>
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt=""
            style={{ width: "100%", borderRadius: 12 }}
          />
        ) : null}
      </div>
      <Card>
        <h1 style={{ marginTop: 0 }}>{product.title}</h1>
        <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>{formatCurrency(price)}</p>
        <p>{product.description}</p>
        {product.variants.length > 0 ? (
          <label style={{ display: "block", marginBottom: 8 }}>
            Variant
            <select
              style={{ display: "block", marginTop: 4, width: "100%", padding: 8 }}
              value={variantSku ?? ""}
              onChange={(e) => setVariantSku(e.target.value || undefined)}
            >
              {product.variants.map((v) => {
                const val = v.sku ?? v.name;
                return (
                  <option key={val} value={val}>
                    {v.name}
                    {v.sku ? ` (${v.sku})` : ""}
                  </option>
                );
              })}
            </select>
          </label>
        ) : null}
        <label style={{ display: "block", marginBottom: 8 }}>
          Quantity
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
            style={{ display: "block", marginTop: 4, width: "100%", padding: 8 }}
          />
        </label>
        <Button variant="primary" onClick={() => void addToCart()}>
          Add to cart
        </Button>
        {msg ? <p role="status">{msg}</p> : null}
      </Card>
    </div>
  );
}
