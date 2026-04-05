import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { UserRole } from "@ecom/utils";

export interface JwtPayload {
  sub: string;
  role: UserRole;
  storeId?: string;
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : undefined;
  if (!token) {
    next();
    return;
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.sub, role: decoded.role, storeId: decoded.storeId };
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : undefined;
  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.sub, role: decoded.role, storeId: decoded.storeId };
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}

export function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== "super_admin") {
    res.status(403).json({ success: false, error: "Super admin only" });
    return;
  }
  next();
}
