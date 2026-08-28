import type { Env } from "../../_shared/types";
import {
  checkLoginLockout,
  clearLoginAttempts,
  createSessionToken,
  getClientIp,
  hashPassword,
  jsonResponse,
  recordFailedLogin,
  sessionCookie,
} from "../../_shared/auth";

interface LoginBody {
  username?: string;
  password?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const ip = getClientIp(request);

  const lockout = await checkLoginLockout(env.DB, ip);
  if (lockout.locked) {
    return jsonResponse(
      {
        error: `Muitas tentativas. Tente novamente em ${lockout.minutesLeft} minutos.`,
      },
      429
    );
  }

  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Dados inválidos" }, 400);
  }

  const username = body.username?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!username || !password) {
    return jsonResponse({ error: "Usuário e senha são obrigatórios" }, 400);
  }

  const user = await env.DB.prepare(
    "SELECT id, username, password_hash, salt FROM users WHERE username = ?"
  )
    .bind(username)
    .first<{ id: number; username: string; password_hash: string; salt: string }>();

  if (!user) {
    await recordFailedLogin(env.DB, ip);
    return jsonResponse({ error: "Usuário ou senha incorretos" }, 401);
  }

  const hash = await hashPassword(password, user.salt);
  if (hash !== user.password_hash) {
    await recordFailedLogin(env.DB, ip);
    return jsonResponse({ error: "Usuário ou senha incorretos" }, 401);
  }

  await clearLoginAttempts(env.DB, ip);

  const secret = env.SESSION_SECRET ?? "dev-secret-change-me";
  const token = await createSessionToken(
    { userId: user.id, username: user.username },
    secret
  );

  return jsonResponse(
    { ok: true, username: user.username },
    200,
    { "Set-Cookie": sessionCookie(token) }
  );
};
