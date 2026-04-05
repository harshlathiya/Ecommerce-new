import mongoose, { Schema, type InferSchemaType } from "mongoose";

const cartItemSchema = new Schema(
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

const cartSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestToken: { type: String, index: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

cartSchema.index({ storeId: 1, userId: 1 });
cartSchema.index({ storeId: 1, guestToken: 1 });

export type CartDoc = InferSchemaType<typeof cartSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const CartModel = mongoose.model("Cart", cartSchema);
