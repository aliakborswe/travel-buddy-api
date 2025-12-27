import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPaymentValidation } from "./payment.validation";

const router = Router();

router.post(
  "/create-intent",
  checkAuth(),
  validateRequest(createPaymentValidation),
  PaymentController.createPaymentIntent
);

router.post("/confirm", checkAuth(), PaymentController.confirmPayment);

router.get("/history", checkAuth(), PaymentController.getPaymentHistory);

router.post("/webhook", PaymentController.webhookHandler);

export const PaymentRoutes = router;
