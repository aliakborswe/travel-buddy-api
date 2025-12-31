import { Router } from "express";
import { ReviewController } from "./reviews.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createReviewValidation,
  updateReviewValidation,
} from "./reviews.validation";

const router = Router();

router.post(
  "/",
  checkAuth(),
  validateRequest(createReviewValidation),
  ReviewController.createReview
);

router.get("/reviewable", checkAuth(), ReviewController.getReviewablePlans);

router.get("/user/:userId", ReviewController.getReviewsByUser);

router.get(
  "/travel-plan/:travelPlanId",
  ReviewController.getReviewsByTravelPlan
);

router.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateReviewValidation),
  ReviewController.updateReview
);

router.delete("/:id", checkAuth(), ReviewController.deleteReview);

export const ReviewRoutes = router;
