import { baseCampApps, baseCampTickets } from "@/data/mock";
import { ExternalLink, Headphones, LayoutGrid, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

export default function BaseCamp() {
  return (
    <div className="module-accent-basecamp space-y-8">
      <PageHeader
        eyebrow="JOSHWAY Base Camp"
        title="Staff Command Hub"
        subtitle="Tools, team, and internal operations for @joshway.org"
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Apps" value="5" accent="emerald" />
        <StatCard label="Open tickets" value="2" accent="amber" />
        <StatCard label="Team" value="24" icon={Users} accent="cyan" />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-lg">App Launcher</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {baseCampApps.map((app) => (
            <Link
              key={app.name}
              to={app.url.startsWith("/") ? app.url : "#"}
              className="surface-card-hover p-4 flex items-center justify-between group"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">{app.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{app.category}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-joshway-purple" />
          <h2 className="font-bold text-lg">IT Help Desk</h2>
        </div>
        <div className="space-y-2">
          {baseCampTickets.map((t) => (
            <div key={t.id} className="surface-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/20 transition-colors">
              <div>
                <span className="text-[10px] font-mono text-gray-600">{t.id}</span>
                <div className="font-medium text-white mt-0.5">{t.subject}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="badge-pill bg-amber-500/15 text-amber-300 border border-amber-500/20">{t.status}</span>
                <span className="badge-pill bg-white/5 text-gray-400 border border-white/10">{t.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}