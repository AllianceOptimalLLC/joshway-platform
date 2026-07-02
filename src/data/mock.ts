export type ModuleId = "academy" | "connect" | "basecamp" | "mission";
export type PersonaId = "student" | "agent" | "staff" | "admin" | "educator";

export interface Persona {
  id: PersonaId;
  name: string;
  email: string;
  title: string;
  modules: ModuleId[];
}

export const personas: Persona[] = [
  {
    id: "admin",
    name: "David Chen",
    email: "david@joshway.org",
    title: "Program Director",
    modules: ["academy", "connect", "basecamp", "mission"],
  },
  {
    id: "agent",
    name: "Maria Santos",
    email: "maria@joshway.org",
    title: "Development Agent",
    modules: ["connect", "basecamp"],
  },
  {
    id: "staff",
    name: "James Okonkwo",
    email: "james@joshway.org",
    title: "Operations Staff",
    modules: ["basecamp", "mission"],
  },
  {
    id: "student",
    name: "Aisha Williams",
    email: "aisha@student.edu",
    title: "Bridge Student",
    modules: ["academy", "mission"],
  },
  {
    id: "educator",
    name: "Dr. Elena Park",
    email: "elena@school.edu",
    title: "Educator Partner",
    modules: ["mission"],
  },
];

export const academyCourses = [
  { slug: "foundation", name: "JOSHWAY 101", progress: 100, status: "completed" as const },
  { slug: "bridge", name: "The Bridge", progress: 45, status: "in_progress" as const },
  { slug: "leadership", name: "Leadership Lab", progress: 0, status: "locked" as const },
];

export const academyBadges = [
  "First Impact", "Community Builder", "Bridge Graduate", "Ambassador",
];

export const connectContacts = [
  {
    id: "1", name: "Robert Kim", company: "Kim Family Foundation", stage: "Qualified", agent: "Maria Santos", amount: "$25,000",
    email: "robert@kimfoundation.org", phone: "(215) 555-0147", type: "Foundation", source: "Warm intro",
    tags: ["major-donor", "education-focus"],
    notes: [
      { date: "2026-06-18", author: "Maria Santos", text: "Met at the spring gala. Family foundation focused on youth education equity. Wants to see Bridge program outcomes data before committing." },
      { date: "2026-06-02", author: "Maria Santos", text: "Intro call went well. Asked for our 990 and program budget breakdown." },
    ],
    activity: [
      { date: "2026-06-25", kind: "email", text: "Sent Bridge Spring 2026 outcomes one-pager" },
      { date: "2026-06-18", kind: "meeting", text: "In-person meeting at gala" },
      { date: "2026-06-02", kind: "call", text: "Discovery call (32 min)" },
      { date: "2026-05-20", kind: "stage", text: "Moved to Qualified" },
    ],
  },
  {
    id: "2", name: "Sarah Mitchell", company: "Mitchell Group", stage: "Contacted", agent: "Maria Santos", amount: "$10,000",
    email: "sarah.m@mitchellgroup.com", phone: "(267) 555-0182", type: "Corporate", source: "Website form",
    tags: ["corporate-match", "volunteer-interest"],
    notes: [
      { date: "2026-06-20", author: "Maria Santos", text: "Interested in employee volunteer days paired with a corporate match. HR team reviewing." },
    ],
    activity: [
      { date: "2026-06-20", kind: "call", text: "Follow-up call — match program discussion" },
      { date: "2026-06-10", kind: "email", text: "Welcome sequence sent" },
      { date: "2026-06-08", kind: "stage", text: "Moved to Contacted" },
    ],
  },
  {
    id: "3", name: "James Torres", company: "Torres Industries", stage: "New", agent: "Unassigned", amount: "—",
    email: "jtorres@torresind.com", phone: "(610) 555-0139", type: "Individual", source: "Referral",
    tags: ["new-lead"],
    notes: [],
    activity: [
      { date: "2026-06-28", kind: "stage", text: "Lead created from referral form" },
    ],
  },
  {
    id: "4", name: "Linda Chen", company: "Chen Philanthropy", stage: "Ready for DonorDock", agent: "Maria Santos", amount: "$50,000",
    email: "linda@chenphilanthropy.org", phone: "(215) 555-0164", type: "Foundation", source: "Board connection",
    tags: ["major-donor", "multi-year", "board-connected"],
    notes: [
      { date: "2026-06-26", author: "Maria Santos", text: "Verbal commitment for $50k over 2 years. Ready to sync to DonorDock for pledge tracking." },
      { date: "2026-06-12", author: "Maria Santos", text: "Site visit to Lincoln High Bridge session. Very impressed with student presentations." },
    ],
    activity: [
      { date: "2026-06-26", kind: "meeting", text: "Commitment meeting — $50k/2yr verbal" },
      { date: "2026-06-12", kind: "meeting", text: "Bridge session site visit" },
      { date: "2026-06-01", kind: "stage", text: "Moved to Ready for DonorDock" },
    ],
  },
];

