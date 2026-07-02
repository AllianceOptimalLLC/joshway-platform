import { useNavigate } from "react-router-dom";
import { personas } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { federationStatus } from "@/lib/supabase/clients";
import { ArrowRight, Shield, Wifi } from "lucide-react";
import { moduleMeta } from "@/data/modules";
import type { ModuleId } from "@/data/mock";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const fed = federationStatus();

  return (
    <div className="min-h-screen bg-surface bg-mesh flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle compact />
      </div>
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-joshway-cyan to-joshway-purple flex items-center justify-center font-extrabold text-2xl text-joshway-dark mx-auto mb-6 shadow-glow">
            J
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">JOSHWAY Platform</h1>
          <p className="text-gray-400">One experience. Every portal. Role-based access.</p>
        </div>

        <div className="surface-card p-6 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Wifi className={`w-4 h-4 ${fed.live ? "text-emerald-400" : "text-amber-400"}`} />
            {fed.live
              ? "Federated to 4 live Supabase databases"
              : "Supabase keys not configured — mock data only"}
          </div>
          <p className="text-sm text-gray-500 mb-4">Choose a persona to explore the unified platform:</p>
          <div className="space-y-2">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  login(p);
                  navigate("/", { replace: true });
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-joshway-cyan/10 hover:border-joshway-cyan/30 transition-all text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-joshway-cyan/30 to-joshway-purple/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.title}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {p.modules.map((m: ModuleId) => (
                      <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                        {moduleMeta[m].shortLabel}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-joshway-cyan transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 px-2 text-xs text-gray-500">
          <Shield className="w-4 h-4 text-joshway-purple shrink-0 mt-0.5" />
          <p>
            Production auth (Supabase SSO) ships next. This preview uses demo personas with federated read access to legacy databases.
          </p>
        </div>
      </div>
    </div>
  );
}