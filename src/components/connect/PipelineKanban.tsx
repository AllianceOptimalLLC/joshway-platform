export interface PipelineContact {
  id: string;
  name: string;
  company: string;
  stage: string;
  agent?: string;
  amount: string;
}

interface Props {
  stages: string[];
  contacts: PipelineContact[];
  onSelect?: (id: string) => void;
}

export function PipelineKanban({ stages, contacts, onSelect }: Props) {
  const columns = stages.length
    ? stages
    : [...new Set(contacts.map((c) => c.stage))];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {columns.map((stage) => {
        const items = contacts.filter((c) => c.stage === stage);
        return (
          <div
            key={stage}
            className="flex-shrink-0 w-64 surface-card flex flex-col max-h-[420px]"
          >
            <div className="px-3 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">{stage}</span>
              <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{items.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {items.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelect?.(c.id)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-joshway-purple/30 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-sm text-white">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{c.company}</div>
                  {c.amount !== "—" && (
                    <div className="text-xs text-joshway-cyan mt-2 font-medium">{c.amount}</div>
                  )}
                </button>
              ))}
              {items.length === 0 && (
                <p className="text-xs text-gray-600 text-center py-6">No contacts</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
