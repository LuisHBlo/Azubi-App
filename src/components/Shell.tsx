"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/(auth)/login/actions";

const nav = [
  ["/", "Übersicht"],
  ["/kalender", "Kalender"],
  ["/pruefungen", "Prüfungen & Noten"],
  ["/lernkarten", "Lernkarten"],
  ["/berichtsheft", "Berichtsheft"],
  ["/notizen", "Second Brain"],
  ["/ranking", "Ranking"],
  ["/assistent", "KI-Assistent"],
];
const rolleLabel = { azubi: "Azubi", ausbilder: "Ausbilder", admin: "Betriebsadmin" } as const;

export default function Shell({ user, children }: { user: { name: string; role: "azubi" | "ausbilder" | "admin" }; children: React.ReactNode }) {
  const path = usePathname();
  const items = user.role === "azubi" ? nav : [["/ausbilder", "Azubi-Übersicht"], ["/ausbilder/karten", "Betriebskarten"], ["/verwaltung", "Nutzer"], ["/assistent", "KI-Assistent"]];
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col p-4 text-slate-200" style={{ background: "var(--navy)" }}>
        <div className="mb-8 flex items-center gap-2 px-2 text-base font-semibold text-white">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "var(--accent)" }} />AzubiPro
        </div>
        <nav className="flex flex-col gap-1">
          {items.map(([href, label]) => {
            const active = href === "/" ? path === "/" : href === "/ausbilder" ? path === "/ausbilder" : path.startsWith(href);
            return (
              <Link key={href} href={href} className={`rounded-lg px-3 py-2 text-sm transition ${active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                style={active ? { boxShadow: "inset 2px 0 0 var(--accent)" } : undefined}>{label}</Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/10 px-2 pt-4 text-xs text-slate-400">
          <div className="text-sm text-white">{user.name}</div>
          <div className="mb-2">{rolleLabel[user.role]}</div>
          <form action={logout}><button className="hover:text-white">Abmelden</button></form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-10">{children}</main>
    </div>
  );
}
