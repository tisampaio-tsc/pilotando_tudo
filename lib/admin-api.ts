import type { SiteContent } from "./content-schema";

const API = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error ?? `Erro ${res.status}`
    );
  }

  return data as T;
}

export async function checkAuth(): Promise<{
  authenticated: boolean;
  username?: string;
}> {
  try {
    return await request("/auth/me");
  } catch {
    return { authenticated: false };
  }
}

export async function login(
  username: string,
  password: string
): Promise<void> {
  await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(): Promise<void> {
  await request("/auth/logout", { method: "POST" });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await request("/auth/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function fetchDraft(): Promise<{
  draft: SiteContent;
  published: SiteContent;
  hasUnpublishedChanges: boolean;
}> {
  return request("/content/draft");
}

export async function saveDraft(content: SiteContent): Promise<{
  ok: boolean;
  hasUnpublishedChanges: boolean;
}> {
  return request("/content/draft", {
    method: "PUT",
    body: JSON.stringify(content),
  });
}

export async function publishContent(content?: SiteContent): Promise<{
  ok: boolean;
  message: string;
}> {
  return request("/content/publish", {
    method: "POST",
    body: content ? JSON.stringify(content) : "{}",
  });
}

export async function fetchVersions(): Promise<{
  versions: { id: number; published_at: string; label: string | null }[];
}> {
  return request("/content/versions");
}

export async function restoreVersion(versionId: number): Promise<{
  ok: boolean;
  draft: SiteContent;
}> {
  return request("/content/versions", {
    method: "POST",
    body: JSON.stringify({ versionId }),
  });
}

export async function fetchMedia(): Promise<{
  files: { key: string; url: string; size: number; uploaded: string }[];
}> {
  return request("/media");
}

export async function uploadMedia(file: File): Promise<{
  ok: boolean;
  key: string;
  url: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/media`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erro no upload");
  return data;
}

export async function deleteMedia(key: string): Promise<void> {
  await request(`/media?key=${encodeURIComponent(key)}`, {
    method: "DELETE",
  });
}

export async function fetchDeployStatus(): Promise<{
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  message: string | null;
}> {
  return request("/deploy/status");
}

export async function markDeployComplete(): Promise<void> {
  await request("/deploy/status", { method: "POST" });
}

const OFFLINE_KEY = "cms-offline-draft";

export function saveOfflineDraft(content: SiteContent): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(content));
}

export function loadOfflineDraft(): SiteContent | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(OFFLINE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SiteContent;
  } catch {
    return null;
  }
}

export function clearOfflineDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OFFLINE_KEY);
}
