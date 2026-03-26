import type { Request, Response } from "express";
import type { GetRecommendationsForMe } from "../application/getRecommendationsForMe";
import { parseSubjectType } from "../domain/subjectType";

export function createRecommendationsController(useCase: GetRecommendationsForMe) {
  return async function getRecommendationsMe(req: Request, res: Response): Promise<void> {
    const userUuid = req.user?.userUuid;
    if (!userUuid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const subjectType = parseSubjectType(
      typeof req.query.subjectType === "string" ? req.query.subjectType : undefined,
    );
    if (!subjectType) {
      res.status(400).json({ error: "subjectType must be JOB or EXECUTOR" });
      return;
    }

    const xRoles = req.user?.roles;
    if (!xRoles) {
      res.status(401).json({ error: "Unauthorized", message: "Missing X-Roles" });
      return;
    }

    try {
      const items = await useCase.execute(userUuid, xRoles, subjectType);
      res.json({ items });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const isNotFound = message.includes("не удалось найти");
      res.status(isNotFound ? 404 : 500).json({ error: message });
    }
  };
}
