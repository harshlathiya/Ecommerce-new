import mongoose, { Schema, type InferSchemaType } from "mongoose";

const couponSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    code: { type: String, required: true, uppercase: true, trim: true },
    percentOff: { type: Number, min: 0, max: 100 },
    amountOff: { type: Number, min: 0 },
    expiresAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ storeId: 1, code: 1 }, { unique: true });

export type CouponDoc = InferSchemaType<typeof couponSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const CouponModel = mongoose.model("Coupon", couponSchema);
