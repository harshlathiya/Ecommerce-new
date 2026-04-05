import { Router } from "express";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { z } from "zod";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { requireStoreAccess } from "../middleware/tenant.js";
import { validateBody } from "../utils/validate.js";
import { CartModel } from "../models/Cart.js";
import { ProductModel } from "../models/Product.js";

const router = Router({ mergeParams: true });

type CartDocument = InstanceType<typeof CartModel>;

async function getOrCreateCart(params: {
  storeId: string;
  userId?: string;
  guestToken?: string;
}): Promise<{ cart: CartDocument; guestToken?: string }> {
  const storeOid = new mongoose.Types.ObjectId(params.storeId);
  if (params.userId) {
    let cart = await CartModel.findOne({
      storeId: storeOid,
      userId: params.userId,
    });
    if (!cart) {
      cart = await CartModel.create({
        storeId: storeOid,
        userId: params.userId,
        items: [],
      });
    }
    return { cart };
  }
  const token = params.guestToken ?? nanoid(24);
  let cart = await CartModel.findOne({
    storeId: storeOid,
    guestToken: token,
  });
  if (!cart) {
    cart = await CartModel.create({
      storeId: storeOid,
      guestToken: token,
      items: [],
    });
  }
  return { cart, guestToken: token };
}

router.get("/", optionalAuth, requireStoreAccess, async (req, res, next) => {
  try {
    const storeId = req.storeId!;
    const guestQ =
      typeof req.query.guestToken === "string" ? req.query.guestToken : undefined;
    if (req.user?.id) {
      const { cart } = await getOrCreateCart({ storeId, userId: req.user.id });
      res.json({ success: true, data: { cart: serializeCart(cart) } });
      return;
    }
    const { cart, guestToken } = await getOrCreateCart({
      storeId,
      guestToken: guestQ,
    });
    res.json({
      success: true,
      data: { cart: serializeCart(cart), guestToken },
    });
  } catch (e) {
    next(e);
  }
});

const itemBody = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
  variantSku: z.string().optional(),
  guestToken: z.string().optional(),
});

router.post(
  "/items",
  optionalAuth,
  requireStoreAccess,
  validateBody(itemBody),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const body = req.body as z.infer<typeof itemBody>;
      const product = await ProductModel.findOne({
        _id: body.productId,
        storeId,
      }).lean();
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      let unitPrice = product.price;
      let variantInv = product.inventory;
      if (body.variantSku && product.variants?.length) {
        const v = product.variants.find((x) => x.sku === body.variantSku);
        if (!v) {
          res.status(400).json({ success: false, error: "Invalid variant" });
          return;
        }
        unitPrice += v.priceDelta ?? 0;
        variantInv = v.inventory;
      }
      if (variantInv < body.quantity) {
        res.status(400).json({ success: false, error: "Insufficient inventory" });
        return;
      }

      let cartDoc: CartDocument;
      let guestTokenOut: string | undefined;
      if (req.user?.id) {
        const r = await getOrCreateCart({ storeId, userId: req.user.id });
        cartDoc = r.cart;
      } else {
        const r = await getOrCreateCart({
          storeId,
          guestToken: body.guestToken,
        });
        cartDoc = r.cart;
        guestTokenOut = r.guestToken ?? r.cart.guestToken ?? undefined;
      }

      const items = cartDoc.items.map((i) => ({
        productId: i.productId,
        variantSku: i.variantSku,
        quantity: i.quantity,
        title: i.title,
        unitPrice: i.unitPrice,
        image: i.image,
      }));
      const idx = items.findIndex(
        (i) =>
          i.productId.toString() === body.productId &&
          (i.variantSku ?? "") === (body.variantSku ?? "")
      );
      if (idx >= 0) {
        items[idx].quantity += body.quantity;
      } else {
        items.push({
          productId: new mongoose.Types.ObjectId(body.productId),
          variantSku: body.variantSku,
          quantity: body.quantity,
          title: product.title,
          unitPrice,
          image: product.images?.[0],
        });
      }
      cartDoc.items = items as typeof cartDoc.items;
      await cartDoc.save();
      res.json({
        success: true,
        data: { cart: serializeCart(cartDoc), guestToken: guestTokenOut },
      });
    } catch (e) {
      next(e);
    }
  }
);

