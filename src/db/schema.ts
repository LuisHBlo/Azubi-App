import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const betriebe = sqliteTable("betriebe", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

// Rollen: azubi | ausbilder | admin (Betriebsadmin). Später erweiterbar: innung, berufsschule.
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  betriebId: text("betrieb_id").notNull().references(() => betriebe.id),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role", { enum: ["azubi", "ausbilder", "admin"] }).notNull(),
  passwordHash: text("password_hash").notNull(),
  beruf: text("beruf").notNull().default("Anlagenmechaniker SHK"),
  lehrjahr: integer("lehrjahr"),
  createdAt: text("created_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
});

export const termine = sqliteTable("termine", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  titel: text("titel").notNull(),
  datum: text("datum").notNull(),
  typ: text("typ").notNull(),
}, (t) => [index("termine_user").on(t.userId, t.datum)]);

export const pruefungen = sqliteTable("pruefungen", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  titel: text("titel").notNull(),
  datum: text("datum").notNull(),
  notiz: text("notiz").notNull().default(""),
  note: text("note"),
}, (t) => [index("pruefungen_user").on(t.userId, t.datum)]);

export const karten = sqliteTable("karten", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  thema: text("thema").notNull(),
  frage: text("frage").notNull(),
  antwort: text("antwort").notNull(),
  fsrs: text("fsrs").notNull(),
  due: text("due").notNull(),
}, (t) => [index("karten_due").on(t.userId, t.due)]);

export const berichte = sqliteTable("berichte", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  woche: text("woche").notNull(),
  taetigkeiten: text("taetigkeiten").notNull().default(""),
  unterweisung: text("unterweisung").notNull().default(""),
  berufsschule: text("berufsschule").notNull().default(""),
  status: text("status", { enum: ["entwurf", "eingereicht", "freigegeben", "zurueck"] }).notNull().default("entwurf"),
  feedback: text("feedback").notNull().default(""),
  createdAt: text("created_at").notNull(),
}, (t) => [index("berichte_user").on(t.userId, t.woche)]);

// Vom Betrieb (Ausbilder) gepflegte Master-Karten. Werden an alle Azubis des Betriebs kopiert.
export const betriebskarten = sqliteTable("betriebskarten", {
  id: text("id").primaryKey(),
  betriebId: text("betrieb_id").notNull().references(() => betriebe.id, { onDelete: "cascade" }),
  thema: text("thema").notNull(),
  frage: text("frage").notNull(),
  antwort: text("antwort").notNull(),
});
