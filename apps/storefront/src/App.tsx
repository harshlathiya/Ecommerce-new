import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeRoot } from "@ecom/ui";
import ShopApp from "./ShopApp.js";
import { LandingPage } from "./landing/LandingPage.js";
import { getLandingConfig, marketingPaths } from "./landing/configs.js";
import {
  MarketingSignupPage,
  MarketingDemoPage,
  MarketingContactPage,
} from "./pages/marketing/MarketingFunnelPage.js";

function LandingRoute({ path }: { path: string }) {
  const config = getLandingConfig(path);
  if (!config) {
    return <Navigate to="/" replace />;
  }
  return (
    <ThemeRoot primary="#4f46e5" secondary="#0ea5e9">
      <LandingPage config={config} />
    </ThemeRoot>
  );
}

function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <ThemeRoot primary="#4f46e5" secondary="#0ea5e9">
      <div className="lp-page lp-page--funnel">{children}</div>
    </ThemeRoot>
  );
}

export default function App() {
  return (
    <Routes>
      {marketingPaths.map((path) => (
        <Route
          key={path}
          path={path}
          element={<LandingRoute path={path} />}
        />
      ))}
      <Route
        path="/signup"
        element={
          <MarketingShell>
            <MarketingSignupPage />
          </MarketingShell>
        }
      />
      <Route
        path="/demo"
        element={
          <MarketingShell>
            <MarketingDemoPage />
          </MarketingShell>
        }
      />
      <Route
        path="/contact"
        element={
          <MarketingShell>
            <MarketingContactPage />
          </MarketingShell>
        }
      />
      <Route path="/*" element={<ShopApp />} />
    </Routes>
  );
}
