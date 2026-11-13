export const uid = () => crypto.randomUUID();
export const heute = () => new Date().toISOString().slice(0, 10);
export const tageBis = (d: string) => Math.ceil((new Date(d + "T00:00:00").getTime() - new Date(heute() + "T00:00:00").getTime()) / 86400000);
export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${String(w).padStart(2, "0")}`;
}
