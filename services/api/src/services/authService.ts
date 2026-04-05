import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import type { UserRole } from "@ecom/utils";
import { config } from "../config.js";
import type { JwtPayload } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";

const SALT = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpires,
  } as jwt.SignOptions);
}

export async function createUser(input: {
  email: string;
  password: string;
  role?: UserRole;
  storeId?: string;
  firstName?: string;
  lastName?: string;
}) {
  const passwordHash = await hashPassword(input.password);
  const user = await UserModel.create({
    email: input.email,
    passwordHash,
    role: input.role ?? "customer",
    storeId: input.storeId,
    firstName: input.firstName,
    lastName: input.lastName,
  });
  return user;
}

export async function issueResetToken(email: string): Promise<string | null> {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  const token = nanoid(48);
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60);
  await user.save();
  return token;
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<boolean> {
  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) return false;
  user.passwordHash = await hashPassword(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  return true;
}
