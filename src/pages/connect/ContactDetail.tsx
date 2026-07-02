import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarClock,
  DollarSign,
  Mail,
  MessageSquareText,
  Phone,
  StickyNote,
  Tag,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataSourceBadge } from "@/components/ui/DataSourceBadge";
import { useConnectContact } from "@/hooks/useConnectContact";
import { maskEmail, maskPhone } from "@/lib/mask";

const stageStyles: Record<string, string> = {
  New: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  Contacted: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  Qualified: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  "Ready for DonorDock": "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

const activityIcon: Record<string, typeof Mail> = {
  email: Mail,
  call: Phone,
  meeting: UserRound,
  stage: CalendarClock,
};

export default function ContactDetail() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useConnectContact(contactId);

  if (isLoading) {
    return (
      <div className="module-accent-connect space-y-8">
        <div className="surface-card p-12 text-center text-gray-500">Loading contact…</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="module-accent-connect space-y-8">
        <button
          type="button"
          onClick={() => navigate("/connect")}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to pipeline
        </button>
        <div className="surface-card p-12 text-center text-red-300">
          {error instanceof Error ? error.message : "Contact not found"}
        </div>
      </div>
    );
  }

  const { contact, source } = data;
  const maskPii = source === "live";

  return (
    <div className="module-accent-connect space-y-8">
      <button
        type="button"
        onClick={() => navigate("/connect")}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Donor Pipeline
      </button>

      <PageHeader
        eyebrow="Connect Contact"
        title={contact.name}
        subtitle={contact.company}
        action={<DataSourceBadge source={source} />}
      />

      <div className="flex items-start gap-3 p-4 rounded-xl border border-joshway-purple/20 bg-joshway-purple/5 text-sm text-purple-200/90">
        <AlertTriangle className="w-5 h-5 shrink-0 text-joshway-purple" />
        <p>
          Read-only preview — contact edits, notes, and stage moves ship with the federation gateway and Supabase Auth (Phase 1 security).
          {maskPii && " Live contact PII is masked in this view."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className={`badge-pill border ${stageStyles[contact.stage] ?? "bg-gray-500/15 text-gray-400 border-white/10"}`}>
          {contact.stage}
        </span>
        {contact.type && (
          <span className="badge-pill bg-white/5 text-gray-300 border border-white/10">{contact.type}</span>
        )}
        {contact.amount !== "—" && (
          <span className="text-sm text-joshway-cyan font-semibold flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {contact.amount.replace("$", "")}
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="surface-card p-6 space-y-5">
          <h2 className="font-bold text-white flex items-center gap-2">
            <UserRound className="w-5 h-5 text-joshway-purple" /> Contact info
          </h2>
          <dl className="grid sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</dt>
              <dd className="text-sm text-gray-200">
                {contact.email ? (maskPii ? maskEmail(contact.email) : contact.email) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Phone</dt>
              <dd className="text-sm text-gray-200">
                {contact.phone ? (maskPii ? maskPhone(contact.phone) : contact.phone) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Assigned agent</dt>
              <dd className="text-sm text-gray-200">{contact.agent}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Source</dt>
              <dd className="text-sm text-gray-200">{contact.source ?? "—"}</dd>
            </div>
          </dl>
          {contact.tags.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((t) => (
                  <span key={t} className="badge-pill text-xs bg-joshway-purple/10 text-purple-300 border border-joshway-purple/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="surface-card p-6 space-y-5">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-joshway-purple" /> Giving snapshot
          </h2>
          <dl className="grid sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Organization</dt>
              <dd className="text-sm text-gray-200">{contact.company}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Pipeline value</dt>
              <dd className="text-sm text-gray-200">{contact.amount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Current stage</dt>
              <dd className="text-sm text-gray-200">{contact.stage}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-500 mb-1">Contact type</dt>
              <dd className="text-sm text-gray-200">{contact.type ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="surface-card p-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-joshway-purple" /> Activity
          </h2>
          {contact.activity.length === 0 ? (
            <p className="text-sm text-gray-500">No activity recorded yet.</p>
          ) : (
            <ol className="space-y-4">
              {contact.activity.map((a, i) => {
                const Icon = activityIcon[a.kind] ?? MessageSquareText;
                return (
                  <li key={i} className="flex gap-3">
                    <span className="w-8 h-8 rounded-full bg-joshway-purple/10 border border-joshway-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-purple-300" />
                    </span>
                    <div>
                      <p className="text-sm text-gray-200">{a.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.date}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="surface-card p-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-joshway-purple" /> Notes
          </h2>
          {contact.notes.length === 0 ? (
            <p className="text-sm text-gray-500">No notes yet.</p>
          ) : (
            <div className="space-y-4">
              {contact.notes.map((n, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-sm text-gray-200 leading-relaxed">{n.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {n.author} · {n.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
