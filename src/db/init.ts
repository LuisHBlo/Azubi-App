// Einfache Migration beim Start. Später durch drizzle-kit-Migrationen ersetzen (Wechsel auf Postgres).
export const INIT_SQL = `
CREATE TABLE IF NOT EXISTS betriebe (id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, betrieb_id TEXT NOT NULL REFERENCES betriebe(id), email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, role TEXT NOT NULL, password_hash TEXT NOT NULL,
  beruf TEXT NOT NULL DEFAULT 'Anlagenmechaniker SHK', lehrjahr INTEGER, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS termine (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, titel TEXT NOT NULL, datum TEXT NOT NULL, typ TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS termine_user ON termine(user_id, datum);
CREATE TABLE IF NOT EXISTS pruefungen (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, titel TEXT NOT NULL, datum TEXT NOT NULL, notiz TEXT NOT NULL DEFAULT '', note TEXT);
CREATE INDEX IF NOT EXISTS pruefungen_user ON pruefungen(user_id, datum);
CREATE TABLE IF NOT EXISTS karten (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, thema TEXT NOT NULL, frage TEXT NOT NULL, antwort TEXT NOT NULL, fsrs TEXT NOT NULL, due TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS karten_due ON karten(user_id, due);
CREATE TABLE IF NOT EXISTS berichte (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, woche TEXT NOT NULL,
  taetigkeiten TEXT NOT NULL DEFAULT '', unterweisung TEXT NOT NULL DEFAULT '', berufsschule TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'entwurf', feedback TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS berichte_user ON berichte(user_id, woche);
CREATE TABLE IF NOT EXISTS betriebskarten (id TEXT PRIMARY KEY, betrieb_id TEXT NOT NULL REFERENCES betriebe(id) ON DELETE CASCADE, thema TEXT NOT NULL, frage TEXT NOT NULL, antwort TEXT NOT NULL);
`;
