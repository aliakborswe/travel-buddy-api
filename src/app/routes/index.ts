import { Router } from "express";

export const router = Router();

const moduleRoutes = [
  {
    path: "/health",
    route: null,
  },
];

moduleRoutes.forEach((route) => {
  if (route.route) {
    router.get(route.path, route.route);
  }
});
