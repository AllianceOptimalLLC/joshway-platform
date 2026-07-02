export type AcademyCourseSlug = "foundation" | "bridge" | "leadership";

const ROUTES: Record<AcademyCourseSlug, string> = {
  foundation: "/academy/course/joshway-101",
  bridge: "/academy/course/bridge",
  leadership: "/academy/course/leadership",
};

export function academyCourseHref(
  slug: string,
  opts?: { resume?: boolean; retake?: boolean }
): string {
  const base = ROUTES[slug as AcademyCourseSlug] ?? `/academy/course/${slug}`;
  const params = new URLSearchParams();
  if (opts?.retake) params.set("retake", "1");
  if (opts?.resume) params.set("resume", "true");
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}