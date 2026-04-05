import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireStoreAccess, requireStoreAdmin } from "../middleware/tenant.js";
import { validateBody } from "../utils/validate.js";
import { OrderModel } from "../models/Order.js";
import { createPaymentIntentStub } from "../services/paymentService.js";

const router = Router({ mergeParams: true });

const intentSchema = z.object({
  orderId: z.string(),
  provider: z.enum(["stripe", "razorpay"]),
});

router.post(
  "/create-intent",
  requireAuth,
  requireStoreAccess,
  validateBody(intentSchema),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const { orderId, provider } = req.body as z.infer<typeof intentSchema>;
      const order = await OrderModel.findOne({
        _id: orderId,
        storeId,
      });
      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      if (req.user!.role === "customer" && order.userId?.toString() !== req.user!.id) {
        res.status(403).json({ success: false, error: "Forbidden" });
        return;
      }
      if (order.status !== "pending") {
        res.status(400).json({ success: false, error: "Order not payable" });
        return;
      }
      const pi = await createPaymentIntentStub({
        orderId,
        provider,
        amount: order.total,
        currency: order.currency,
      });
      order.paymentProvider = provider;
      order.paymentIntentId = pi.providerOrderId;
      await order.save();
      res.json({
        success: true,
        data: {
          clientSecret: pi.clientSecret,
          orderId: order._id.toString(),
          provider,
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

const refundSchema = z.object({ orderId: z.string() });

router.post(
  "/refund",
  requireAuth,
  requireStoreAdmin,
  validateBody(refundSchema),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const { orderId } = req.body as z.infer<typeof refundSchema>;
      const order = await OrderModel.findOneAndUpdate(
        { _id: orderId, storeId, status: "paid" },
        { $set: { status: "cancelled" } },
        { new: true }
      ).lean();
      if (!order) {
        res.status(404).json({ success: false, error: "Refundable order not found" });
        return;
      }
      res.json({
        success: true,
        data: { message: "Refund queued (integrate Stripe/Razorpay SDK)", order },
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
