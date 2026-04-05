import { Router } from "express";
import { z } from "zod";
import { rateLimit } from "express-rate-limit";
import {
  createUser,
  issueResetToken,
  resetPasswordWithToken,
  signToken,
  verifyPassword,
} from "../services/authService.js";
import { sendPasswordResetEmail } from "../services/emailStub.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../utils/validate.js";
import { UserModel } from "../models/User.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["super_admin", "store_admin", "customer"]).optional(),
  storeId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

router.post(
  "/signup",
  authLimiter,
  validateBody(signupSchema),
  async (req, res, next) => {
    try {
      const body = req.body as z.infer<typeof signupSchema>;
      const exists = await UserModel.findOne({ email: body.email.toLowerCase() });
      if (exists) {
        res.status(409).json({ success: false, error: "Email already registered" });
        return;
      }
      if (body.role === "super_admin") {
        const count = await UserModel.countDocuments({ role: "super_admin" });
        if (count > 0) {
          res.status(403).json({ success: false, error: "Super admin exists" });
          return;
        }
      }
      const user = await createUser({
        email: body.email,
        password: body.password,
        role: body.role,
        storeId: body.storeId,
        firstName: body.firstName,
        lastName: body.lastName,
      });
      const token = signToken({
        sub: user._id.toString(),
        role: user.role,
        storeId: user.storeId?.toString(),
      });
      res.json({
        success: true,
        data: {
          user: {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
            storeId: user.storeId?.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token,
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }
    const token = signToken({
      sub: user._id.toString(),
      role: user.role,
      storeId: user.storeId?.toString(),
    });
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id.toString(),
          email: user.email,
          role: user.role,
          storeId: user.storeId?.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user!.id).lean();
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id.toString(),
          email: user.email,
          role: user.role,
          storeId: user.storeId?.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

const forgotSchema = z.object({ email: z.string().email() });

router.post("/forgot-password", authLimiter, validateBody(forgotSchema), async (req, res, next) => {
  try {
    const { email } = req.body as z.infer<typeof forgotSchema>;
    const token = await issueResetToken(email);
    if (token) {
      sendPasswordResetEmail(email, token);
    }
    res.json({
      success: true,
      data: { message: "If the email exists, reset instructions were sent." },
    });
  } catch (e) {
    next(e);
  }
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

router.post("/reset-password", authLimiter, validateBody(resetSchema), async (req, res, next) => {
  try {
    const { token, password } = req.body as z.infer<typeof resetSchema>;
    const ok = await resetPasswordWithToken(token, password);
    if (!ok) {
      res.status(400).json({ success: false, error: "Invalid or expired token" });
      return;
    }
    res.json({ success: true, data: { message: "Password updated" } });
  } catch (e) {
    next(e);
  }
});

export default router;
