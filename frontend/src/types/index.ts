// ─── Core Entities ───────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: 'student' | 'admin';
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  capacity: number;
  image_url: string | null;
  creator_id: number;
  created_at: string;
  // Computed fields returned by list/detail endpoints
  registration_count?: number;
  is_registered?: boolean;
  creator_name?: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  subject: string;
  creator_id: number;
  max_members: number;
  created_at: string;
  // Computed fields
  member_count?: number;
  is_member?: boolean;
  creator_name?: string;
  members?: User[];
}

// ─── API Request Bodies ───────────────────────────────────────────────────────

export interface CreateEventPayload {
  title: string;
  description: string;
  location: string;
  event_date: string;
  capacity: number;
  image_url?: string;
}

export interface CreateGroupPayload {
  name: string;
  description: string;
  subject: string;
  max_members: number;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardData {
  upcoming_events: Event[];
  my_groups: Group[];
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalGroups: number;
  totalRegistrations: number;
}

export interface AdminUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
