import { connectContacts } from "@/data/mock";
import { Plus, Search } from "lucide-react";

const stageColors: Record<string, string> = {
  New: "bg-blue-500/20 text-blue-300",
  Contacted: "bg-amber-500/20 text-amber-300",
  Qualified: "bg-purple-500/20 text-purple-300",
  "Ready for DonorDock": "bg-emerald-500/20 text-emerald-300",
};

export default function Connect() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">JOSHWAY Connect</h1>
          <p className="text-gray-400 text-sm">Donor relationship pipeline</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-joshway-cyan text-black text-sm font-medium">
          <Plus className="w-4 h-4" /> New Contact
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Total Contacts", value: "127" },
          { label: "Pipeline Value", value: "$340K" },
          { label: "This Month", value: "+12" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl px-5 py-4 min-w-[140px]">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg glass text-sm focus:outline-none focus:ring-1 focus:ring-joshway-cyan"
        />
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-gray-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Company</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Agent</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Est. Gift</th>
            </tr>
          </thead>
          <tbody>
            {connectContacts.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{c.company}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${stageColors[c.stage] ?? "bg-gray-500/20"}`}>
                    {c.stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{c.agent}</td>
                <td className="px-4 py-3 hidden lg:table-cell">{c.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Academy invites route through a server-side federation gateway — never hardcoded cross-project keys.
      </p>
    </div>
  );
}