export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  SESSION_SECRET: string;
  DEPLOY_HOOK_URL?: string;
}

export interface SessionPayload {
  userId: number;
  username: string;
  exp: number;
}
