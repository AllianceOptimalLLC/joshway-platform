export function formatMissionDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = iso.includes("T") ? new Date(iso) : new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

export function formatMissionTime(time: string | null | undefined): string {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return time;
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m ?? "00"} ${ampm}`;
}

export function statusTone(status: string): string {
  const s = status.toLowerCase();
  if (s === "completed") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/25";
  if (s === "confirmed") return "bg-joshway-cyan/15 text-joshway-cyan border-joshway-cyan/25";
  if (s === "postponed") return "bg-amber-500/15 text-amber-300 border-amber-500/25";
  if (s === "draft") return "bg-white/5 text-gray-400 border-white/10";
  return "bg-white/5 text-gray-300 border-white/10";
}