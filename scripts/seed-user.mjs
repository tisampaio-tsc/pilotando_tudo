/**
 * Gera hash PBKDF2 e SQL para inserir usuário adriana.
 * Uso: node scripts/seed-user.mjs
 * Depois: npx wrangler d1 execute adriana-cms --remote --file=db/seed-user.sql
 */
import { webcrypto } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const USERNAME = "adriana";
const PASSWORD = "132213";
const ITERATIONS = 100000;

async function hashPassword(password, saltBase64) {
  const salt = Buffer.from(saltBase64, "base64");
  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await webcrypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return Buffer.from(hashBuffer).toString("base64");
}

const saltBytes = webcrypto.getRandomValues(new Uint8Array(16));
const salt = Buffer.from(saltBytes).toString("base64");
const passwordHash = await hashPassword(PASSWORD, salt);

const sql = `-- Seed gerado automaticamente — usuário: ${USERNAME}
DELETE FROM users WHERE username = '${USERNAME}';
INSERT INTO users (username, password_hash, salt) VALUES (
  '${USERNAME}',
  '${passwordHash}',
  '${salt}'
);
`;

writeFileSync(join(__dirname, "..", "db", "seed-user.sql"), sql, "utf8");
console.log("Arquivo db/seed-user.sql gerado com sucesso.");
console.log("Execute: npx wrangler d1 execute adriana-cms --remote --file=db/seed-user.sql");
