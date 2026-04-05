import { Router } from "express";
import { z } from "zod";
import { slugify } from "@ecom/utils";
import { requireAuth, requireSuperAdmin } from "../middleware/auth.js";
import { validateBody } from "../utils/validate.js";
import { StoreModel } from "../models/Store.js";

const router = Router();

router.get("/by-id/:id", async (req, res, next) => {
  try {
    const store = await StoreModel.findById(req.params.id).lean();
    if (!store) {
      res.status(404).json({ success: false, error: "Store not found" });
      return;
    }
    res.json({
      success: true,
      data: {
        store: {
          _id: store._id.toString(),
          name: store.name,
          slug: store.slug,
          branding: store.branding ?? {},
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/by-slug/:slug", async (req, res, next) => {
  try {
    const store = await StoreModel.findOne({ slug: req.params.slug }).lean();
    if (!store) {
      res.status(404).json({ success: false, error: "Store not found" });
      return;
    }
    res.json({
      success: true,
      data: {
        store: {
          _id: store._id.toString(),
          name: store.name,
          slug: store.slug,
          branding: store.branding ?? {},
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/", requireAuth, requireSuperAdmin, async (_req, res, next) => {
  try {
    const stores = await StoreModel.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: {
        stores: stores.map((s) => ({
          _id: s._id.toString(),
          name: s.name,
          slug: s.slug,
          branding: s.branding ?? {},
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        })),
      },
    });
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  branding: z
    .object({
      logoUrl: z.string().url().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      domain: z.string().optional(),
    })
    .optional(),
});

router.post("/", requireAuth, requireSuperAdmin, validateBody(createSchema), async (req, res, next) => {
  try {
    const body = req.body as z.infer<typeof createSchema>;
    const slug = body.slug?.trim() || slugify(body.name);
    const exists = await StoreModel.findOne({ slug });
    if (exists) {
      res.status(409).json({ success: false, error: "Slug already in use" });
      return;
    }
    const store = await StoreModel.create({
      name: body.name,
      slug,
      branding: body.branding ?? {},
    });
    res.status(201).json({
      success: true,
      data: {
        store: {
          _id: store._id.toString(),
          name: store.name,
          slug: store.slug,
          branding: store.branding ?? {},
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAuth, requireSuperAdmin, async (req, res, next) => {
  try {
    const r = await StoreModel.findByIdAndDelete(req.params.id);
    if (!r) {
      res.status(404).json({ success: false, error: "Store not found" });
      return;
    }
    res.json({ success: true, data: { ok: true } });
  } catch (e) {
    next(e);
  }
});

export default router;
