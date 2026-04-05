import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { slugify } from "@ecom/utils";

const brandingSchema = new Schema(
  {
    logoUrl: { type: String },
    primaryColor: { type: String },
    secondaryColor: { type: String },
    domain: { type: String },
  },
  { _id: false }
);

const storeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    branding: { type: brandingSchema, default: {} },
  },
  { timestamps: true }
);

storeSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name as string);
  }
  next();
});

export type StoreDoc = InferSchemaType<typeof storeSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const StoreModel = mongoose.model("Store", storeSchema);
