import { ExternalLink, Headphones, LayoutGrid, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useBaseCampApps } from "@/hooks/useFederatedData";
import { baseCampTickets } from "@/data/mock";

export default function BaseCamp() {
  const { data, isLoading } = useBaseCampApps();
  const apps = data?.data ?? [];
  const source = data?.source ?? "mock";

  return (
    <div className="module-accent-basecamp space-y-8">
      <PageHeader
        eyebrow="JOSHWAY Base Camp"
        title="Staff Command Hub"
        subtitle="Tools, team, and internal operations for @joshway.org"
        action={<DataSourceBadge source={source} />}
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Apps" value={String(apps.length)} accent="emerald" />
        <StatCard label="Open tickets" value="2" accent="amber" />
        <StatCard label="Team" value="24" icon={Users} accent="cyan" />
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-lg">App Launcher</h2>
        </div>
        {isLoading ? (
          <div className="surface-card p-8 text-center text-gray-500">Loading apps…</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {apps.map((app) => {
              const card = (
                <>
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">{app.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{app.category}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                </>
              );
              return app.url.startsWith("/") ? (
                <Link key={app.name} to={app.url} className="surface-card-hover p-4 flex items-center justify-between group">
                  {card}
                </Link>
              ) : (
                <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" className="surface-card-hover p-4 flex items-center justify-between group">
                  {card}
                </a>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-joshway-purple" />
          <h2 className="font-bold text-lg">IT Help Desk</h2>
        </div>
        <div className="space-y-2">
          {baseCampTickets.map((t) => (
            <div key={t.id} className="surface-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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