const patchBody = z.object({
  productId: z.string(),
  quantity: z.number().min(0),
  variantSku: z.string().optional(),
  guestToken: z.string().optional(),
});

router.patch(
  "/items",
  optionalAuth,
  requireStoreAccess,
  validateBody(patchBody),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const body = req.body as z.infer<typeof patchBody>;
      let cartDoc: CartDocument;
      let guestTokenOut: string | undefined;
      if (req.user?.id) {
        const r = await getOrCreateCart({ storeId, userId: req.user.id });
        cartDoc = r.cart;
      } else {
        const r = await getOrCreateCart({
          storeId,
          guestToken: body.guestToken,
        });
        cartDoc = r.cart;
        guestTokenOut = r.guestToken ?? r.cart.guestToken ?? undefined;
      }
      const items = cartDoc.items.filter((i) => {
        const match =
          i.productId.toString() === body.productId &&
          (i.variantSku ?? "") === (body.variantSku ?? "");
        if (!match) return true;
        return body.quantity > 0;
      });
      if (body.quantity > 0) {
        const idx = items.findIndex(
          (i) =>
            i.productId.toString() === body.productId &&
            (i.variantSku ?? "") === (body.variantSku ?? "")
        );
        if (idx >= 0) items[idx].quantity = body.quantity;
      }
      cartDoc.items = items as typeof cartDoc.items;
      await cartDoc.save();
      res.json({
        success: true,
        data: { cart: serializeCart(cartDoc), guestToken: guestTokenOut },
      });
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  "/items",
  optionalAuth,
  requireStoreAccess,
  validateBody(
    z.object({
      productId: z.string(),
      variantSku: z.string().optional(),
      guestToken: z.string().optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const body = req.body as {
        productId: string;
        variantSku?: string;
        guestToken?: string;
      };
      let cartDoc: CartDocument;
      let guestTokenOut: string | undefined;
      if (req.user?.id) {
        const r = await getOrCreateCart({ storeId, userId: req.user.id });
        cartDoc = r.cart;
      } else {
        const r = await getOrCreateCart({
          storeId,
          guestToken: body.guestToken,
        });
        cartDoc = r.cart;
        guestTokenOut = r.guestToken ?? r.cart.guestToken ?? undefined;
      }
      cartDoc.items = cartDoc.items.filter(
        (i) =>
          !(
            i.productId.toString() === body.productId &&
            (i.variantSku ?? "") === (body.variantSku ?? "")
          )
      ) as typeof cartDoc.items;
      await cartDoc.save();
      res.json({
        success: true,
        data: { cart: serializeCart(cartDoc), guestToken: guestTokenOut },
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/merge",
  requireAuth,
  requireStoreAccess,
  validateBody(z.object({ guestToken: z.string() })),
  async (req, res, next) => {
    try {
      const storeId = req.storeId!;
      const { guestToken } = req.body as { guestToken: string };
      const { cart: userCart } = await getOrCreateCart({
        storeId,
        userId: req.user!.id,
      });
      const guestCart = await CartModel.findOne({ storeId, guestToken });
      if (guestCart) {
        for (const g of guestCart.items) {
          const idx = userCart.items.findIndex(
            (u) =>
              u.productId.equals(g.productId) &&
              (u.variantSku ?? "") === (g.variantSku ?? "")
          );
          if (idx >= 0) {
            userCart.items[idx].quantity += g.quantity;
          } else {
            userCart.items.push(g);
          }
        }
        await guestCart.deleteOne();
        await userCart.save();
      }
      res.json({ success: true, data: { cart: serializeCart(userCart) } });
    } catch (e) {
      next(e);
    }
  }
);

function serializeCart(c: CartDocument) {
  return {
    _id: c._id.toString(),
    storeId: c.storeId.toString(),
    userId: c.userId?.toString(),
    guestToken: c.guestToken ?? undefined,
    items: c.items.map((i) => ({
      productId: i.productId.toString(),
      variantSku: i.variantSku ?? undefined,
      quantity: i.quantity,
      title: i.title,
      unitPrice: i.unitPrice,
      image: i.image ?? undefined,
    })),
    updatedAt: c.updatedAt,
  };
}

export default router;
