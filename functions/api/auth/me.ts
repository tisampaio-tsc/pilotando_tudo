import type { Env } from "../../_shared/types";
import { jsonResponse, requireAuth } from "../../_shared/auth";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const secret = context.env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(context.request, secret);

  if (!session) {
    return jsonResponse({ authenticated: false }, 401);
  }

  return jsonResponse({
    authenticated: true,
    username: session.username,
  });
};
