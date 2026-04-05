import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { slugify } from "@ecom/utils";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { requireStoreAccess, requireStoreAdmin } from "../middleware/tenant.js";
import { validateBody } from "../utils/validate.js";
import { ProductModel } from "../models/Product.js";

const router = Router({ mergeParams: true });

router.get("/", optionalAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    const filter: Record<string, unknown> = {
      storeId: new mongoose.Types.ObjectId(storeId),
    };
    if (category) filter.category = category;
    let query = ProductModel.find(filter);
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query = query.find({ $or: [{ title: rx }, { description: rx }] });
    }
    const products = await query.sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: {
        products: products.map(serializeProduct),
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", optionalAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const product = await ProductModel.findOne({
      _id: req.params.id,
      storeId,
    }).lean();
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    res.json({ success: true, data: { product: serializeProduct(product) } });
  } catch (e) {
    next(e);
  }
});

const variantSchema = z.object({
  name: z.string(),
  sku: z.string().optional(),
  priceDelta: z.number().optional(),
  inventory: z.number().min(0).default(0),
});

const productBody = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0),
  discountPercent: z.number().min(0).max(100).optional(),
  category: z.string().optional(),
  inventory: z.number().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  variants: z.array(variantSchema).optional(),
  seo: z
    .object({ title: z.string().optional(), description: z.string().optional() })
    .optional(),
});

router.post(
  "/",
  requireAuth,
  requireStoreAdmin,
  validateBody(productBody),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const body = req.body as z.infer<typeof productBody>;
      const slug = body.slug?.trim() || slugify(body.title);
      const product = await ProductModel.create({
        storeId,
        title: body.title,
        slug,
        description: body.description ?? "",
        price: body.price,
        discountPercent: body.discountPercent,
        category: body.category ?? "general",
        inventory: body.inventory ?? 0,
        images: body.images ?? [],
        variants: body.variants ?? [],
        seo: body.seo,
      });
      res.status(201).json({
        success: true,
        data: { product: serializeProduct(product.toObject()) },
      });
    } catch (e) {
      if ((e as { code?: number }).code === 11000) {
        res.status(409).json({ success: false, error: "Slug exists for store" });
        return;
      }
      next(e);
    }
  }
);

router.patch(
  "/:id",
  requireAuth,
  requireStoreAdmin,
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const partial = productBody.partial().safeParse(req.body);
      if (!partial.success) {
        res.status(400).json({ success: false, error: partial.error.flatten() });
        return;
      }
      const body = partial.data;
      if (body.title && !body.slug) {
        body.slug = slugify(body.title);
      }
      const product = await ProductModel.findOneAndUpdate(
        { _id: req.params.id, storeId },
        { $set: body },
        { new: true }
      ).lean();
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({ success: true, data: { product: serializeProduct(product) } });
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/:id", requireAuth, requireStoreAdmin, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const r = await ProductModel.findOneAndDelete({
      _id: req.params.id,
      storeId,
    });
    if (!r) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }
    res.json({ success: true, data: { ok: true } });
  } catch (e) {
    next(e);
  }
});

const bulkSchema = z.object({
  products: z.array(productBody),
});

router.post(
  "/bulk",
  requireAuth,
  requireStoreAdmin,
  validateBody(bulkSchema),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const { products } = req.body as z.infer<typeof bulkSchema>;
      const docs = products.map((p) => ({
        storeId,
        title: p.title,
        slug: p.slug?.trim() || slugify(p.title),
        description: p.description ?? "",
        price: p.price,
        discountPercent: p.discountPercent,
        category: p.category ?? "general",
        inventory: p.inventory ?? 0,
        images: p.images ?? [],
        variants: p.variants ?? [],
        seo: p.seo,
      }));
      const result = await ProductModel.insertMany(docs, { ordered: false }).catch(
        () => null
      );
      const created = Array.isArray(result) ? result.length : 0;
      res.status(201).json({ success: true, data: { created } });
    } catch (e) {
      next(e);
    }
  }
);

function serializeProduct(p: {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string | null;
  price: number;
  discountPercent?: number | null;
  category?: string | null;
  inventory?: number | null;
  images?: string[] | null;
  variants?: { name: string; sku?: string | null; priceDelta?: number | null; inventory: number }[] | null;
  seo?: { title?: string | null; description?: string | null } | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    _id: p._id.toString(),
    storeId: p.storeId.toString(),
    title: p.title,
    slug: p.slug,
    description: p.description ?? "",
    price: p.price,
    discountPercent: p.discountPercent ?? undefined,
    category: p.category ?? "general",
    inventory: p.inventory ?? 0,
    images: p.images ?? [],
    variants: (p.variants ?? []).map((v) => ({
      name: v.name,
      sku: v.sku ?? undefined,
      priceDelta: v.priceDelta ?? undefined,
      inventory: v.inventory,
    })),
    seo: p.seo
      ? {
          title: p.seo.title ?? undefined,
          description: p.seo.description ?? undefined,
        }
      : undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export default router;
