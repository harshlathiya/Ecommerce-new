import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireStoreAccess } from "../middleware/tenant.js";
import { validateBody } from "../utils/validate.js";
import { WishlistModel } from "../models/Wishlist.js";
import { ProductModel } from "../models/Product.js";

const router = Router({ mergeParams: true });

router.get("/", requireAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    let list = await WishlistModel.findOne({ storeId, userId: req.user!.id });
    if (!list) {
      list = await WishlistModel.create({
        storeId,
        userId: req.user!.id,
        productIds: [],
      });
    }
    res.json({
      success: true,
      data: {
        productIds: list.productIds.map((id) => id.toString()),
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/toggle",
  requireAuth,
  requireStoreAccess,
  validateBody(z.object({ productId: z.string() })),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const { productId } = req.body as { productId: string };
      const product = await ProductModel.findOne({ _id: productId, storeId });
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      const pid = new mongoose.Types.ObjectId(productId);
      let list = await WishlistModel.findOne({ storeId, userId: req.user!.id });
      if (!list) {
        list = await WishlistModel.create({
          storeId,
          userId: req.user!.id,
          productIds: [pid],
        });
      } else {
        const has = list.productIds.some((id) => id.equals(pid));
        if (has) {
          list.productIds = list.productIds.filter((id) => !id.equals(pid));
        } else {
          list.productIds.push(pid);
        }
        await list.save();
      }
      res.json({
        success: true,
        data: { productIds: list.productIds.map((id) => id.toString()) },
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
