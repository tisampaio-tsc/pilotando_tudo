const SESSION_COOKIE = "cms_session";
const SESSION_DAYS = 30;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const PBKDF2_ITERATIONS = 100000;

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function hashPassword(
  password: string,
  saltBase64: string
): Promise<string> {
  const salt = fromBase64(saltBase64);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return toBase64(hashBuffer);
}

export function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function createSessionToken(
  payload: { userId: number; username: string },
  secret: string
): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const body = JSON.stringify({ ...payload, exp });
  const bodyBytes = new TextEncoder().encode(body);
  const bodyB64 = toBase64Url(
    bodyBytes.buffer.slice(
      bodyBytes.byteOffset,
      bodyBytes.byteOffset + bodyBytes.byteLength
    )
  );
  const key = await getSigningKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(bodyB64)
  );
  return `${bodyB64}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<{ userId: number; username: string } | null> {
  const [bodyB64, sigB64] = token.split(".");
  if (!bodyB64 || !sigB64) return null;

  const key = await getSigningKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(sigB64),
    new TextEncoder().encode(bodyB64)
  );
  if (!valid) return null;

  const bodyJson = new TextDecoder().decode(fromBase64Url(bodyB64));
  const payload = JSON.parse(bodyJson) as {
    userId: number;
    username: string;
    exp: number;
  };
  if (payload.exp < Date.now()) return null;
  return { userId: payload.userId, username: payload.username };
}

export function sessionCookie(token: string): string {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

export async function requireAuth(
  request: Request,
  secret: string
): Promise<{ userId: number; username: string } | null> {
  const token = getSessionToken(request);
  if (!token) return null;
  return verifySessionToken(token, secret);
}

export async function checkLoginLockout(
  db: D1Database,
  ip: string
): Promise<{ locked: boolean; minutesLeft?: number }> {
  const row = await db
    .prepare("SELECT attempts, locked_until FROM login_attempts WHERE ip = ?")
    .bind(ip)
    .first<{ attempts: number; locked_until: string | null }>();

  if (!row?.locked_until) return { locked: false };

  const lockedUntil = new Date(row.locked_until).getTime();
  if (lockedUntil > Date.now()) {
    return {
      locked: true,
      minutesLeft: Math.ceil((lockedUntil - Date.now()) / 60000),
    };
  }

  await db
    .prepare(
      "UPDATE login_attempts SET attempts = 0, locked_until = NULL WHERE ip = ?"
    )
    .bind(ip)
    .run();
  return { locked: false };
}

export async function recordFailedLogin(
  db: D1Database,
  ip: string
): Promise<void> {
  const row = await db
    .prepare("SELECT attempts FROM login_attempts WHERE ip = ?")
    .bind(ip)
    .first<{ attempts: number }>();

  const attempts = (row?.attempts ?? 0) + 1;
  let lockedUntil: string | null = null;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    lockedUntil = new Date(
      Date.now() + LOCKOUT_MINUTES * 60 * 1000
    ).toISOString();
  }

  await db
    .prepare(
      `INSERT INTO login_attempts (ip, attempts, locked_until) VALUES (?, ?, ?)
       ON CONFLICT(ip) DO UPDATE SET attempts = ?, locked_until = ?`
    )
    .bind(ip, attempts, lockedUntil, attempts, lockedUntil)
    .run();
}

export async function clearLoginAttempts(
  db: D1Database,
  ip: string
): Promise<void> {
  await db
    .prepare(
      "UPDATE login_attempts SET attempts = 0, locked_until = NULL WHERE ip = ?"
    )
    .bind(ip)
    .run();
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function jsonResponse(
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}
