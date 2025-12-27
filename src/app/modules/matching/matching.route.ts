import { Router } from "express";
import { MatchingController } from "./matching.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", MatchingController.findMatches);

router.get("/suggested", checkAuth(), MatchingController.getSuggestedMatches);

export const MatchingRoutes = router;
