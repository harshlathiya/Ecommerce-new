import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { rateLimit } from "express-rate-limit";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import storeRoutes from "./routes/stores.js";
import { resolveTenant } from "./middleware/tenant.js";
import { optionalAuth } from "./middleware/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import paymentWebhookRoutes from "./routes/paymentWebhook.js";
import reviewRoutes from "./routes/reviews.js";
import couponRoutes from "./routes/coupons.js";
import wishlistRoutes from "./routes/wishlist.js";
import adminRoutes from "./routes/admin.js";
import seoRoutes from "./routes/seo.js";

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(globalLimiter);
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(mongoSanitize());

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/stores", storeRoutes);
  app.use("/api/webhooks/payments", paymentWebhookRoutes);

  const tenantRouter = express.Router();
  tenantRouter.use(optionalAuth, resolveTenant);

  tenantRouter.use("/products", productRoutes);
  tenantRouter.use("/cart", cartRoutes);
  tenantRouter.use("/orders", orderRoutes);
  tenantRouter.use("/payments", paymentRoutes);
  tenantRouter.use("/reviews", reviewRoutes);
  tenantRouter.use("/coupons", couponRoutes);
  tenantRouter.use("/wishlist", wishlistRoutes);
  tenantRouter.use("/admin", adminRoutes);
  tenantRouter.use("/seo", seoRoutes);

  app.use("/api", tenantRouter);

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  );

  return app;
}
