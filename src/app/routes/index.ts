import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TravelPlanRoutes } from "../modules/travel-plans/travel.route";

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
];

moduleRoutes.forEach((route) => {
  if (route.route) {
    router.use(route.path, route.route);
  }
});
