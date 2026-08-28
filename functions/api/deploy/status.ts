import type { Env } from "../../_shared/types";
import { jsonResponse, requireAuth } from "../../_shared/auth";
import { ensureDeployStatus } from "../../_shared/db";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const secret = context.env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(context.request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  await ensureDeployStatus(context.env.DB);

  const row = await context.env.DB.prepare(
    "SELECT status, started_at, completed_at, message FROM deploy_status WHERE id = 1"
  ).first<{
    status: string;
    started_at: string | null;
    completed_at: string | null;
    message: string | null;
  }>();

  return jsonResponse({
    status: row?.status ?? "idle",
    startedAt: row?.started_at,
    completedAt: row?.completed_at,
    message: row?.message,
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const secret = context.env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(context.request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  await ensureDeployStatus(context.env.DB);

  await context.env.DB.prepare(
    `UPDATE deploy_status SET status = 'success', completed_at = datetime('now'), message = 'Site atualizado com sucesso!' WHERE id = 1`
  ).run();

  return jsonResponse({ ok: true });
};
