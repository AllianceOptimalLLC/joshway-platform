import { getCourseProgress } from "@/lib/academy/progressStore";
import { JOSHWAY_101_ID } from "@/components/course/courseConstants";
import { BRIDGE_COURSE_ID } from "@/components/course/bridge/bridgeContent";
import { BADGE_DESCRIPTIONS, BADGE_LABELS } from "@/lib/academy/badgeConstants";

export interface EarnedBadge {
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

export function getEarnedBadges(userId: string): EarnedBadge[] {
  const earned: EarnedBadge[] = [];
  const now = new Date().toISOString();

  const foundation = getCourseProgress(userId, JOSHWAY_101_ID);
  const bridge = getCourseProgress(userId, BRIDGE_COURSE_ID);

  if (foundation && (foundation.completed_screens?.length ?? 0) > 0) {
    earned.push({
      badge_type: "first_impact",
      badge_name: BADGE_LABELS.first_impact,
      badge_description: BADGE_DESCRIPTIONS.first_impact,
      earned_at: now,
    });
  }

  if (foundation?.status === "completed" || foundation?.completion_locked) {
    earned.push({
      badge_type: "ambassador",
      badge_name: BADGE_LABELS.ambassador,
      badge_description: BADGE_DESCRIPTIONS.ambassador,
      earned_at: foundation.completed_at ?? now,
    });
  }

  if ((foundation?.retake_count ?? 0) > 0) {
    earned.push({
      badge_type: "course_retaker",
      badge_name: BADGE_LABELS.course_retaker,
      badge_description: BADGE_DESCRIPTIONS.course_retaker,
      earned_at: now,
    });
  }

  if (bridge && (bridge.completed_screens?.length ?? 0) > 0) {
    earned.push({
      badge_type: "community_builder",
      badge_name: BADGE_LABELS.community_builder,
      badge_description: BADGE_DESCRIPTIONS.community_builder,
      earned_at: now,
    });
  }

  return earned;
}