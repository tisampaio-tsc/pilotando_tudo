-- Schema do CMS Adriana Barbosa
-- Executar: npx wrangler d1 execute adriana-cms --remote --file=db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  draft_json TEXT NOT NULL,
  published_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_json TEXT NOT NULL,
  published_at TEXT NOT NULL DEFAULT (datetime('now')),
  label TEXT
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT
);

CREATE TABLE IF NOT EXISTS deploy_status (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  status TEXT NOT NULL DEFAULT 'idle',
  started_at TEXT,
  completed_at TEXT,
  message TEXT
);

CREATE INDEX IF NOT EXISTS idx_versions_published_at ON versions(published_at DESC);
