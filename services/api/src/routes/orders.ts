import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { requireStoreAccess, requireStoreAdmin } from "../middleware/tenant.js";
import { validateBody } from "../utils/validate.js";
import { CartModel } from "../models/Cart.js";
import { OrderModel } from "../models/Order.js";
import { ProductModel } from "../models/Product.js";
import { UserModel } from "../models/User.js";
import { computeShipping } from "../services/shipping.js";
import { sendOrderConfirmationEmail } from "../services/emailStub.js";
import { nextInvoiceNumber } from "../utils/invoice.js";

const router = Router({ mergeParams: true });

const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  guestEmail: z.string().email().optional(),
  guestToken: z.string().optional(),
  currency: z.string().min(1).default("USD"),
});

router.post(
  "/",
  optionalAuth,
  requireStoreAccess,
  validateBody(createOrderSchema),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const body = req.body as z.infer<typeof createOrderSchema>;
      if (!req.user?.id && !body.guestEmail) {
        res.status(400).json({
          success: false,
          error: "Login or provide guestEmail for checkout",
        });
        return;
      }

      let cart;
      if (req.user?.id) {
        cart = await CartModel.findOne({
          storeId,
          userId: req.user.id,
        });
      } else {
        if (!body.guestToken) {
          res.status(400).json({ success: false, error: "guestToken required" });
          return;
        }
        cart = await CartModel.findOne({ storeId, guestToken: body.guestToken });
      }
      if (!cart || !cart.items.length) {
        res.status(400).json({ success: false, error: "Cart is empty" });
        return;
      }

      let subtotal = 0;
      const orderItems: {
        productId: mongoose.Types.ObjectId;
        variantSku?: string;
        quantity: number;
        title: string;
        unitPrice: number;
        image?: string;
      }[] = [];

      for (const line of cart.items) {
        const product = await ProductModel.findOne({
          _id: line.productId,
          storeId,
        }).lean();
        if (!product) {
          res.status(400).json({ success: false, error: "Invalid cart item" });
          return;
        }
        let unit = product.price;
        let inv = product.inventory;
        if (line.variantSku && product.variants?.length) {
          const v = product.variants.find((x) => x.sku === line.variantSku);
          if (!v) {
            res.status(400).json({ success: false, error: "Invalid variant" });
            return;
          }
          unit += v.priceDelta ?? 0;
          inv = v.inventory;
        }
        if (inv < line.quantity) {
          res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.title}`,
          });
          return;
        }
        const disc = product.discountPercent
          ? unit * (1 - product.discountPercent / 100)
          : unit;
        subtotal += disc * line.quantity;
        orderItems.push({
          productId: line.productId,
          variantSku: line.variantSku ?? undefined,
          quantity: line.quantity,
          title: line.title,
          unitPrice: Math.round(disc * 100) / 100,
          image: line.image ?? undefined,
        });
      }

      const shipping = computeShipping(subtotal);
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const total = Math.round((subtotal + shipping + tax) * 100) / 100;

      const order = await OrderModel.create({
        storeId,
        userId: req.user?.id,
        guestEmail: body.guestEmail?.toLowerCase(),
        status: "pending",
        items: orderItems,
        subtotal,
        shipping,
        tax,
        total,
        currency: body.currency,
        shippingAddress: body.shippingAddress,
        invoiceNumber: nextInvoiceNumber(),
      });

      for (const line of cart.items) {
        if (line.variantSku) {
          await ProductModel.updateOne(
            { _id: line.productId, storeId, "variants.sku": line.variantSku },
            { $inc: { "variants.$.inventory": -line.quantity } }
          );
        } else {
          await ProductModel.updateOne(
            { _id: line.productId, storeId },
            { $inc: { inventory: -line.quantity } }
          );
        }
      }

      cart.set("items", []);
      await cart.save();

      const email = body.guestEmail ?? (await getUserEmail(req.user?.id));
      if (email) {
        sendOrderConfirmationEmail(email, order._id.toString());
      }

      res.status(201).json({
        success: true,
        data: { order: serializeOrder(order.toObject()) },
      });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/", requireAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const filter: Record<string, unknown> = { storeId };
    if (req.user!.role === "customer") {
      filter.userId = req.user!.id;
    }
    const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: { orders: orders.map(serializeOrder) },
    });
  } catch (e) {
    next(e);
  }
});

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
});

router.patch(
  "/:id/status",
  requireAuth,
  requireStoreAdmin,
  validateBody(statusSchema),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const { status } = req.body as z.infer<typeof statusSchema>;
      const order = await OrderModel.findOneAndUpdate(
        { _id: req.params.id, storeId },
        { $set: { status } },
        { new: true }
      ).lean();
      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      res.json({ success: true, data: { order: serializeOrder(order) } });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/:id/invoice", requireAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const order = await OrderModel.findOne({
      _id: req.params.id,
      storeId,
    }).lean();
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }
    if (
      req.user!.role === "customer" &&
      order.userId?.toString() !== req.user!.id
    ) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }
    res.json({
      success: true,
      data: {
        invoice: {
          number: order.invoiceNumber,
          orderId: order._id.toString(),
          items: order.items,
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          currency: order.currency,
          shippingAddress: order.shippingAddress,
          status: order.status,
          createdAt: order.createdAt,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

async function getUserEmail(userId?: string): Promise<string | undefined> {
  if (!userId) return undefined;
  const u = await UserModel.findById(userId).lean();
  return u?.email;
}

function serializeOrder(o: {
  _id: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId | null;
  guestEmail?: string | null;
  status: string;
  items: {
    productId: mongoose.Types.ObjectId;
    variantSku?: string | null;
    quantity: number;
    title: string;
    unitPrice: number;
    image?: string | null;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Record<string, unknown>;
  paymentProvider?: string | null;
  paymentIntentId?: string | null;
  invoiceNumber?: string | null;
  trackingNumber?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    _id: o._id.toString(),
    storeId: o.storeId.toString(),
    userId: o.userId?.toString(),
    guestEmail: o.guestEmail ?? undefined,
    status: o.status,
    items: o.items.map((i) => ({
      productId: i.productId.toString(),
      variantSku: i.variantSku ?? undefined,
      quantity: i.quantity,
      title: i.title,
      unitPrice: i.unitPrice,
      image: i.image ?? undefined,
    })),
    subtotal: o.subtotal,
    shipping: o.shipping,
    tax: o.tax,
    total: o.total,
    currency: o.currency,
    shippingAddress: o.shippingAddress,
    paymentProvider: o.paymentProvider ?? undefined,
    paymentIntentId: o.paymentIntentId ?? undefined,
    invoiceNumber: o.invoiceNumber ?? undefined,
    trackingNumber: o.trackingNumber ?? undefined,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

export default router;
