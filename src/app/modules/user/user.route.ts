import { Router } from "express";
import { UserController } from "./user.controller";
import { updateUserValidation } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get("/me", checkAuth(), UserController.getCurrentUser);

router.get("/:id", UserController.getUserById);

router.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateUserValidation),
  UserController.updateUser
);

router.get("/", checkAuth(["admin"]), UserController.getAllUsers);

router.delete("/:id", checkAuth(["admin"]), UserController.deleteUser);

export const UserRoutes = router;
