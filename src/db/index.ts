import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { INIT_SQL } from "./init";
import * as schema from "./schema";

// DATABASE_PATH auf Hostinger außerhalb des Deploy-Ordners setzen, damit Updates die Daten nicht überschreiben.
const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");
fs.mkdirSync(path.dirname(file), { recursive: true });

const g = globalThis as { __sqlite?: Database.Database };
if (!g.__sqlite) {
  g.__sqlite = new Database(file);
  g.__sqlite.pragma("journal_mode = WAL");
  g.__sqlite.pragma("foreign_keys = ON");
  g.__sqlite.exec(INIT_SQL);
}
export const db = drizzle(g.__sqlite, { schema });
export * from "./schema";
