import type { Env } from "./types";

export async function getPublishedContent(db: D1Database): Promise<string | null> {
  const row = await db
    .prepare("SELECT published_json FROM content WHERE id = 1")
    .first<{ published_json: string }>();
  return row?.published_json ?? null;
}

export async function getDraftContent(db: D1Database): Promise<string | null> {
  const row = await db
    .prepare("SELECT draft_json, published_json FROM content WHERE id = 1")
    .first<{ draft_json: string; published_json: string }>();
  return row?.draft_json ?? row?.published_json ?? null;
}

export async function saveDraft(
  db: D1Database,
  contentJson: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO content (id, draft_json, published_json, updated_at)
       VALUES (1, ?, COALESCE((SELECT published_json FROM content WHERE id = 1), ?), datetime('now'))
       ON CONFLICT(id) DO UPDATE SET draft_json = ?, updated_at = datetime('now')`
    )
    .bind(contentJson, contentJson, contentJson)
    .run();
}

export async function publishContent(
  env: Env,
  contentJson: string
): Promise<number> {
  await env.DB.prepare(
    `UPDATE content SET published_json = ?, draft_json = ?, updated_at = datetime('now') WHERE id = 1`
  )
    .bind(contentJson, contentJson)
    .run();

  const result = await env.DB.prepare(
    "INSERT INTO versions (content_json, published_at) VALUES (?, datetime('now'))"
  )
    .bind(contentJson)
    .run();

  await env.DB.prepare(
    `UPDATE deploy_status SET status = 'building', started_at = datetime('now'), completed_at = NULL, message = 'Publicação iniciada' WHERE id = 1`
  ).run();

  if (env.DEPLOY_HOOK_URL) {
    try {
      await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
    } catch {
      await env.DB.prepare(
        `UPDATE deploy_status SET message = 'Conteúdo salvo, mas falha ao acionar rebuild' WHERE id = 1`
      ).run();
    }
  }

  return result.meta.last_row_id ?? 0;
}

export async function ensureDeployStatus(db: D1Database): Promise<void> {
  await db
    .prepare(
      `INSERT OR IGNORE INTO deploy_status (id, status) VALUES (1, 'idle')`
    )
    .run();
}
