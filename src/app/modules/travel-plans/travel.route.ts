import { Router } from "express";
import { TravelPlanController } from "./travel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTravelPlanValidation,
  updateTravelPlanValidation,
} from "./travel.validation";

const router = Router();

router.post(
  "/",
  checkAuth(),
  validateRequest(createTravelPlanValidation),
  TravelPlanController.createTravelPlan
);

router.get("/search", TravelPlanController.searchTravelPlans);

router.get("/", TravelPlanController.getAllTravelPlans);

router.get("/:id", TravelPlanController.getTravelPlanById);

router.patch(
  "/:id",
  checkAuth(),
  validateRequest(updateTravelPlanValidation),
  TravelPlanController.updateTravelPlan
);

router.delete("/:id", checkAuth(), TravelPlanController.deleteTravelPlan);

router.post("/:id/join", checkAuth(), TravelPlanController.requestToJoin);

export const TravelPlanRoutes = router;
