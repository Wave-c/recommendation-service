import { Router } from "express";
import type { GetRecommendationsForMe } from "./application/getRecommendationsForMe";
import { requireAuth } from "./authMiddleware";
import { createRecommendationsController } from "./controllers/recommendationsController";

export function createRoutes(getRecommendations: GetRecommendationsForMe): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const recommendationsMe = createRecommendationsController(getRecommendations);
  router.get("/recommendations/me", requireAuth, recommendationsMe);

  return router;
}
