import type { Env } from "../../_shared/types";
import { getPublishedContent } from "../../_shared/db";
import { jsonResponse } from "../../_shared/auth";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const published = await getPublishedContent(context.env.DB);

  if (!published) {
    return jsonResponse({ error: "Conteúdo não encontrado" }, 404);
  }

  return new Response(published, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
  });
};
