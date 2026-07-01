import { Database, FlaskConical } from "lucide-react";

export function DataSourceBadge({ source }: { source: "live" | "mock" }) {
  const live = source === "live";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide border ${
        live
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
          : "bg-white/5 text-gray-500 border-white/10"
      }`}
    >
      {live ? <Database className="w-3 h-3" /> : <FlaskConical className="w-3 h-3" />}
      {live ? "Live DB" : "Mock"}
    </span>
  );
}