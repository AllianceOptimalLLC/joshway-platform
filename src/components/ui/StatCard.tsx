import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: string;
  accent?: "cyan" | "purple" | "emerald" | "amber";
}

const accents = {
  cyan: "from-joshway-cyan/20 to-transparent text-joshway-cyan",
  purple: "from-joshway-purple/20 to-transparent text-joshway-purple",
  emerald: "from-emerald-500/20 to-transparent text-emerald-400",
  amber: "from-amber-500/20 to-transparent text-amber-400",
};

export function StatCard({ label, value, icon: Icon, trend, accent = "cyan" }: StatCardProps) {
  return (
    <div className="surface-card p-5 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${accents[accent]} opacity-50 group-hover:opacity-70 transition-opacity`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
          {Icon && (
            <div className={`p-2 rounded-lg bg-white/5 ${accents[accent].split(" ").pop()}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="stat-value">{value}</div>
        {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
      </div>
    </div>
  );
}