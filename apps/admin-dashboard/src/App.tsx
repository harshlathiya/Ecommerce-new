import { useEffect, useState } from "react";
import type { Store, Product, Order } from "@ecom/api-client";
import { formatCurrency } from "@ecom/utils";
import { Button, Input, Card, ThemeRoot } from "@ecom/ui";
import { getClient } from "./api.js";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("ecom_admin_token")
  );
  const [stores, setStores] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<string | null>(
    () => localStorage.getItem("ecom_admin_store_id")
  );
  const [metrics, setMetrics] = useState<{
    revenue: number;
    orderCount: number;
    topProducts: { productId: string; title: string; units: number }[];
  } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newStoreName, setNewStoreName] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("29.99");
  const [err, setErr] = useState<string | null>(null);

  async function login() {
    setErr(null);
    try {
      const client = getClient();
      const res = await client.auth.login({ email, password });
      localStorage.setItem("ecom_admin_token", res.data.token);
      setToken(res.data.token);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function loadStores() {
    const client = getClient();
    const res = await client.stores.list();
    setStores(res.data.stores);
  }

  useEffect(() => {
    if (!token) return;
    void loadStores().catch((e) => setErr((e as Error).message));
  }, [token]);

  useEffect(() => {
    if (!token || !storeId) {
      setMetrics(null);
      setProducts([]);
      setOrders([]);
      return;
    }
    const client = getClient();
    void Promise.all([
      client.admin.metrics().then((r) => setMetrics(r.data)),
      client.products.list().then((r) => setProducts(r.data.products)),
      client.orders.list().then((r) => setOrders(r.data.orders)),
    ]).catch((e) => setErr((e as Error).message));
  }, [token, storeId]);

  async function createStore() {
    setErr(null);
    try {
      const client = getClient();
      const res = await client.stores.create({ name: newStoreName });
      setNewStoreName("");
      await loadStores();
      setStoreId(res.data.store._id);
      localStorage.setItem("ecom_admin_store_id", res.data.store._id);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function createProduct() {
    if (!storeId) return;
    setErr(null);
    try {
      const client = getClient();
      await client.products.create({
        title: productTitle,
        price: Number(productPrice),
        description: "",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        ],
      });
      setProductTitle("");
      const list = await client.products.list();
      setProducts(list.data.products);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  if (!token) {
    return (
      <ThemeRoot>
        <div style={{ maxWidth: 400, margin: "4rem auto", padding: "0 1rem" }}>
          <Card>
            <h1 style={{ marginTop: 0 }}>Admin login</h1>
            <p style={{ fontSize: 14, opacity: 0.8 }}>
              Use the first super_admin account (seed script) or your provisioned admin user.
            </p>
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
            {err ? <p role="alert">{err}</p> : null}
            <Button variant="primary" onClick={() => void login()}>
              Sign in
            </Button>
          </Card>
        </div>
      </ThemeRoot>
    );
  }

  return (
    <ThemeRoot>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: 240,
            borderRight: "1px solid color-mix(in oklab, CanvasText 12%, transparent)",
            padding: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Stores</h2>
          <select
            value={storeId ?? ""}
            onChange={(e) => {
              const v = e.target.value || null;
              setStoreId(v);
              if (v) localStorage.setItem("ecom_admin_store_id", v);
              else localStorage.removeItem("ecom_admin_store_id");
            }}
            style={{ width: "100%", marginBottom: 12 }}
          >
            <option value="">Select store…</option>
            {stores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            <Input
              placeholder="New store name"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
            />
            <Button variant="primary" onClick={() => void createStore()}>
              Create store
            </Button>
          </div>
          <Button
            style={{ marginTop: 24, width: "100%" }}
            onClick={() => {
              localStorage.removeItem("ecom_admin_token");
              setToken(null);
            }}
          >
            Log out
          </Button>
        </aside>
        <main style={{ flex: 1, padding: "1.5rem" }}>
          {!storeId ? (
            <p>Select or create a store to manage tenant data.</p>
          ) : (
            <>
              <h1 style={{ marginTop: 0 }}>Dashboard</h1>
              {err ? <p role="alert">{err}</p> : null}
              {metrics ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <Card>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>Revenue (paid+)</div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>
                      {formatCurrency(metrics.revenue)}
                    </div>
                  </Card>
                  <Card>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>Orders</div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>
                      {metrics.orderCount}
                    </div>
                  </Card>
                </div>
              ) : null}
              <h2>Quick add product</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                <Input
                  placeholder="Title"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  style={{ minWidth: 200 }}
                />
                <Input
                  placeholder="Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  style={{ width: 100 }}
                />
                <Button variant="primary" onClick={() => void createProduct()}>
                  Add
                </Button>
              </div>
              <h2>Products</h2>
              <ul>
                {products.map((p) => (
                  <li key={p._id}>
                    {p.title} — {formatCurrency(p.price)}
                  </li>
                ))}
              </ul>
              <h2>Orders</h2>
              <ul>
                {orders.map((o) => (
                  <li key={o._id}>
                    {o._id.slice(-6)} — {o.status} — {formatCurrency(o.total)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </ThemeRoot>
  );
}
