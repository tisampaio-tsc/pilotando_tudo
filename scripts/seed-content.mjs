/**
 * Gera SQL para popular conteúdo inicial a partir de content/site.json
 * Uso: node scripts/seed-content.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteJson = readFileSync(
  join(__dirname, "..", "content", "site.json"),
  "utf8"
);
const escaped = siteJson.replace(/'/g, "''");

const sql = `-- Seed de conteúdo inicial
INSERT OR REPLACE INTO content (id, draft_json, published_json, updated_at) VALUES (
  1,
  '${escaped}',
  '${escaped}',
  datetime('now')
);
`;

writeFileSync(join(__dirname, "..", "db", "seed-content.sql"), sql, "utf8");
console.log("Arquivo db/seed-content.sql gerado.");
console.log("Execute: npx wrangler d1 execute adriana-cms --remote --file=db/seed-content.sql");
