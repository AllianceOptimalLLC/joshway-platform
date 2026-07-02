import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useMissionProgram } from "@/hooks/useMissionProgram";
import { formatMissionDate, formatMissionTime, statusTone } from "@/lib/mission/format";
import { maskEmail, maskPhone } from "@/lib/mask";

type DetailTab = "overview" | "sessions" | "captains";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "sessions", label: "Sessions" },
  { id: "captains", label: "Site Captains" },
];

const sessionTypeTone: Record<string, string> = {
  core: "bg-joshway-cyan/15 text-joshway-cyan border-joshway-cyan/25",
  addon: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  post_bridge: "bg-joshway-purple/15 text-joshway-purple border-joshway-purple/25",
};

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-200">{value}</dd>
    </div>
  );
}

export default function MissionProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<DetailTab>("overview");
  const { data, isLoading, isError, error } = useMissionProgram(programId);

  if (isLoading) {
    return (
      <div className="module-accent-mission space-y-8">
        <div className="surface-card p-12 text-center text-gray-500">Loading program…</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="module-accent-mission space-y-8">
        <button
          type="button"
          onClick={() => navigate("/mission")}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to programs
        </button>
        <div className="surface-card p-12 text-center text-red-300">
          {error instanceof Error ? error.message : "Program not found"}
        </div>
      </div>
    );
  }

  const { program, sessions, captains, source } = data;
  const maskPii = source === "live";

  return (
    <div className="module-accent-mission space-y-8">
      <button
        type="button"
        onClick={() => navigate("/mission")}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Mission Control
      </button>

      <PageHeader
        eyebrow="Bridge Program"
        title={program.program_name}
        subtitle={`${program.school_name} · ${program.program_type.replace(/_/g, " ")}`}
        action={<DataSourceBadge source={source} />}
      />

      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-amber-200/90">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
        <p>
          Read-only preview — scheduling edits, invites, and writes require the federation gateway and Supabase Auth (Phase 1 security).
          {maskPii && " School contact PII is masked in this view."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className={`badge-pill border capitalize ${statusTone(program.status)}`}>
          {program.status}
        </span>
        <span className="text-sm text-gray-400 flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {formatMissionDate(program.start_date)} – {formatMissionDate(program.end_date)}
        </span>
        <span className="text-sm text-gray-400 flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          {sessions.length} sessions · {captains.length} site captains
        </span>
      </div>

      <div className="flex rounded-xl border border-white/10 overflow-hidden w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm ${
              tab === t.id ? "bg-amber-500/20 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <section className="surface-card p-6 space-y-5">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" /> School & program
            </h2>
            <dl className="grid sm:grid-cols-2 gap-4">
              <Field label="School" value={program.school_name} />
              <Field label="Program type" value={program.program_type.replace(/_/g, " ")} />
              <Field
                label="Grade levels"
                value={program.grade_levels?.length ? program.grade_levels.join(", ") : "—"}
              />
              <Field
                label="Expected students"
                value={program.expected_student_count ?? "—"}
              />
              <Field
                label="Approved sessions"
                value={program.approved_session_count ?? sessions.length}
              />
              <Field label="Address" value={program.address ?? "—"} />
            </dl>
          </section>

          <section className="surface-card p-6 space-y-5">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-400" /> School contact
            </h2>
            <dl className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" value={program.contact_name ?? "—"} />
              <Field
                label="Phone"
                value={
                  program.contact_phone
                    ? maskPii
                      ? maskPhone(program.contact_phone)
                      : program.contact_phone
                    : "—"
                }
              />
              <Field
                label="Email"
                value={
                  program.contact_email
                    ? maskPii
                      ? maskEmail(program.contact_email)
                      : program.contact_email
                    : "—"
                }
              />
              <Field
                label="Preferred days"
                value={program.preferred_days?.length ? program.preferred_days.join(", ") : "—"}
              />
              <Field
                label="Preferred time"
                value={program.preferred_time_of_day ?? "—"}
              />
              <Field
                label="Sponsor"
                value={
                  program.has_sponsor && program.sponsor_name
                    ? program.sponsor_name
                    : program.has_sponsor
                      ? "Yes"
                      : "None"
                }
              />
            </dl>
          </section>

          {program.discovery_notes && (
            <section className="surface-card p-6 lg:col-span-2 space-y-3">
              <h2 className="font-bold text-white">Discovery notes</h2>
              <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {program.discovery_notes}
              </p>
            </section>
          )}
        </div>
      )}

      {tab === "sessions" && (
        <section className="space-y-3">
          {sessions.length === 0 ? (
            <div className="surface-card p-12 text-center text-gray-500">No sessions scheduled yet.</div>
          ) : (
            sessions.map((session, idx) => (
              <article key={session.id} className="surface-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Session {idx + 1}</p>
                    <h3 className="font-bold text-white">{session.session_title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`badge-pill border text-xs capitalize ${
                        sessionTypeTone[session.session_type] ?? "bg-white/5 text-gray-300 border-white/10"
                      }`}
                    >
                      {session.session_type.replace(/_/g, " ")}
                    </span>
                    {session.scheduling_status && (
                      <span className={`badge-pill border text-xs capitalize ${statusTone(session.scheduling_status)}`}>
                        {session.scheduling_status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatMissionDate(session.session_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatMissionTime(session.session_time)}
                  </span>
                  {session.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {session.location}
                    </span>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {tab === "captains" && (
        <section className="space-y-3">
          {captains.length === 0 ? (
            <div className="surface-card p-12 text-center text-gray-500">No site captains assigned yet.</div>
          ) : (
            <div className="table-shell">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="hidden sm:table-cell">Email</th>
                    <th className="hidden md:table-cell">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {captains.map((c) => (
                    <tr key={c.id}>
                      <td className="font-semibold text-white">{c.name}</td>
                      <td className="hidden sm:table-cell text-gray-400">
                        {c.email ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {maskPii ? maskEmail(c.email) : c.email}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="hidden md:table-cell text-gray-400">
                        {c.phone ? (maskPii ? maskPhone(c.phone) : c.phone) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}