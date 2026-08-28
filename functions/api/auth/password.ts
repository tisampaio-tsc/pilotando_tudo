import type { Env } from "../../_shared/types";
import {
  generateSalt,
  hashPassword,
  jsonResponse,
  requireAuth,
} from "../../_shared/auth";

interface PasswordBody {
  currentPassword?: string;
  newPassword?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const secret = env.SESSION_SECRET ?? "dev-secret-change-me";
  const session = await requireAuth(request, secret);

  if (!session) {
    return jsonResponse({ error: "Não autorizado" }, 401);
  }

  let body: PasswordBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Dados inválidos" }, 400);
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  if (!currentPassword || !newPassword) {
    return jsonResponse({ error: "Preencha todos os campos" }, 400);
  }

  if (newPassword.length < 6) {
    return jsonResponse(
      { error: "A nova senha deve ter pelo menos 6 caracteres" },
      400
    );
  }

  const user = await env.DB.prepare(
    "SELECT password_hash, salt FROM users WHERE id = ?"
  )
    .bind(session.userId)
    .first<{ password_hash: string; salt: string }>();

  if (!user) {
    return jsonResponse({ error: "Usuário não encontrado" }, 404);
  }

  const currentHash = await hashPassword(currentPassword, user.salt);
  if (currentHash !== user.password_hash) {
    return jsonResponse({ error: "Senha atual incorreta" }, 401);
  }

  const newSalt = generateSalt();
  const newHash = await hashPassword(newPassword, newSalt);

  await env.DB.prepare(
    "UPDATE users SET password_hash = ?, salt = ? WHERE id = ?"
  )
    .bind(newHash, newSalt, session.userId)
    .run();

  return jsonResponse({ ok: true });
};
