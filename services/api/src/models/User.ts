import mongoose, { Schema, type InferSchemaType } from "mongoose";
import type { UserRole } from "@ecom/utils";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "store_admin", "customer"] satisfies UserRole[],
      default: "customer",
    },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", index: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, storeId: 1 });

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const UserModel = mongoose.model("User", userSchema);
