import { useQuery } from "@tanstack/react-query";
import { academyDb } from "@/lib/supabase/clients";
import { academyVaultItems as mockVault } from "@/data/mock";

export interface VaultItem {
  id: string;
  title: string;
  source: string | null;
  caption: string | null;
  embed_url: string | null;
  thumbnail_url: string | null;
  sort_order: number | null;
}

/** Read-only Media Vault — live `video_vault_items` with mock fallback. No writes. */
export function useAcademyVault() {
  return useQuery({
    queryKey: ["academy", "vault"],
    queryFn: async () => {
      if (academyDb) {
        const { data, error } = await academyDb
          .from("video_vault_items")
          .select("id, title, source, caption, embed_url, thumbnail_url, sort_order")
          .eq("is_active", true)
          .order("sort_order");
        if (!error && data?.length) {
          return { source: "live" as const, items: data as VaultItem[] };
        }
      }
      return { source: "mock" as const, items: mockVault as VaultItem[] };
    },
    staleTime: 60_000,
  });
}
