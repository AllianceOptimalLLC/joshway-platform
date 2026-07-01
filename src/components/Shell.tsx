import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ChevronDown, Sparkles, LogOut, Wifi } from "lucide-react";
import { federationStatus } from "@/lib/supabase/clients";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { personas, type ModuleId } from "@/data/mock";
import { moduleMeta } from "@/data/modules";

export function Shell() {
  const { persona, setPersona, logout } = useAuth();
  const fed = federationStatus();
  const [pickerOpen, setPickerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const visibleModules = (Object.keys(moduleMeta) as ModuleId[]).filter((id) =>
    persona.modules.includes(id)
  );

  const currentModule = visibleModules.find((id) => location.pathname.startsWith(moduleMeta[id].path));

  return (
    <div className="min-h-screen flex bg-joshway-dark bg-mesh">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-white/[0.06] bg-joshway-surface/60 backdrop-blur-xl z-40">
        <div className="p-5 border-b border-white/[0.06]">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-joshway-cyan to-joshway-purple flex items-center justify-center font-extrabold text-joshway-dark text-lg shadow-glow">
              J
            </div>
            <div>
              <div className="font-bold text-white tracking-tight">JOSHWAY</div>
              <div className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Platform</div>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-pill-active" : "nav-pill-inactive")}>
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Home
          </NavLink>
          <div className="pt-4 pb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Your modules
          </div>
          {visibleModules.map((id) => {
            const m = moduleMeta[id];
            return (
              <NavLink
                key={id}
                to={m.path}
                className={({ isActive }) => (isActive ? "nav-pill-active" : "nav-pill-inactive")}
              >
                <m.icon className="w-4 h-4 shrink-0" />
                {m.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06]">
          <PersonaButton
            persona={persona}
            open={pickerOpen}
            onToggle={() => setPickerOpen(!pickerOpen)}
            onClose={() => setPickerOpen(false)}
            onSelect={(p) => {
              setPersona(p);
              setPickerOpen(false);
              navigate("/");
            }}
            onSignOut={() => {
              logout();
              setPickerOpen(false);
              navigate("/login");
            }}
            fullWidth
          />
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-50 border-b border-white/[0.06] bg-joshway-surface/80 backdrop-blur-xl">
          <div className="px-4 h-14 flex items-center justify-between gap-3">
            <NavLink to="/" className="font-bold gradient-text">JOSHWAY</NavLink>
            <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 justify-center">
              <NavLink to="/" end className={({ isActive }) => `px-2 py-1 text-xs rounded-lg ${isActive ? "text-joshway-cyan" : "text-gray-500"}`}>
                Home
              </NavLink>
              {visibleModules.map((id) => (
                <NavLink
                  key={id}
                  to={moduleMeta[id].path}
                  className={({ isActive }) => `px-2 py-1 text-xs rounded-lg whitespace-nowrap ${isActive ? "text-joshway-cyan" : "text-gray-500"}`}
                >
                  {moduleMeta[id].shortLabel}
                </NavLink>
              ))}
            </nav>
            <button onClick={() => setPickerOpen(!pickerOpen)} className="w-8 h-8 rounded-full bg-gradient-to-br from-joshway-cyan/30 to-joshway-purple/30 text-xs font-bold shrink-0">
              {persona.name.split(" ").map((n) => n[0]).join("")}
            </button>
          </div>
          {pickerOpen && (
            <MobilePersonaPicker
              persona={persona}
              onClose={() => setPickerOpen(false)}
              onSelect={(p) => {
                setPersona(p);
                setPickerOpen(false);
                navigate("/");
              }}
            />
          )}
        </header>

        {/* Status strip */}
        <div className="border-b border-joshway-cyan/10 bg-gradient-to-r from-joshway-cyan/5 via-transparent to-joshway-purple/5 px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-joshway-cyan shrink-0" />
            <Wifi className={`w-3.5 h-3.5 shrink-0 ${fed.live ? "text-emerald-400" : "text-amber-400"}`} />
            <span>
              {fed.live ? (
                <>
                  <span className="text-emerald-400 font-medium">Federated</span>
                  {" · "}4 live Supabase DBs · mock fallback where RLS blocks anon reads
                </>
              ) : (
                <>
                  <span className="text-joshway-cyan font-medium">Preview</span>
                  {" · "}Configure VITE_*_SUPABASE env vars for live data
                </>
              )}
            </span>
            {currentModule && (
              <span className="ml-auto hidden sm:inline text-gray-500">
                {moduleMeta[currentModule].tagline}
              </span>
            )}
          </div>
        </div>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PersonaButton({
  persona,
  open,
  onToggle,
  onClose,
  onSelect,
  onSignOut,
  fullWidth,
}: {
  persona: (typeof personas)[0];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (p: (typeof personas)[0]) => void;
  onSignOut: () => void;
  fullWidth?: boolean;
}) {
  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <button
        onClick={onToggle}
        className={`flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left ${fullWidth ? "w-full p-3" : "px-3 py-2"}`}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-joshway-cyan/40 to-joshway-purple/40 flex items-center justify-center text-xs font-bold shrink-0">
          {persona.name.split(" ").map((n) => n[0]).join("")}
        </div>
        {fullWidth && (
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{persona.name}</div>
            <div className="text-xs text-gray-500 truncate">{persona.title}</div>
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute bottom-full left-0 right-0 mb-2 surface-card z-50 overflow-hidden shadow-2xl">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500 border-b border-white/[0.06]">
              Switch persona (demo)
            </div>
            <button
              onClick={onSignOut}
              className="w-full text-left px-3 py-2.5 text-xs text-gray-500 hover:text-gray-300 border-b border-white/[0.06] flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className={`w-full text-left px-3 py-3 hover:bg-white/[0.04] transition-colors flex items-center gap-3 ${p.id === persona.id ? "bg-joshway-cyan/10" : ""}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.title}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobilePersonaPicker({
  persona,
  onClose,
  onSelect,
}: {
  persona: (typeof personas)[0];
  onClose: () => void;
  onSelect: (p: (typeof personas)[0]) => void;
}) {
  return (
    <div className="border-t border-white/[0.06] bg-joshway-elevated p-3 space-y-1">
      {personas.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${p.id === persona.id ? "bg-joshway-cyan/15 text-white" : "text-gray-400"}`}
        >
          {p.name} · <span className="text-gray-500">{p.title}</span>
        </button>
      ))}
      <button onClick={onClose} className="w-full flex items-center justify-center gap-1 py-2 text-xs text-gray-500">
        <LogOut className="w-3 h-3" /> Close
      </button>
    </div>
  );
}