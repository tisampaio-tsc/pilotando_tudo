import type { Env } from "../../_shared/types";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const path = context.params.path as string;
  if (!path) {
    return new Response("Not found", { status: 404 });
  }

  if (!context.env.MEDIA) {
    return new Response("Media storage not configured", { status: 503 });
  }

  const object = await context.env.MEDIA.get(path);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const contentType =
    object.httpMetadata?.contentType ?? MIME[ext] ?? "application/octet-stream";

  return new Response(object.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
