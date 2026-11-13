import { asc, eq } from "drizzle-orm";
import { db, users } from "@/db";
import { requireRole } from "@/lib/auth";
import { NutzerForm, ResetForm } from "./Forms";

const rolle = { azubi: "Azubi", ausbilder: "Ausbilder", admin: "Betriebsadmin" } as const;

export default async function Verwaltung() {
  const me = await requireRole("ausbilder", "admin");
  const liste = db.select().from(users).where(eq(users.betriebId, me.betriebId)).orderBy(asc(users.role), asc(users.name)).all();
  return (
    <div className="max-w-3xl">
      <h1 className="h1">Nutzer</h1>
      <p className="sub">Zugänge für Azubis und Ausbilder deines Betriebs anlegen. Neue Azubis bekommen automatisch alle Betriebskarten.</p>
      <NutzerForm admin={me.role === "admin"} />
      <div className="card">
        {liste.map((u) => (
          <div key={u.id} className="flex items-start justify-between border-b py-3 text-sm last:border-0" style={{ borderColor: "var(--line)" }}>
            <div><b className="font-medium">{u.name}</b> <span className="badge ml-1">{rolle[u.role]}{u.lehrjahr ? ` · ${u.lehrjahr}. LJ` : ""}</span>
              <div style={{ color: "var(--muted)" }}>{u.email}</div></div>
            {(u.role === "azubi" || me.role === "admin") && u.id !== me.id && <ResetForm id={u.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
