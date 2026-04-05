import { useState } from "react";
import { Button, Input, Card } from "@ecom/ui";
import { getClient } from "../api.js";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function login() {
    setMsg(null);
    try {
      const client = getClient();
      const res = await client.auth.login({ email, password });
      localStorage.setItem("ecom_token", res.data.token);
      const guest = localStorage.getItem("ecom_guest_cart");
      if (guest) {
        await client.cart.merge(guest).catch(() => {});
        localStorage.removeItem("ecom_guest_cart");
      }
      setMsg("Signed in.");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <Card>
        <h1 style={{ marginTop: 0 }}>Sign in</h1>
        <label style={{ display: "block", marginBottom: 12 }}>
          Email
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: 4 }}
          />
        </label>
        <label style={{ display: "block", marginBottom: 12 }}>
          Password
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: 4 }}
          />
        </label>
        <Button variant="primary" onClick={() => void login()}>
          Login
        </Button>
        {msg ? <p role="status">{msg}</p> : null}
      </Card>
    </div>
  );
}
