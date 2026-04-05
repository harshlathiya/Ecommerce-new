import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import { requireStoreAccess } from "../middleware/tenant.js";
import { ProductModel } from "../models/Product.js";
import { StoreModel } from "../models/Store.js";

const router = Router({ mergeParams: true });

router.get("/sitemap.xml", optionalAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const base =
      typeof req.query.baseUrl === "string"
        ? req.query.baseUrl.replace(/\/$/, "")
        : "https://example.com";
    const products = await ProductModel.find({ storeId }).select("slug updatedAt").lean();
    const urls = products.map(
      (p) =>
        `  <url><loc>${base}/products/${p.slug}</loc><lastmod>${(p.updatedAt ?? new Date()).toISOString()}</lastmod></url>`
    );
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
    res.type("application/xml").send(xml);
  } catch (e) {
    next(e);
  }
});

router.get(
  "/product-schema/:productId",
  optionalAuth,
  requireStoreAccess,
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const product = await ProductModel.findOne({
        _id: req.params.productId,
        storeId,
      }).lean();
      const store = await StoreModel.findById(storeId).lean();
      if (!product) {
        res.status(404).json({ success: false, error: "Not found" });
        return;
      }
      const price =
        product.discountPercent != null
          ? product.price * (1 - product.discountPercent / 100)
          : product.price;
      const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.seo?.title ?? product.title,
        description: product.seo?.description ?? product.description,
        image: product.images,
        sku: product.slug,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: Math.round(price * 100) / 100,
          availability:
            product.inventory > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
        brand: { "@type": "Brand", name: store?.name ?? "Store" },
      };
      res.json({ success: true, data: { schema } });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
