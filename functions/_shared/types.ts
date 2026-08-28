export interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
  DEPLOY_HOOK_URL?: string;
  SITE_URL?: string;
}

export interface SessionPayload {
  userId: number;
  username: string;
  exp: number;
}
