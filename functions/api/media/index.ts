import type { Env } from "../../_shared/types";
import { jsonResponse, requireAuth } from "../../_shared/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const secret = context.env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(context.request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  const listed = await context.env.MEDIA.list();
  const files = await Promise.all(
    (listed.objects ?? []).map(async (obj) => ({
      key: obj.key,
      url: `/img/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded.toISOString(),
    }))
  );

  files.sort(
    (a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime()
  );

  return jsonResponse({ files });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const secret = env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonResponse({ error: "Arquivo não enviado" }, 400);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return jsonResponse(
      { error: "Tipo de arquivo não permitido. Use JPG, PNG ou WebP." },
      400
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return jsonResponse({ error: "Arquivo muito grande (máx. 5 MB)" }, 400);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)
    ? ext
    : "jpg";
  const key = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return jsonResponse({
    ok: true,
    key,
    url: `/img/${key}`,
  });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const secret = context.env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(context.request, secret);
  if (!session) return jsonResponse({ error: "Não autorizado" }, 401);

  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return jsonResponse({ error: "Parâmetro key é obrigatório" }, 400);
  }

  await context.env.MEDIA.delete(key);
  return jsonResponse({ ok: true });
};
