import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@ecom/ui";
import { getClient } from "../api.js";

export function CheckoutPage() {
  const nav = useNavigate();
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("US");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    try {
      const client = getClient();
      const guest = localStorage.getItem("ecom_guest_cart");
      const token = localStorage.getItem("ecom_token");
      const res = await client.orders.create({
        shippingAddress: {
          line1,
          city,
          postalCode: postal,
          country,
        },
        guestEmail: token ? undefined : email || undefined,
        guestToken: token ? undefined : guest ?? undefined,
      });
      localStorage.removeItem("ecom_guest_cart");
      nav("/", { state: { orderId: res.data.order._id } });
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ marginTop: 0 }}>Checkout</h1>
      <Card>
        {!localStorage.getItem("ecom_token") ? (
          <label style={{ display: "block", marginBottom: 12 }}>
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginTop: 4 }}
            />
          </label>
        ) : null}
        <label style={{ display: "block", marginBottom: 12 }}>
          Address line 1
          <Input value={line1} onChange={(e) => setLine1(e.target.value)} style={{ marginTop: 4 }} />
        </label>
        <label style={{ display: "block", marginBottom: 12 }}>
          City
          <Input value={city} onChange={(e) => setCity(e.target.value)} style={{ marginTop: 4 }} />
        </label>
        <label style={{ display: "block", marginBottom: 12 }}>
          Postal code
          <Input value={postal} onChange={(e) => setPostal(e.target.value)} style={{ marginTop: 4 }} />
        </label>
        <label style={{ display: "block", marginBottom: 12 }}>
          Country
          <Input value={country} onChange={(e) => setCountry(e.target.value)} style={{ marginTop: 4 }} />
        </label>
        {err ? <p role="alert">{String(err)}</p> : null}
        <Button variant="primary" onClick={() => void submit()}>
          Place order
        </Button>
      </Card>
    </div>
  );
}
