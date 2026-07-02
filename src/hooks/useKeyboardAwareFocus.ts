import { useCallback } from "react";

/**
 * Returns an onFocus handler that scrolls the focused input into view ONLY
 * when the keyboard would actually cover it. Uses visualViewport when
 * available so we don't fight iOS Safari's native keyboard avoidance.
 *
 * Behavior:
 * - On non-touch / desktop: no-op.
 * - On mobile: waits ~250ms for the keyboard animation, then checks if the
 *   element's bottom is below the visual viewport. If so, scrollIntoView
 *   with block: 'center'. Otherwise, no scroll (avoids visible jump when
 *   iOS would have handled it).
 */
export function useKeyboardAwareFocus() {
  return useCallback((e: React.FocusEvent<HTMLElement>) => {
    if (typeof window === "undefined") return;
    // Only run on coarse-pointer devices (phones / tablets)
    if (!window.matchMedia?.("(pointer: coarse)").matches) return;

    const el = e.currentTarget;
    // Wait for the on-screen keyboard to animate in before measuring
    window.setTimeout(() => {
      try {
        const rect = el.getBoundingClientRect();
        const vv = window.visualViewport;
        const visibleBottom = vv ? vv.height + vv.offsetTop : window.innerHeight;
        // Only scroll if the input is actually obscured (with small buffer)
        if (rect.bottom > visibleBottom - 8) {
          el.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      } catch {
        /* no-op */
      }
    }, 250);
  }, []);
}
