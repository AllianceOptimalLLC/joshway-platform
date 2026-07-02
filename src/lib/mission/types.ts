export interface MissionProgramSummary {
  id: string;
  name: string;
  site: string;
  sessions: number;
  captains: number;
  status: string;
  programType?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface MissionProgramDetail {
  id: string;
  program_name: string;
  school_name: string;
  status: string;
  program_type: string;
  start_date: string | null;
  end_date: string | null;
  approved_session_count: number | null;
  expected_student_count: number | null;
  address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  grade_levels: string[] | null;
  discovery_notes: string | null;
  preferred_days: string[] | null;
  preferred_time_of_day: string | null;
  sponsor_name: string | null;
  has_sponsor: boolean;
}

export interface MissionSession {
  id: string;
  session_title: string;
  session_date: string | null;
  session_time: string | null;
  session_type: string;
  location: string | null;
  scheduling_status: string | null;
  display_order: number;
}

export interface MissionSiteCaptain {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}