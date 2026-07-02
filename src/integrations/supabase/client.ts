/**
 * Academy-local Supabase shim — persists course_progress to localStorage only.
 * No writes to live customer databases.
 */
import {
  getCourseProgress,
  upsertCourseProgress,
  lockCompletionLocal,
  type CourseProgressRow,
} from "@/lib/academy/progressStore";

const FOUNDER_CONTENT = {
  content_json: {
    founder_photo_url: "",
    opening_message:
      "I'm David Robertson.\n\nWe built JOSHWAY because no young person should feel invisible.\n\nWhat you're about to experience matters.\n\nBegin.",
  },
};

const NOOP_TABLES = new Set(["event_logs", "academy_feedback"]);

class QueryBuilder {
  private filters: { col: string; val: unknown }[] = [];
  private mode: "select" | "update" | "insert" = "select";
  private payload: Record<string, unknown> = {};

  constructor(private table: string) {}

  select(_cols?: string) {
    this.mode = "select";
    return this;
  }

  eq(col: string, val: unknown) {
    this.filters.push({ col, val });
    return this;
  }

  // Chainable no-ops so Lovable-ported queries don't throw on the shim
  limit(_n: number) {
    return this;
  }

  order(_col: string, _opts?: { ascending?: boolean }) {
    return this;
  }

  in(_col: string, _vals: unknown[]) {
    return this;
  }

  update(data: Record<string, unknown>) {
    this.mode = "update";
    this.payload = data;
    return this;
  }

  insert(data: Record<string, unknown> | Record<string, unknown>[]) {
    this.mode = "insert";
    this.payload = Array.isArray(data) ? data[0] : data;
    return this;
  }

  maybeSingle(): Promise<{ data: any; error: null }> {
    return Promise.resolve({ data: this.run(), error: null });
  }

  single() {
    return this.maybeSingle();
  }

  then<TResult1 = { data: unknown; error: null }, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return Promise.resolve({ data: this.run(), error: null as null }).then(onfulfilled, onrejected);
  }

  private findProgress(): CourseProgressRow | null {
    const userId = this.filters.find((f) => f.col === "user_id")?.val as string | undefined;
    const courseId = this.filters.find((f) => f.col === "course_id")?.val as string | undefined;
    const id = this.filters.find((f) => f.col === "id")?.val as string | undefined;

    if (userId && courseId) return getCourseProgress(userId, courseId);
    if (id) {
      const raw = localStorage.getItem("joshway-platform:academy-progress");
      if (!raw) return null;
      const store = JSON.parse(raw) as Record<string, CourseProgressRow>;
      return Object.values(store).find((r) => r.id === id) ?? null;
    }
    return null;
  }

  private run(): unknown {
    if (NOOP_TABLES.has(this.table)) return null;
    if (this.table === "academy_content") return FOUNDER_CONTENT;

    if (this.table !== "course_progress") return null;

    if (this.mode === "select") return this.findProgress();

    if (this.mode === "update") {
      const existing = this.findProgress();
      if (!existing) return null;
      return upsertCourseProgress(existing.user_id, existing.course_id, {
        ...this.payload,
      } as Partial<CourseProgressRow>);
    }

    if (this.mode === "insert") {
      const userId = this.payload.user_id as string;
      const courseId = this.payload.course_id as string;
      return upsertCourseProgress(userId, courseId, this.payload as Partial<CourseProgressRow>);
    }

    return null;
  }
}

export const supabase = {
  from(table: string) {
    return new QueryBuilder(table);
  },
  rpc(fn: string, args: Record<string, unknown>) {
    if (fn === "lock_completion") {
      const data = lockCompletionLocal(
        args.p_user_id as string,
        args.p_course_id as string,
        args.p_completed_screens as number[] | null | undefined,
        args.p_version as string | undefined
      );
      return Promise.resolve({ data, error: null as { message: string } | null });
    }
    if (fn === "increment_share_count") {
      return Promise.resolve({ data: { success: true }, error: null as { message: string } | null });
    }
    return Promise.resolve({ data: null, error: null as { message: string } | null });
  },
  auth: {
    getSession: async () => ({ data: { session: null }, error: null as null }),
  },
  storage: {
    from: () => ({
      getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
    }),
  },
  functions: {
    invoke: async (_name: string, _opts?: { body?: unknown }) => ({
      data: { ok: true, sent: 1 },
      error: null as null,
    }),
  },
};