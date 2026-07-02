import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { PipelineKanban } from "@/components/connect/PipelineKanban";
import { useConnectPipeline } from "@/hooks/useFederatedData";

const stageStyles: Record<string, string> = {
  New: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  Contacted: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  Qualified: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  "Ready for DonorDock": "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

export default function Connect() {
  const navigate = useNavigate();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const { data, isLoading } = useConnectPipeline();
  const pipeline = data ?? { source: "mock" as const, stages: [], contacts: [] };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pipeline.contacts.filter((c) => {
      if (stageFilter && c.stage !== stageFilter) return false;
      if (!q) return true;
      const tags = "tags" in c && Array.isArray(c.tags) ? c.tags.join(" ") : "";
      return `${c.name} ${c.company} ${tags}`.toLowerCase().includes(q);
    });
  }, [pipeline.contacts, query, stageFilter]);

  const openContact = (id: string) => navigate(`/connect/contacts/${id}`);

  return (
    <div className="module-accent-connect space-y-8">
      <PageHeader
        eyebrow="JOSHWAY Connect"
        title="Donor Pipeline"
        subtitle="Relationship intelligence for your development team"
        action={
          <div className="flex items-center gap-2">
            <DataSourceBadge source={pipeline.source} />
            <button
              className="btn-primary opacity-50 cursor-not-allowed"
              title="Contact creation ships with the federation gateway (Phase 1 security)"
              aria-disabled
            >
              <Plus className="w-4 h-4" /> New Contact
            </button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Contacts" value={String(pipeline.contacts.length)} accent="cyan" />
        <StatCard label="Stages" value={String(pipeline.stages.length)} accent="purple" />
        <StatCard label="Pipeline" value={pipeline.source === "live" ? "Live" : "Demo"} accent="emerald" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts, companies, tags..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl surface-card text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-joshway-cyan/40"
          />
        </div>
        <div className="flex rounded-xl border border-white/10 overflow-hidden shrink-0">
          <button
            onClick={() => setView("kanban")}
            className={`px-4 py-2.5 text-sm flex items-center gap-2 ${view === "kanban" ? "bg-joshway-cyan/20 text-white" : "text-gray-500"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Kanban
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2.5 text-sm flex items-center gap-2 ${view === "table" ? "bg-joshway-cyan/20 text-white" : "text-gray-500"}`}
          >
            <List className="w-4 h-4" /> Table
          </button>
        </div>
      </div>

      {pipeline.stages.length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-4">
          <button
            type="button"
            onClick={() => setStageFilter(null)}
            className={`badge-pill border text-xs transition-colors ${
              stageFilter === null
                ? "bg-joshway-cyan/20 text-white border-joshway-cyan/30"
                : "bg-white/5 text-gray-400 border-white/10 hover:text-gray-200"
            }`}
          >
            All stages
          </button>
          {pipeline.stages.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStageFilter(stageFilter === s ? null : s)}
              className={`badge-pill border text-xs transition-colors ${
                stageFilter === s
                  ? (stageStyles[s] ?? "bg-joshway-cyan/20 text-white border-joshway-cyan/30")
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="surface-card p-12 text-center text-gray-500">Loading pipeline…</div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-12 text-center text-gray-500">
          No contacts match{query ? ` "${query}"` : " this filter"}.
        </div>
      ) : view === "kanban" ? (
        <PipelineKanban
          stages={stageFilter ? [stageFilter] : pipeline.stages}
          contacts={filtered}
          onSelect={openContact}
        />
      ) : (
        <div className="table-shell">
          <table className="w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden sm:table-cell">Company</th>
                <th>Stage</th>
                <th className="hidden md:table-cell">Agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openContact(c.id)}
                  className="cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <td className="font-semibold text-white">{c.name}</td>
                  <td className="hidden sm:table-cell text-gray-400">{c.company}</td>
                  <td>
                    <span className={`badge-pill border ${stageStyles[c.stage] ?? "bg-gray-500/15 text-gray-400"}`}>
                      {c.stage}
                    </span>
                  </td>
                  <td className="hidden md:table-cell text-gray-400">{c.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
