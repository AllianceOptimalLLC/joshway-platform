/**
 * JOSHWAY Academy — Unified Motion Language
 *
 * One easing, one durations table, one set of screen/content transitions.
 * Inspired by Apple, MasterClass, Linear: calm, intentional, cinematic.
 */

// Apple-style "ease-out expo" feel — fast start, soft settle. No bounce.
export const EASE_NARRATIVE = [0.22, 1, 0.36, 1] as const;

export const DURATIONS = {
  micro: 0.2,      // tab content swaps, in-place state changes
  content: 0.3,    // small UI shifts
  screen: 0.5,     // full screen chapter transitions
  hero: 0.6,       // hero/headline entrances
} as const;

/** Stagger step between sibling cards / list items. */
export const STAGGER_STEP = 0.1;

/** Full screen-to-screen "page turn" transition. */
export const screenTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: DURATIONS.screen, ease: EASE_NARRATIVE },
};

/** In-place content swap (e.g. Our Model tabs). Container stays still. */
export const contentSwap = {
  initial: { opacity: 0.7, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: DURATIONS.micro, ease: EASE_NARRATIVE },
};

/** Hero / headline entrance. */
export const heroEnter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATIONS.hero, ease: EASE_NARRATIVE },
};

/** Staggered card entrance. Pass `index` to compute delay. */
export const cardEnter = (index = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: 0.1 + index * STAGGER_STEP,
    duration: DURATIONS.screen,
    ease: EASE_NARRATIVE,
  },
});
