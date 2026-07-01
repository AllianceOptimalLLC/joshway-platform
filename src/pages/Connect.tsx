import { connectContacts } from "@/data/mock";
import { Plus, Search, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

const stageStyles: Record<string, string> = {
  New: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  Contacted: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  Qualified: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  "Ready for DonorDock": "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

export default function Connect() {
  return (
    <div className="module-accent-connect space-y-8">
      <PageHeader
        eyebrow="JOSHWAY Connect"
        title="Donor Pipeline"
        subtitle="Relationship intelligence for your development team"
        action={
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> New Contact
          </button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard label="Total contacts" value="127" icon={TrendingUp} accent="purple" />
        <StatCard label="Pipeline value" value="$340K" accent="cyan" />
        <StatCard label="New this month" value="+12" trend="↑ 8% vs last month" accent="emerald" />
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          placeholder="Search contacts, companies, tags..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl surface-card text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-joshway-purple/40 focus:border-joshway-purple/30"
        />
      </div>

      <div className="table-shell">
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden sm:table-cell">Company</th>
              <th>Stage</th>
              <th className="hidden md:table-cell">Agent</th>
              <th className="hidden lg:table-cell text-right">Est. gift</th>
            </tr>
          </thead>
          <tbody>
            {connectContacts.map((c) => (
              <tr key={c.id} className="cursor-pointer">
                <td className="font-semibold text-white">{c.name}</td>
                <td className="hidden sm:table-cell text-gray-400">{c.company}</td>
                <td>
                  <span className={`badge-pill border ${stageStyles[c.stage] ?? "bg-gray-500/15 text-gray-400"}`}>
                    {c.stage}
                  </span>
                </td>
                <td className="hidden md:table-cell text-gray-400">{c.agent}</td>
                <td className="hidden lg:table-cell text-right font-medium text-joshway-cyan">{c.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}