export const academyVaultItems = [
  { id: "mock-v1", title: "JOSHWAY Story — Founder Cut", source: "YouTube", caption: "David Robertson on why JOSHWAY exists.", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail_url: "", sort_order: 1 },
  { id: "mock-v2", title: "Bridge Highlights — Spring 2026", source: "YouTube", caption: "Student voices from the Spring Bridge cohort.", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail_url: "", sort_order: 2 },
  { id: "mock-v3", title: "Money Smarts in 90 Seconds", source: "YouTube", caption: "Pillar 1 explainer for partners.", embed_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail_url: "", sort_order: 3 },
];

export const baseCampVotes = [
  { id: "mock-b1", candidate_name: "Jordan Ellis", candidate_role: "Board Member — Finance", motivation: "20 years in nonprofit finance; wants to build JOSHWAY's first multi-year budget model.", status: "open", outcome: null as string | null, created_at: "2026-06-15", support_areas: ["Finance", "Audit"] },
  { id: "mock-b2", candidate_name: "Dana Whitfield", candidate_role: "Board Member — Partnerships", motivation: "School district relationships across the region; can open doors for Bridge expansion.", status: "closed", outcome: "approved", created_at: "2026-05-28", support_areas: ["Partnerships", "Education"] },
];

export const overlapPollsMock = [
  { id: "mock-p1", title: "Q3 Board Planning Session", description: "Pick a 2-hour block for Q3 planning.", date_start: "2026-07-06", date_end: "2026-07-17", organizer_name: "David Robertson", meeting_minutes: 120, locked_slot_utc: null as string | null, created_at: "2026-06-25" },
];

export const baseCampApps = [
  { name: "Academy", url: "/academy", category: "Programs" },
  { name: "Connect Hub", url: "/connect", category: "Fundraising" },
  { name: "Mission Control", url: "/mission", category: "Operations" },
  { name: "DonorDock", url: "#", category: "Integrations" },
  { name: "Airtable Roster", url: "#", category: "Team" },
];

export const baseCampTickets = [
  { id: "T-1042", subject: "VPN access for new volunteer", status: "Open", priority: "Medium" },
  { id: "T-1041", subject: "Laptop setup — Bridge cohort", status: "In Progress", priority: "High" },
];

export const missionStudents = [
  { name: "Aisha Williams", school: "Lincoln High", progress: 68, pillar: "Money Smarts" },
  { name: "Marcus Johnson", school: "Riverside Academy", progress: 42, pillar: "Speak Up & Shine" },
  { name: "Priya Patel", school: "Westside Prep", progress: 91, pillar: "Future Ready" },
];

export const missionPrograms = [
  { id: "mock-spring-bridge", name: "Spring Bridge 2026", site: "Philadelphia", sessions: 12, captains: 3, status: "Active" },
  { id: "mock-summer-lab", name: "Summer Leadership Lab", site: "Baltimore", sessions: 8, captains: 2, status: "Planning" },
];

export const securityImprovements = [
  "Single Supabase Auth with auth.uid() RLS on all tables",
  "Signed JWT admin tokens — no localStorage adminId in request bodies",
  "Federation gateway for cross-module actions (no embedded API keys)",
  "AdminRoute guards on all privileged routes",
  "Rate-limited login with constant-time responses",
  "Column-level revocation on sensitive fields (password_hash, tokens)",
  "Server-audited impersonation with expiry tokens",
];