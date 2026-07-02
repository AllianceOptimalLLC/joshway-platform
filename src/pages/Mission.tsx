import { Calendar, ChevronRight, GraduationCap, Users, AlertTriangle, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useMissionData } from "@/hooks/useFederatedData";
import { useMissionOps } from "@/hooks/useMissionOps";
import { formatMissionDate } from "@/lib/mission/format";

const payoutTone: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  payment_created: "bg-joshway-cyan/15 text-joshway-cyan border-joshway-cyan/25",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  submitted: "bg-blue-500/15 text-blue-300 border-blue-500/20",
};

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function Mission() {
  const navigate = useNavigate();
  const { data, isLoading } = useMissionData();
  const mission = data ?? { students: [], programs: [], source: "mock" as const };
  const { data: ops } = useMissionOps();

  return (
    <div className="module-accent-mission space-y-8">
      <PageHeader
        eyebrow="Mission Control"
        title="Program Operations"
        subtitle="Bridge journey, scheduling, and student outcomes"
        action={<DataSourceBadge source={mission.source} />}
      />

      {mission.source === "live" && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-amber-200/90">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <p>
            Live student data is visible because legacy Mission Control RLS allows anon reads — exactly the security issue this rebuild fixes. Emails are masked in UI.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Students" value={String(mission.students.length)} icon={Users} accent="amber" />
        <StatCard label="Programs" value={String(mission.programs.length)} icon={Calendar} accent="cyan" />
        <StatCard label="Source" value={mission.source === "live" ? "Live DB" : "Mock"} icon={GraduationCap} accent="purple" />
      </div>

      {isLoading ? (
        <div className="surface-card p-12 text-center text-gray-500">Loading mission data…</div>
      ) : (
        <>
          <div className="table-shell">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h2 className="font-bold text-white">Student Progress</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th>Student</th>
                  <th className="hidden sm:table-cell">School</th>
                  <th>Pillar</th>
                  <th className="hidden md:table-cell">Email</th>
                  <th className="text-right">Progress</th>
                </tr>
              </thead>
              <tbody>
                {mission.students.map((s) => (
                  <tr key={s.name + s.school}>
                    <td className="font-semibold text-white">{s.name}</td>
                    <td className="hidden sm:table-cell text-gray-400">{s.school}</td>
                    <td className="text-gray-300">{s.pillar}</td>
                    <td className="hidden md:table-cell text-gray-500 font-mono text-xs">
                      {"emailMasked" in s ? s.emailMasked : "—"}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-joshway-purple rounded-full" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{s.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section>
            <h2 className="font-bold text-lg mb-4">Bridge Programs</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {mission.programs.map((p) => (
                <button
                  key={p.id ?? p.name}
                  type="button"
                  onClick={() => navigate(`/mission/programs/${p.id}`)}
                  className="surface-card-hover p-5 text-left w-full group"
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-bold text-white group-hover:text-amber-200 transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="badge-pill bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 capitalize">
                        {p.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {p.site} · <span className="text-gray-300">{p.sessions} sessions</span> · {p.captains} site captains
                  </p>
                  {"startDate" in p && p.startDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      {formatMissionDate(p.startDate)}
                      {"endDate" in p && p.endDate ? ` – ${formatMissionDate(p.endDate)}` : ""}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </section>

          {ops && (
            <section>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-400" /> SME Payouts
                  <span className="text-xs font-normal text-gray-500">read-only · names masked</span>
                </h2>
                <DataSourceBadge source={ops.source} />
              </div>
              <div className="grid sm:grid-cols-4 gap-3 mb-4">
                <StatCard label="Invoices" value={String(ops.totals.invoices)} accent="amber" />
                <StatCard label="Paid" value={String(ops.totals.paid)} accent="emerald" />
                <StatCard label="Pending" value={String(ops.totals.pending)} accent="purple" />
                <StatCard label="Outstanding" value={money(ops.totals.pendingAmount)} accent="cyan" />
              </div>
              <div className="table-shell">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>SME</th>
                      <th>Status</th>
                      <th className="hidden sm:table-cell">Amount</th>
                      <th className="hidden md:table-cell">Verified</th>
                      <th className="text-right">Checklist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ops.payouts.slice(0, 8).map((p) => (
                      <tr key={p.id}>
                        <td className="font-semibold text-white font-mono">{p.smeMasked}</td>
                        <td>
                          <span className={`badge-pill border capitalize ${payoutTone[p.status.toLowerCase()] ?? "bg-white/5 text-gray-300 border-white/10"}`}>
                            {p.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell text-gray-300">
                          {p.amount != null ? money(p.amount) : "—"}
                        </td>
                        <td className="hidden md:table-cell text-gray-400">{p.verified ? "Yes" : "No"}</td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                                style={{ width: `${(p.checklistDone / p.checklistTotal) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-8">
                              {p.checklistDone}/{p.checklistTotal}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}