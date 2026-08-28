/**
 * Baixa conteúdo publicado da API antes do build.
 * Fallback: content/site.json local se a API não estiver disponível.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const localPath = join(root, "content", "site.json");
const apiUrl =
  process.env.CONTENT_API_URL ??
  process.env.SITE_URL ??
  "https://pilotando-tudo.pages.dev";

async function fetchPublished() {
  const url = `${apiUrl.replace(/\/$/, "")}/api/content/published`;
  console.log(`[fetch-content] Tentando: ${url}`);

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  try {
    const content = await fetchPublished();
    writeFileSync(localPath, JSON.stringify(content, null, 2), "utf8");
    console.log("[fetch-content] Conteúdo publicado baixado com sucesso.");
  } catch (err) {
    if (existsSync(localPath)) {
      console.warn(
        `[fetch-content] API indisponível (${err.message}). Usando content/site.json local.`
      );
    } else {
      console.error("[fetch-content] Sem fallback local disponível.");
      process.exit(1);
    }
  }
}

main();
