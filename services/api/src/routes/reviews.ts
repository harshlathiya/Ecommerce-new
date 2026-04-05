import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { requireStoreAccess, requireStoreAdmin } from "../middleware/tenant.js";
import { validateBody } from "../utils/validate.js";
import { ReviewModel } from "../models/Review.js";
import { ProductModel } from "../models/Product.js";

const router = Router({ mergeParams: true });

router.get("/", optionalAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
    if (!productId) {
      res.status(400).json({ success: false, error: "productId required" });
      return;
    }
    const filter: Record<string, unknown> = {
      storeId: new mongoose.Types.ObjectId(storeId),
      productId: new mongoose.Types.ObjectId(productId),
    };
    if (req.user?.role !== "store_admin" && req.user?.role !== "super_admin") {
      filter.moderated = true;
    }
    const reviews = await ReviewModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: {
        reviews: reviews.map((r) => ({
          _id: r._id.toString(),
          storeId: r.storeId.toString(),
          productId: r.productId.toString(),
          userId: r.userId?.toString(),
          rating: r.rating,
          title: r.title,
          body: r.body,
          moderated: r.moderated,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(1),
});

router.post(
  "/",
  requireAuth,
  requireStoreAccess,
  validateBody(createSchema),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const body = req.body as z.infer<typeof createSchema>;
      const product = await ProductModel.findOne({
        _id: body.productId,
        storeId,
      }).lean();
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      const review = await ReviewModel.create({
        storeId,
        productId: body.productId,
        userId: req.user!.id,
        rating: body.rating,
        title: body.title,
        body: body.body,
        moderated: false,
      });
      res.status(201).json({
        success: true,
        data: {
          review: {
            _id: review._id.toString(),
            storeId: review.storeId.toString(),
            productId: review.productId.toString(),
            userId: review.userId?.toString(),
            rating: review.rating,
            title: review.title,
            body: review.body,
            moderated: review.moderated,
            createdAt: review.createdAt,
          },
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/:id/moderate",
  requireAuth,
  requireStoreAdmin,
  validateBody(z.object({ moderated: z.boolean() })),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const { moderated } = req.body as { moderated: boolean };
      const review = await ReviewModel.findOneAndUpdate(
        { _id: req.params.id, storeId },
        { $set: { moderated } },
        { new: true }
      ).lean();
      if (!review) {
        res.status(404).json({ success: false, error: "Review not found" });
        return;
      }
      res.json({
        success: true,
        data: {
          review: {
            _id: review._id.toString(),
            storeId: review.storeId.toString(),
            productId: review.productId.toString(),
            userId: review.userId?.toString(),
            rating: review.rating,
            title: review.title,
            body: review.body,
            moderated: review.moderated,
            createdAt: review.createdAt,
          },
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
