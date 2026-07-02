import { useQuery } from "@tanstack/react-query";
import { missionDb } from "@/lib/supabase/clients";
import { maskName } from "@/lib/mask";

export interface PayoutRow {
  id: string;
  smeMasked: string;
  status: string;
  amount: number | null;
  verified: boolean;
  checklistDone: number;
  checklistTotal: number;
}

export interface MissionOpsData {
  source: "live" | "mock";
  payouts: PayoutRow[];
  totals: {
    invoices: number;
    paid: number;
    pending: number;
    paidAmount: number;
    pendingAmount: number;
  };
}

const MOCK_OPS: MissionOpsData = {
  source: "mock",
  payouts: [
    { id: "mock-1", smeMasked: "A. R.", status: "paid", amount: 450, verified: true, checklistDone: 4, checklistTotal: 4 },
    { id: "mock-2", smeMasked: "T. B.", status: "pending", amount: 300, verified: true, checklistDone: 3, checklistTotal: 4 },
    { id: "mock-3", smeMasked: "K. M.", status: "submitted", amount: 450, verified: false, checklistDone: 1, checklistTotal: 4 },
  ],
  totals: { invoices: 3, paid: 1, pending: 2, paidAmount: 450, pendingAmount: 750 },
};

const PAID_STATUSES = new Set(["paid", "complete", "completed"]);

/**
 * Read-only SME payout summary from live `invoices`. Names are masked to
 * initials — this surface exists to showcase ops visibility, not PII.
 */
export function useMissionOps() {
  return useQuery({
    queryKey: ["mission", "ops"],
    queryFn: async (): Promise<MissionOpsData> => {
      if (!missionDb) return MOCK_OPS;
      const { data, error } = await missionDb
        .from("invoices")
        .select(
          "id, first_name, last_name, status, payment_amount, is_sme_verified, checklist_contract_on_file, checklist_agreement_signed, checklist_scheduling_confirmed, checklist_manager_approval"
        )
        .order("created_at", { ascending: false })
        .limit(50);
      if (error || !data?.length) return MOCK_OPS;

      const payouts: PayoutRow[] = data.map((r) => {
        const checklist = [
          r.checklist_contract_on_file,
          r.checklist_agreement_signed,
          r.checklist_scheduling_confirmed,
          r.checklist_manager_approval,
        ];
        return {
          id: r.id,
          smeMasked: maskName(r.first_name, r.last_name),
          status: (r.status as string) ?? "submitted",
          amount: typeof r.payment_amount === "number" ? r.payment_amount : r.payment_amount ? Number(r.payment_amount) : null,
          verified: r.is_sme_verified === true,
          checklistDone: checklist.filter(Boolean).length,
          checklistTotal: checklist.length,
        };
      });

      const paidRows = payouts.filter((p) => PAID_STATUSES.has(p.status.toLowerCase()));
      const pendingRows = payouts.filter((p) => !PAID_STATUSES.has(p.status.toLowerCase()));
      return {
        source: "live",
        payouts,
        totals: {
          invoices: payouts.length,
          paid: paidRows.length,
          pending: pendingRows.length,
          paidAmount: paidRows.reduce((s, p) => s + (p.amount ?? 0), 0),
          pendingAmount: pendingRows.reduce((s, p) => s + (p.amount ?? 0), 0),
        },
      };
    },
    staleTime: 60_000,
  });
}
