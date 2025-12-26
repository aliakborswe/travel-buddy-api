import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerValidation } from "../user/user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidation),
  AuthController.register
);

router.post("/login", AuthController.login);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
