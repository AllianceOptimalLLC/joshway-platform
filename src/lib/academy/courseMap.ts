import { JOSHWAY_101_ID } from "@/components/course/courseConstants";
import { BRIDGE_COURSE_ID } from "@/components/course/bridge/bridgeContent";

export const SLUG_TO_COURSE_ID: Record<string, string> = {
  foundation: JOSHWAY_101_ID,
  "joshway-101": JOSHWAY_101_ID,
  bridge: BRIDGE_COURSE_ID,
};

export function slugToCourseId(slug: string): string | undefined {
  return SLUG_TO_COURSE_ID[slug] ?? SLUG_TO_COURSE_ID[slug.toLowerCase()];
}