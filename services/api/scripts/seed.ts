/**
 * Seed super admin, demo store, store admin, sample products.
 * Run: npx tsx scripts/seed.ts
 */
import "dotenv/config";
import mongoose from "mongoose";
import { config } from "../src/config.js";
import { StoreModel } from "../src/models/Store.js";
import { UserModel } from "../src/models/User.js";
import { ProductModel } from "../src/models/Product.js";
import { hashPassword } from "../src/services/authService.js";

async function main() {
  await mongoose.connect(config.mongoUri);

  const email = process.env.SEED_SUPER_EMAIL || "admin@example.com";
  const password = process.env.SEED_SUPER_PASSWORD || "ChangeMe123!";
  let superUser = await UserModel.findOne({ email: email.toLowerCase() });
  if (!superUser) {
    superUser = await UserModel.create({
      email,
      passwordHash: await hashPassword(password),
      role: "super_admin",
    });
    console.log("Created super_admin:", email, password);
  }

  let store = await StoreModel.findOne({ slug: "demo-store" });
  if (!store) {
    store = await StoreModel.create({
      name: "Demo Store",
      slug: "demo-store",
      branding: {
        primaryColor: "#0f766e",
        secondaryColor: "#f59e0b",
        logoUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop",
      },
    });
    console.log("Created store demo-store id:", store._id.toString());
  }

  const adminEmail = process.env.SEED_STORE_ADMIN_EMAIL || "store@example.com";
  const adminPass = process.env.SEED_STORE_ADMIN_PASSWORD || "ChangeMe123!";
  let storeAdmin = await UserModel.findOne({ email: adminEmail.toLowerCase() });
  if (!storeAdmin) {
    storeAdmin = await UserModel.create({
      email: adminEmail,
      passwordHash: await hashPassword(adminPass),
      role: "store_admin",
      storeId: store._id,
    });
    console.log("Created store_admin:", adminEmail, adminPass);
  }

  const count = await ProductModel.countDocuments({ storeId: store._id });
  if (count === 0) {
    await ProductModel.insertMany([
      {
        storeId: store._id,
        title: "Everyday Tee",
        slug: "everyday-tee",
        description: "Soft cotton tee.",
        price: 24.99,
        category: "apparel",
        inventory: 100,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        ],
        variants: [
          { name: "S", sku: "TEE-S", inventory: 30, priceDelta: 0 },
          { name: "M", sku: "TEE-M", inventory: 40, priceDelta: 0 },
          { name: "L", sku: "TEE-L", inventory: 30, priceDelta: 2 },
        ],
      },
      {
        storeId: store._id,
        title: "Minimal Watch",
        slug: "minimal-watch",
        description: "Stainless steel, water resistant.",
        price: 129,
        discountPercent: 10,
        category: "accessories",
        inventory: 25,
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        ],
        variants: [],
      },
    ]);
    console.log("Inserted sample products");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
