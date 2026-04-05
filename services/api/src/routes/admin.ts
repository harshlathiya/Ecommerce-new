import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import { requireStoreAdmin } from "../middleware/tenant.js";
import { OrderModel } from "../models/Order.js";

const router = Router({ mergeParams: true });

router.get("/metrics", requireAuth, requireStoreAdmin, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const oid = new mongoose.Types.ObjectId(storeId);

    const paid = await OrderModel.aggregate([
      { $match: { storeId: oid, status: { $in: ["paid", "shipped", "delivered"] } } },
      { $group: { _id: null, revenue: { $sum: "$total" }, orderCount: { $sum: 1 } } },
    ]);
    const revenue = paid[0]?.revenue ?? 0;
    const orderCount = paid[0]?.orderCount ?? 0;

    const topProducts = await OrderModel.aggregate([
      { $match: { storeId: oid } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          title: { $first: "$items.title" },
          units: { $sum: "$items.quantity" },
        },
      },
      { $sort: { units: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        revenue,
        orderCount,
        topProducts: topProducts.map((r) => ({
          productId: r._id.toString(),
          title: r.title as string,
          units: r.units as number,
        })),
      },
    });
  } catch (e) {
    next(e);
  }
});

export default router;
