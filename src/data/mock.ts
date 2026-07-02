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
  { id: "1", name: "Robert Kim", company: "Kim Family Foundation", stage: "Qualified", agent: "Maria Santos", amount: "$25,000" },
  { id: "2", name: "Sarah Mitchell", company: "Mitchell Group", stage: "Contacted", agent: "Maria Santos", amount: "$10,000" },
  { id: "3", name: "James Torres", company: "Torres Industries", stage: "New", agent: "Unassigned", amount: "—" },
  { id: "4", name: "Linda Chen", company: "Chen Philanthropy", stage: "Ready for DonorDock", agent: "Maria Santos", amount: "$50,000" },
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