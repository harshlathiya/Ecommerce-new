import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireStoreAdmin } from "../middleware/tenant.js";
import { validateBody } from "../utils/validate.js";
import { CouponModel } from "../models/Coupon.js";

const router = Router({ mergeParams: true });

router.get("/", requireAuth, requireStoreAdmin, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const coupons = await CouponModel.find({ storeId }).sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: {
        coupons: coupons.map((c) => ({
          _id: c._id.toString(),
          storeId: c.storeId.toString(),
          code: c.code,
          percentOff: c.percentOff,
          amountOff: c.amountOff,
          expiresAt: c.expiresAt,
          active: c.active,
        })),
      },
    });
  } catch (e) {
    next(e);
  }
});

const createSchema = z.object({
  code: z.string().min(2),
  percentOff: z.number().min(0).max(100).optional(),
  amountOff: z.number().min(0).optional(),
  expiresAt: z.string().optional(),
  active: z.boolean().optional(),
});

router.post(
  "/",
  requireAuth,
  requireStoreAdmin,
  validateBody(createSchema),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const body = req.body as z.infer<typeof createSchema>;
      const coupon = await CouponModel.create({
        storeId,
        code: body.code.toUpperCase(),
        percentOff: body.percentOff,
        amountOff: body.amountOff,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        active: body.active ?? true,
      });
      res.status(201).json({
        success: true,
        data: {
          coupon: {
            _id: coupon._id.toString(),
            storeId: coupon.storeId.toString(),
            code: coupon.code,
            percentOff: coupon.percentOff,
            amountOff: coupon.amountOff,
            expiresAt: coupon.expiresAt,
            active: coupon.active,
          },
        },
      });
    } catch (e) {
      if ((e as { code?: number }).code === 11000) {
        res.status(409).json({ success: false, error: "Coupon code exists" });
        return;
      }
      next(e);
    }
  }
);

export default router;
