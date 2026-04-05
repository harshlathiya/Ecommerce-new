import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Cart } from "@ecom/api-client";
import { formatCurrency } from "@ecom/utils";
import { Button, Card } from "@ecom/ui";
import { getClient } from "../api.js";

export function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);

  async function refresh() {
    const client = getClient();
    const guest = localStorage.getItem("ecom_guest_cart");
    const res = await client.cart.get(guest ?? undefined);
    if (res.data.guestToken) {
      localStorage.setItem("ecom_guest_cart", res.data.guestToken);
    }
    setCart(res.data.cart);
  }

  useEffect(() => {
    void refresh().catch(() => setCart(null));
  }, []);

  if (!cart) return <p>Loading cart…</p>;

  const subtotal = cart.items.reduce(
    (s, i) => s + i.unitPrice * i.quantity,
    0
  );

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Cart</h1>
      {cart.items.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.items.map((i) => (
              <li key={`${i.productId}-${i.variantSku ?? ""}`} style={{ marginBottom: 12 }}>
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <strong>{i.title}</strong>
                      <div style={{ fontSize: 14, opacity: 0.8 }}>
                        {formatCurrency(i.unitPrice)} × {i.quantity}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const client = getClient();
                        const guest = localStorage.getItem("ecom_guest_cart");
                        void client.cart
                          .remove({
                            productId: i.productId,
                            variantSku: i.variantSku,
                            guestToken: guest ?? undefined,
                          })
                          .then(() => refresh());
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
            Subtotal: {formatCurrency(subtotal)}
          </p>
          <Link to="/checkout">
            <Button variant="primary">Checkout</Button>
          </Link>
        </>
      )}
    </div>
  );
}
