import type { Env } from "../../_shared/types";
import { jsonResponse, requireAuth } from "../../_shared/auth";
import { getDraftContent, getPublishedContent, saveDraft } from "../../_shared/db";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const secret = context.env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(context.request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  const draft = await getDraftContent(context.env.DB);
  const published = await getPublishedContent(context.env.DB);

  if (!draft) {
    return jsonResponse({ error: "Conteúdo não encontrado" }, 404);
  }

  return jsonResponse({
    draft: JSON.parse(draft),
    published: published ? JSON.parse(published) : JSON.parse(draft),
    hasUnpublishedChanges: draft !== published,
  });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const secret = env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  let content: unknown;
  try {
    content = await request.json();
  } catch {
    return jsonResponse({ error: "JSON inválido" }, 400);
  }

  const contentJson = JSON.stringify(content);
  await saveDraft(env.DB, contentJson);

  const published = await getPublishedContent(env.DB);

  return jsonResponse({
    ok: true,
    hasUnpublishedChanges: contentJson !== published,
  });
};
