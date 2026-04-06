import { Routes, Route, Link, Navigate } from "react-router-dom";
import { ThemeRoot } from "@ecom/ui";
import { StoreSetup } from "./pages/StoreSetup.js";
import { Home } from "./pages/Home.js";
import { ProductPage } from "./pages/ProductPage.js";
import { CartPage } from "./pages/CartPage.js";
import { CheckoutPage } from "./pages/CheckoutPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { useStoreTheme } from "./useStoreTheme.js";

export default function ShopApp() {
  const { store, loading } = useStoreTheme();

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading store…</div>
    );
  }

  if (!store) {
    return <StoreSetup />;
  }

  return (
    <ThemeRoot
      primary={store.branding?.primaryColor}
      secondary={store.branding?.secondaryColor}
    >
      <header
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid color-mix(in oklab, CanvasText 12%, transparent)",
        }}
      >
        {store.branding?.logoUrl ? (
          <img
            src={store.branding.logoUrl}
            alt=""
            style={{ height: 36, width: "auto" }}
          />
        ) : null}
        <strong style={{ marginRight: "auto" }}>{store.name}</strong>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Shop</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Account</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </ThemeRoot>
  );
}
