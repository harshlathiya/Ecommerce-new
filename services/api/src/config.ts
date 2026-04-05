import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpires: process.env.JWT_EXPIRES || "7d",
  corsOrigin:
    process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) || [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  redisUrl: process.env.REDIS_URL || "",
};
