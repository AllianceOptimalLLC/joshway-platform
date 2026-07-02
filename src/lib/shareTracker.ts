import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/academy/logger";

/**
 * Increment share_count on the user's profile atomically via RPC.
 * The DB trigger will auto-award "Media Amplifier" badge at 3.
 */
export const incrementShareCount = async (userId: string) => {
  try {
    const { error } = await supabase.rpc("increment_share_count", {
      user_id: userId,
    });
    if (error) {
      logger.error("Failed to increment share count:", String(error));
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error("incrementShareCount error:", message);
  }
};
