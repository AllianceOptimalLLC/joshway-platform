// JOSHWAY Bridge — Leadership Deep Dive
// 19 required screens: Welcome + 5 Pillars × 3 + 3 Pledge screens.
// First-pass copy; tone: premium, structured, leadership-forward, Apple minimalism.
// No partner names hard-coded — pillar leads referenced as "a certified subject-matter expert."

export const BRIDGE_COURSE_ID = "00000000-0000-0000-0000-000000000201";
export const BRIDGE_TOTAL_REQUIRED = 19;
export const BRIDGE_COMPLETION_VERSION = "bridge.1.0";

export interface BridgePillar {
  id: string;
  index: number; // 1-5
  name: string;
  tagline: string;
}

export const BRIDGE_PILLARS: BridgePillar[] = [
  { id: "money",   index: 1, name: "Money Smarts",        tagline: "Ownership over outcomes." },
  { id: "speak",   index: 2, name: "Speak Up & Shine",    tagline: "Leadership begins with voice." },
  { id: "digital", index: 3, name: "Digital Knowledge",   tagline: "Digital wisdom is modern leadership." },
  { id: "health",  index: 4, name: "Health & Well-Being", tagline: "Confidence starts from within." },
  { id: "future",  index: 5, name: "Future Ready",        tagline: "Preparation creates opportunity." },
];

export type BridgeScreenKind =
  | { kind: "welcome" }
  | { kind: "pillar_intro";   pillarId: string }
  | { kind: "pillar_concept"; pillarId: string }
  | { kind: "pillar_action";  pillarId: string }
  | { kind: "pledge_intro" }
  | { kind: "pledge_commit" }
  | { kind: "pledge_sign" };

export interface BridgeScreen extends Record<string, unknown> {
  index: number;
  chapterLabel: string;     // shown above headline
  eyebrow?: string;         // small label
  title: string;
  body: string;
  cta: string;
  kind: BridgeScreenKind;
}

// Pillar copy — three beats per pillar.
const PILLAR_CONTENT: Record<string, { intro: string; concept: string; action: string }> = {
  money: {
    intro: "Most students leave high school without ever being taught how money actually works. JOSHWAY changes that.",
    concept: "Money is a tool, not an identity. Students learn budgeting, credit, saving, and the long-term cost of short-term decisions — taught by a certified subject-matter expert.",
    action: "By the end of this pillar, a student can read a paycheck, build a basic budget, and explain why compounding matters more than income.",
  },
  speak: {
    intro: "Leadership is heard before it is followed. Most young people have never been given the floor — only the assignment.",
    concept: "Students learn presence, structure, and the discipline of speaking with intention. Taught by a certified subject-matter expert who has stood in front of real rooms.",
    action: "By the end of this pillar, a student can stand, structure a thought, and deliver it without apology.",
  },
  digital: {
    intro: "The digital world is the new public square. Leadership now requires fluency, not just access.",
    concept: "Students learn to think critically online — how algorithms shape attention, how to build a personal digital presence with integrity, and how to use tools without being used by them. Taught by a certified subject-matter expert.",
    action: "By the end of this pillar, a student can audit their own digital footprint and articulate the kind of leader they want their feed to reflect.",
  },
  health: {
    intro: "Resilience is not a personality trait. It is a practice — and it can be taught.",
    concept: "Students learn the rhythms of physical, mental, and emotional regulation. Sleep. Movement. Recovery. Boundaries. Taught by a certified subject-matter expert.",
    action: "By the end of this pillar, a student can identify their own stress signals and name one practice that returns them to steady.",
  },
  future: {
    intro: "Most students step into the next chapter without a map. JOSHWAY gives them one.",
    concept: "Students explore careers, college pathways, trades, and entrepreneurship — and learn to choose based on values, not pressure. Taught by a certified subject-matter expert.",
    action: "By the end of this pillar, a student can name three concrete next steps and why each one matters to them.",
  },
};

function pillarScreens(pillar: BridgePillar, baseIndex: number): BridgeScreen[] {
  const c = PILLAR_CONTENT[pillar.id];
  const chapter = `Pillar ${pillar.index} — ${pillar.name}`;
  return [
    {
      index: baseIndex,
      chapterLabel: chapter,
      eyebrow: "Why this pillar",
      title: pillar.tagline,
      body: c.intro,
      cta: "Continue",
      kind: { kind: "pillar_intro", pillarId: pillar.id },
    },
    {
      index: baseIndex + 1,
      chapterLabel: chapter,
      eyebrow: "What students learn",
      title: "The core concept.",
      body: c.concept,
      cta: "Continue",
      kind: { kind: "pillar_concept", pillarId: pillar.id },
    },
    {
      index: baseIndex + 2,
      chapterLabel: chapter,
      eyebrow: "The outcome",
      title: "Verifiable mastery.",
      body: c.action,
      cta: pillar.index === 5 ? "Continue to the Pledge" : `Continue to Pillar ${pillar.index + 1}`,
      kind: { kind: "pillar_action", pillarId: pillar.id },
    },
  ];
}

export const BRIDGE_SCREENS: BridgeScreen[] = [
  {
    index: 0,
    chapterLabel: "Welcome",
    eyebrow: "JOSHWAY Bridge",
    title: "A leadership deep dive.",
    body: "Sixteen sessions. Twenty-four hours. Five pillars. One pledge.\n\nThe Bridge is the structured path students walk to become the kind of leader their community will need next.",
    cta: "Begin the Bridge",
    kind: { kind: "welcome" },
  },
  ...pillarScreens(BRIDGE_PILLARS[0], 1),
  ...pillarScreens(BRIDGE_PILLARS[1], 4),
  ...pillarScreens(BRIDGE_PILLARS[2], 7),
  ...pillarScreens(BRIDGE_PILLARS[3], 10),
  ...pillarScreens(BRIDGE_PILLARS[4], 13),
  {
    index: 16,
    chapterLabel: "The JOSHWAY Pledge",
    eyebrow: "The Closing",
    title: "Knowledge becomes leadership only when it becomes action.",
    body: "Every student who completes the Bridge is invited to take the JOSHWAY Pledge — a personal commitment to take one verified action within the next six months.",
    cta: "Continue",
    kind: { kind: "pledge_intro" },
  },
  {
    index: 17,
    chapterLabel: "The JOSHWAY Pledge",
    eyebrow: "Your Commitment",
    title: "What will you do in the next six months?",
    body: "Write the one action you commit to — concrete enough to be true, specific enough to be verified.",
    cta: "Continue",
    kind: { kind: "pledge_commit" },
  },
  {
    index: 18,
    chapterLabel: "The JOSHWAY Pledge",
    eyebrow: "Take the Pledge",
    title: "I commit.",
    body: "By taking the Pledge, you are entering a community of people moving from knowledge to action. JOSHWAY will follow up with you within six months.",
    cta: "Take the Pledge",
    kind: { kind: "pledge_sign" },
  },
];

if (BRIDGE_SCREENS.length !== BRIDGE_TOTAL_REQUIRED) {
  // Dev-time invariant — surfaces if content drifts from DB total_screens
  // eslint-disable-next-line no-console
  console.warn(
    `[Bridge] Screen count mismatch: ${BRIDGE_SCREENS.length} screens vs BRIDGE_TOTAL_REQUIRED=${BRIDGE_TOTAL_REQUIRED}`,
  );
}
