import type { Env } from "../../_shared/types";
import { jsonResponse, requireAuth } from "../../_shared/auth";
import { saveDraft } from "../../_shared/db";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const secret = context.env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(context.request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  const rows = await context.env.DB.prepare(
    "SELECT id, published_at, label FROM versions ORDER BY published_at DESC LIMIT 20"
  ).all<{ id: number; published_at: string; label: string | null }>();

  return jsonResponse({ versions: rows.results ?? [] });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const secret = env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  let body: { versionId?: number };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Dados inválidos" }, 400);
  }

  if (!body.versionId) {
    return jsonResponse({ error: "versionId é obrigatório" }, 400);
  }

  const version = await env.DB.prepare(
    "SELECT content_json FROM versions WHERE id = ?"
  )
    .bind(body.versionId)
    .first<{ content_json: string }>();

  if (!version) {
    return jsonResponse({ error: "Versão não encontrada" }, 404);
  }

  await saveDraft(env.DB, version.content_json);

  return jsonResponse({
    ok: true,
    draft: JSON.parse(version.content_json),
  });
};
