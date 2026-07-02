import { useQuery } from "@tanstack/react-query";
import { connectDb } from "@/lib/supabase/clients";
import { connectContacts as mockContacts } from "@/data/mock";

export interface ContactNote {
  date: string;
  author: string;
  text: string;
}

export interface ContactActivity {
  date: string;
  kind: string;
  text: string;
}

export interface ContactDetailData {
  id: string;
  name: string;
  company: string;
  stage: string;
  agent: string;
  amount: string;
  email?: string;
  phone?: string;
  type?: string;
  source?: string;
  tags: string[];
  notes: ContactNote[];
  activity: ContactActivity[];
}

function fromMock(id: string): ContactDetailData | null {
  const c = mockContacts.find((m) => m.id === id);
  if (!c) return null;
  return {
    ...c,
    tags: c.tags ?? [],
    notes: c.notes ?? [],
    activity: c.activity ?? [],
  };
}

/**
 * Read-only contact detail. Attempts a live read (RLS currently blocks anon on
 * `contacts`, so this returns mock in practice) — live-ready for the federation
 * gateway without any code change here.
 */
export function useConnectContact(contactId: string | undefined) {
  return useQuery({
    queryKey: ["connect", "contact", contactId],
    enabled: !!contactId,
    queryFn: async (): Promise<{ source: "live" | "mock"; contact: ContactDetailData } | null> => {
      if (!contactId) return null;

      if (connectDb) {
        const { data, error } = await connectDb
          .from("contacts")
          .select("id, first_name, last_name, company, email, phone, created_at, stages(name)")
          .eq("id", contactId)
          .maybeSingle();
        if (!error && data) {
          return {
            source: "live" as const,
            contact: {
              id: data.id,
              name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "—",
              company: data.company ?? "—",
              stage: (data.stages as { name?: string } | null)?.name ?? "New",
              agent: "—",
              amount: "—",
              email: data.email ?? undefined,
              phone: data.phone ?? undefined,
              tags: [],
              notes: [],
              activity: [],
            },
          };
        }
      }

      const mock = fromMock(contactId);
      if (!mock) throw new Error("Contact not found");
      return { source: "mock" as const, contact: mock };
    },
    staleTime: 60_000,
  });
}
