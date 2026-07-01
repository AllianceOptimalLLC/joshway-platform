import { Calendar, GraduationCap, Users, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useMissionData } from "@/hooks/useFederatedData";

export default function Mission() {
  const { data, isLoading } = useMissionData();
  const mission = data ?? { students: [], programs: [], source: "mock" as const };

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
                <div key={p.name} className="surface-card-hover p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white">{p.name}</h3>
                    <span className="badge-pill bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{p.status}</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {p.site} · <span className="text-gray-300">{p.sessions} sessions</span> · {p.captains} site captains
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}