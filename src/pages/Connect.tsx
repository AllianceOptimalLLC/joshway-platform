import { useState } from "react";
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
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const { data, isLoading } = useConnectPipeline();
  const pipeline = data ?? { source: "mock" as const, stages: [], contacts: [] };

  return (
    <div className="module-accent-connect space-y-8">
      <PageHeader
        eyebrow="JOSHWAY Connect"
        title="Donor Pipeline"
        subtitle="Relationship intelligence for your development team"
        action={
          <div className="flex items-center gap-2">
            <DataSourceBadge source={pipeline.source} />
            <button className="btn-primary">
              <Plus className="w-4 h-4" /> New Contact
            </button>
          </div>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Contacts" value={String(pipeline.contacts.length)} accent="purple" />
        <StatCard label="Stages" value={String(pipeline.stages.length)} accent="cyan" />
        <StatCard label="Pipeline" value={pipeline.source === "live" ? "Live" : "Demo"} accent="emerald" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search contacts, companies, tags..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl surface-card text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-joshway-purple/40"
          />
        </div>
        <div className="flex rounded-xl border border-white/10 overflow-hidden shrink-0">
          <button
            onClick={() => setView("kanban")}
            className={`px-4 py-2.5 text-sm flex items-center gap-2 ${view === "kanban" ? "bg-joshway-purple/20 text-white" : "text-gray-500"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Kanban
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2.5 text-sm flex items-center gap-2 ${view === "table" ? "bg-joshway-purple/20 text-white" : "text-gray-500"}`}
          >
            <List className="w-4 h-4" /> Table
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="surface-card p-12 text-center text-gray-500">Loading pipeline…</div>
      ) : view === "kanban" ? (
        <PipelineKanban stages={pipeline.stages} contacts={pipeline.contacts} />
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
              {pipeline.contacts.map((c) => (
                <tr key={c.id}>
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