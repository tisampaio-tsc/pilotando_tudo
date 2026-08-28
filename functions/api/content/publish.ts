import type { Env } from "../../../_shared/types";
import { jsonResponse, requireAuth } from "../../../_shared/auth";
import {
  ensureDeployStatus,
  getDraftContent,
  publishContent,
} from "../../../_shared/db";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const secret = env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  await ensureDeployStatus(env.DB);

  let contentJson: string;
  const body = await request.json().catch(() => null);

  if (body && typeof body === "object" && body !== null) {
    contentJson = JSON.stringify(body);
  } else {
    const draft = await getDraftContent(env.DB);
    if (!draft) {
      return jsonResponse({ error: "Nenhum rascunho para publicar" }, 400);
    }
    contentJson = draft;
  }

  const versionId = await publishContent(env, contentJson);

  return jsonResponse({
    ok: true,
    versionId,
    message: env.DEPLOY_HOOK_URL
      ? "Publicado! O site será atualizado em 1-2 minutos."
      : "Conteúdo publicado. Configure DEPLOY_HOOK_URL para rebuild automático.",
  });
};
