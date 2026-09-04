import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post(
  "/api/auth/register",
  validate(registerSchema),
  authController.register
);

authRouter.post(
  "/api/auth/login",
  validate(loginSchema),
  authController.login
);

authRouter.post(
  "/api/auth/logout",
  authController.logout
);

authRouter.get(
  "/api/auth/me",
  requireAuth,
  authController.getMe
);
