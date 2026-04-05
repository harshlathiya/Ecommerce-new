import mongoose, { Schema, type InferSchemaType } from "mongoose";
import type { OrderStatus } from "@ecom/utils";

const addressSchema = new Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantSku: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    title: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    guestEmail: { type: String, lowercase: true },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
      ] satisfies OrderStatus[],
      default: "pending",
      index: true,
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    shippingAddress: { type: addressSchema, required: true },
    paymentProvider: { type: String, enum: ["stripe", "razorpay"] },
    paymentIntentId: { type: String },
    invoiceNumber: { type: String, unique: true, sparse: true },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ storeId: 1, createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof orderSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const OrderModel = mongoose.model("Order", orderSchema);
