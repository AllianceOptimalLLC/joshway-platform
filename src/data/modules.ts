import { GraduationCap, Users, Tent, Radar } from "lucide-react";
import type { ModuleId } from "./mock";

export const moduleMeta: Record<
  ModuleId,
  {
    label: string;
    shortLabel: string;
    path: string;
    icon: typeof GraduationCap;
    desc: string;
    tagline: string;
    accentClass: string;
    gradient: string;
  }
> = {
  academy: {
    label: "Academy",
    shortLabel: "Learn",
    path: "/academy",
    icon: GraduationCap,
    desc: "Courses, badges, ambassador toolkit",
    tagline: "Your Leadership Pathway",
    accentClass: "module-accent-academy",
    gradient: "from-joshway-cyan/25 via-joshway-cyan/5 to-transparent",
  },
  connect: {
    label: "Connect",
    shortLabel: "CRM",
    path: "/connect",
    icon: Users,
    desc: "Donor CRM, pipeline, referrals",
    tagline: "Relationship intelligence",
    accentClass: "module-accent-connect",
    gradient: "from-joshway-purple/25 via-joshway-purple/5 to-transparent",
  },
  basecamp: {
    label: "Base Camp",
    shortLabel: "Hub",
    path: "/basecamp",
    icon: Tent,
    desc: "Staff hub, help desk, scheduling",
    tagline: "Internal operations",
    accentClass: "module-accent-basecamp",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  },
  mission: {
    label: "Mission Control",
    shortLabel: "Ops",
    path: "/mission",
    icon: Radar,
    desc: "Bridge programs, students, operations",
    tagline: "Program command center",
    accentClass: "module-accent-mission",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
  },
};