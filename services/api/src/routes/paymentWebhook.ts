import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../utils/validate.js";
import { OrderModel } from "../models/Order.js";

const router = Router();

const webhookBody = z.object({
  provider: z.enum(["stripe", "razorpay"]),
  orderId: z.string(),
  signature: z.string().optional(),
  paid: z.boolean(),
});

router.post("/", validateBody(webhookBody), async (req, res, next) => {
  try {
    const { orderId, paid } = req.body as z.infer<typeof webhookBody>;
    if (!paid) {
      res.json({ success: true, data: { ok: true } });
      return;
    }
    await OrderModel.findByIdAndUpdate(orderId, { $set: { status: "paid" } });
    res.json({ success: true, data: { ok: true } });
  } catch (e) {
    next(e);
  }
});

export default router;
