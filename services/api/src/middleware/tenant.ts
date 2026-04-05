import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { StoreModel } from "../models/Store.js";

export async function resolveTenant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const headerId = req.header("x-store-id");
    const queryId = typeof req.query.storeId === "string" ? req.query.storeId : undefined;
    const raw = headerId || queryId;
    if (!raw) {
      res.status(400).json({ success: false, error: "Missing store context" });
      return;
    }
    if (!mongoose.isValidObjectId(raw)) {
      res.status(400).json({ success: false, error: "Invalid store id" });
      return;
    }
    const store = await StoreModel.findById(raw).lean();
    if (!store) {
      res.status(404).json({ success: false, error: "Store not found" });
      return;
    }
    req.storeId = raw;
    next();
  } catch (e) {
    next(e);
  }
}

/** Allows anonymous shoppers; authenticated users must belong to the store (or be super admin). */
export function requireStoreAccess(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const uid = req.user;
  if (!uid) {
    next();
    return;
  }
  if (uid.role === "super_admin") {
    next();
    return;
  }
  if (uid.role === "store_admin" && uid.storeId === req.storeId) {
    next();
    return;
  }
  if (uid.role === "customer") {
    next();
    return;
  }
  res.status(403).json({ success: false, error: "Forbidden" });
}

export function requireStoreAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const u = req.user;
  if (!u) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  if (u.role === "super_admin") {
    next();
    return;
  }
  if (u.role === "store_admin" && u.storeId === req.storeId) {
    next();
    return;
  }
  res.status(403).json({ success: false, error: "Admin only" });
}
