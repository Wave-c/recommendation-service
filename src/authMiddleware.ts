/// <reference path="./types/express.d.ts" />
import type { NextFunction, Request, Response } from "express";

function headerString(req: Request, name: string): string | undefined {
  const v = req.headers[name.toLowerCase()];
  if (Array.isArray(v)) return v[0];
  return typeof v === "string" ? v : undefined;
}

/**
 * Recommendation-service принимает идентификацию ТОЛЬКО так, как у тебя уже сделано в profile-service:
 * заголовок `X-User-Id` (прокидывается gateway / BFF).
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const xUserId = headerString(req, "x-user-id")?.trim();

  if (!xUserId) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Send X-User-Id header (same contract as profile-service).",
    });
    return;
  }

  req.user = { userUuid: xUserId };
  next();
}
