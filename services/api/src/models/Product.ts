import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { slugify } from "@ecom/utils";

const variantSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String },
    priceDelta: { type: Number, default: 0 },
    inventory: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100 },
    category: { type: String, default: "general", index: true },
    inventory: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    variants: { type: [variantSchema], default: [] },
    seo: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

productSchema.index({ storeId: 1, slug: 1 }, { unique: true });
productSchema.index({ storeId: 1, category: 1 });

productSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title as string);
  }
  next();
});

export type ProductDoc = InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const ProductModel = mongoose.model("Product", productSchema);
