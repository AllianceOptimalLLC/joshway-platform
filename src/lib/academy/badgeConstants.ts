import ambassadorBadge from "@/assets/joshway-ambassador-badge.png";
import mediaAmplifierBadge from "@/assets/badge-media-amplifier.png";
import feedbackChampionBadge from "@/assets/badge-feedback-champion.png";
import contributorBadge from "@/assets/badge-contributor.png";
import communityBuilderBadge from "@/assets/badge-community-builder.png";
import networkBuilderBadge from "@/assets/badge-network-builder.png";
import movementMakerBadge from "@/assets/badge-movement-maker.png";
import courseRetakerBadge from "@/assets/badge-course-retaker.png";
import superSharerBadge from "@/assets/badge-super-sharer.png";
import firstImpactBadge from "@/assets/badge-first-impact.png";
import missionMultiplierBadge from "@/assets/badge-mission-multiplier.png";

export const BADGE_IMAGES: Record<string, string> = {
  ambassador: ambassadorBadge,
  media_amplifier: mediaAmplifierBadge,
  feedback_champion: feedbackChampionBadge,
  contributor: contributorBadge,
  community_builder: communityBuilderBadge,
  network_builder: networkBuilderBadge,
  movement_maker: movementMakerBadge,
  course_retaker: courseRetakerBadge,
  super_sharer: superSharerBadge,
  first_impact: firstImpactBadge,
  mission_multiplier: missionMultiplierBadge,
};

export const BADGE_LABELS: Record<string, string> = {
  ambassador: "Ambassador",
  media_amplifier: "Media Amplifier",
  feedback_champion: "Feedback Champion",
  contributor: "Contributor",
  community_builder: "Community Builder",
  network_builder: "Network Builder",
  movement_maker: "Movement Maker",
  course_retaker: "Course Retaker",
  super_sharer: "Super Sharer",
  first_impact: "First Impact",
  mission_multiplier: "Mission Multiplier",
};

export const BADGE_DESCRIPTIONS: Record<string, string> = {
  ambassador: "Completed JOSHWAY 101 and aligned with the mission.",
  first_impact: "Started your leadership journey in the Academy.",
  course_retaker: "Returned to deepen your understanding of the mission.",
  community_builder: "Invited others to join the movement.",
  network_builder: "Expanded your network for collective impact.",
  media_amplifier: "Shared the mission across your channels.",
  movement_maker: "Multiplied the mission beyond yourself.",
};

export const SHOWCASE_BADGE_TYPES = [
  "first_impact",
  "ambassador",
  "community_builder",
  "network_builder",
  "course_retaker",
  "feedback_champion",
  "media_amplifier",
  "movement_maker",
] as const;