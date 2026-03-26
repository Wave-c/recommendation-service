declare global {
  namespace Express {
    interface Request {
      /** После requireAuth: identity из заголовков (как у profile-service). */
      user?: { userUuid: string; roles: string };
    }
  }
}

export {};
