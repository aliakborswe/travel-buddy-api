import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TravelPlanRoutes } from "../modules/travel-plans/travel.route";
import { ReviewRoutes } from "../modules/reviews/reviews.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { MatchingRoutes } from "../modules/matching/matching.route";
import { UploadRoutes } from "../upload/upload.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/travel-plans",
    route: TravelPlanRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/matching",
    route: MatchingRoutes,
  },
  {
    path: "/upload",
    route: UploadRoutes,
  },
];

moduleRoutes.forEach((route) => {
  if (route.route) {
    router.use(route.path, route.route);
  }
});
