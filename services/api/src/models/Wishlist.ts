import mongoose, { Schema, type InferSchemaType } from "mongoose";

const wishlistSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

wishlistSchema.index({ storeId: 1, userId: 1 }, { unique: true });

export type WishlistDoc = InferSchemaType<typeof wishlistSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const WishlistModel = mongoose.model("Wishlist", wishlistSchema);
