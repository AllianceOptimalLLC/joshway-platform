import { CalendarRange, ExternalLink, Headphones, LayoutGrid, Users, Vote } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useBaseCampApps } from "@/hooks/useFederatedData";
import { useBaseCampVotes, useOverlapPolls } from "@/hooks/useBaseCampExtras";
import { baseCampTickets } from "@/data/mock";
import { formatMissionDate } from "@/lib/mission/format";

const voteStatusTone: Record<string, string> = {
  open: "bg-joshway-cyan/15 text-joshway-cyan border-joshway-cyan/25",
  closed: "bg-white/5 text-gray-400 border-white/10",
};

const outcomeTone: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  rejected: "bg-red-500/15 text-red-300 border-red-500/20",
};

export default function BaseCamp() {
  const { data, isLoading } = useBaseCampApps();
  const apps = data?.data ?? [];
  const source = data?.source ?? "mock";
  const { data: votesData } = useBaseCampVotes();
  const { data: pollsData } = useOverlapPolls();

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
        <StatCard label="Board votes" value={String(votesData?.votes.length ?? 0)} icon={Users} accent="cyan" />
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

      {votesData && (
        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-joshway-cyan" />
              <h2 className="font-bold text-lg">Board Elections</h2>
              <span className="text-xs text-gray-500">read-only</span>
            </div>
            <DataSourceBadge source={votesData.source} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {votesData.votes.map((v) => (
              <article key={v.id} className="surface-card p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-white">{v.candidate_name}</h3>
                    {v.candidate_role && <p className="text-xs text-gray-500 mt-0.5">{v.candidate_role}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {v.status && (
                      <span className={`badge-pill border text-xs capitalize ${voteStatusTone[v.status.toLowerCase()] ?? "bg-white/5 text-gray-300 border-white/10"}`}>
                        {v.status}
                      </span>
                    )}
                    {v.outcome && (
                      <span className={`badge-pill border text-xs capitalize ${outcomeTone[v.outcome.toLowerCase()] ?? "bg-white/5 text-gray-300 border-white/10"}`}>
                        {v.outcome}
                      </span>
                    )}
                  </div>
                </div>
                {v.motivation && (
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{v.motivation}</p>
                )}
                {v.support_areas && v.support_areas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {v.support_areas.map((area) => (
                      <span key={area} className="badge-pill text-[10px] bg-white/5 text-gray-400 border border-white/10">
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {pollsData && (
        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <CalendarRange className="w-5 h-5 text-joshway-purple" />
              <h2 className="font-bold text-lg">Overlap Scheduling</h2>
              <span className="text-xs text-gray-500">read-only</span>
            </div>
            <DataSourceBadge source={pollsData.source} />
          </div>
          <div className="space-y-2">
            {pollsData.polls.map((p) => (
              <div key={p.id} className="surface-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-white">{p.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {p.organizer_name ?? "—"}
                    {p.meeting_minutes ? ` · ${p.meeting_minutes} min` : ""}
                    {p.date_start ? ` · ${formatMissionDate(p.date_start)} – ${formatMissionDate(p.date_end)}` : ""}
                  </div>
                </div>
                <span
                  className={`badge-pill border text-xs shrink-0 ${
                    p.locked_slot_utc
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
                      : "bg-joshway-cyan/15 text-joshway-cyan border-joshway-cyan/25"
                  }`}
                >
                  {p.locked_slot_utc ? "Scheduled" : "Collecting availability"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

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
